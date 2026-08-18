import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { count, eq } from "drizzle-orm";
import { db, hashPassword, staffTable, verifyPassword } from "@workspace/db";
import { createSession, destroySession, requireAuth, SESSION_COOKIE } from "../middleware/session";

const router: IRouter = Router();

const isProduction = process.env.NODE_ENV === "production";

function setSessionCookie(res: import("express").Response, token: string, expiresAt: Date) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

// Only succeeds once: the very first account created becomes the "owner" and
// registration closes after that. Every account after is created by an
// authenticated owner/manager via POST /api/staff.
router.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const [{ staffCount }] = await db.select({ staffCount: count() }).from(staffTable);
  if (staffCount > 0) {
    return res.status(403).json({ error: "Registration is closed. Ask an owner to create your account." });
  }

  const [staff] = await db
    .insert(staffTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      role: "owner",
    })
    .returning();

  const { token, expiresAt } = await createSession(staff.id);
  setSessionCookie(res, token, expiresAt);
  const { passwordHash: _passwordHash, ...publicStaff } = staff;
  return res.status(201).json(publicStaff);
});

const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });

router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const [staff] = await db.select().from(staffTable).where(eq(staffTable.email, parsed.data.email)).limit(1);
  const passwordValid = staff && (await verifyPassword(parsed.data.password, staff.passwordHash));
  if (!staff || !passwordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { token, expiresAt } = await createSession(staff.id);
  setSessionCookie(res, token, expiresAt);
  const { passwordHash: _passwordHash, ...publicStaff } = staff;
  return res.json(publicStaff);
});

router.post("/auth/logout", async (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) await destroySession(token);
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  return res.status(204).end();
});

router.get("/auth/me", requireAuth, (req, res) => {
  res.json(req.staff);
});

export default router;
