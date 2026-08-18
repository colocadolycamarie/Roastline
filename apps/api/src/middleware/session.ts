import { randomBytes } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { and, eq, gt } from "drizzle-orm";
import { db, sessionsTable, staffTable, type PublicStaff } from "@workspace/db";

export const SESSION_COOKIE = "roastline_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      staff?: PublicStaff;
    }
  }
}

export async function createSession(staffId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessionsTable).values({ token, staffId, expiresAt });
  return { token, expiresAt };
}

export async function destroySession(token: string): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
}

/** Attaches `req.staff` when a valid, unexpired session cookie is present. Never blocks the request. */
export async function attachSession(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return next();

  const [row] = await db
    .select({ staff: staffTable })
    .from(sessionsTable)
    .innerJoin(staffTable, eq(staffTable.id, sessionsTable.staffId))
    .where(and(eq(sessionsTable.token, token), gt(sessionsTable.expiresAt, new Date())))
    .limit(1);

  if (row) {
    const { passwordHash: _passwordHash, ...publicStaff } = row.staff;
    req.staff = publicStaff;
  }

  return next();
}

/** Rejects the request with 401 unless {@link attachSession} found a valid session. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.staff) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  return next();
}

/** Rejects the request with 403 unless the authenticated staff member has one of `roles`. */
export function requireRole(...roles: PublicStaff["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.staff) return res.status(401).json({ error: "Not authenticated" });
    if (!roles.includes(req.staff.role)) {
      return res.status(403).json({ error: "Not authorized" });
    }
    return next();
  };
}
