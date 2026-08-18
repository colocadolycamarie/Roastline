import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db, shiftsTable, staffTable, type Shift, type Staff } from "@workspace/db";
import { requireRole } from "../middleware/session";

const router: IRouter = Router();

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

/** "On shift" if a published shift covers right now today, "Scheduled" if one is upcoming, otherwise "Off today". */
function staffStatus(shifts: Shift[]): "On shift" | "Scheduled" | "Off today" {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const today = now.toLocaleDateString("en-US", { weekday: "short" });

  const todaysShifts = shifts.filter((shift) => shift.status === "published" && shift.day.startsWith(today));
  if (
    todaysShifts.some(
      (shift) => timeToMinutes(shift.startTime) <= nowMinutes && nowMinutes < timeToMinutes(shift.endTime),
    )
  ) {
    return "On shift";
  }
  if (todaysShifts.some((shift) => timeToMinutes(shift.startTime) > nowMinutes)) {
    return "Scheduled";
  }
  return "Off today";
}

function hoursThisWeek(shifts: Shift[]): number {
  const totalMinutes = shifts
    .filter((shift) => shift.status === "published")
    .reduce((sum, shift) => sum + Math.max(0, timeToMinutes(shift.endTime) - timeToMinutes(shift.startTime)), 0);
  return Math.round((totalMinutes / 60) * 10) / 10;
}

function serialize(staff: Staff, shifts: Shift[]) {
  return {
    id: staff.id,
    name: staff.name,
    role: staff.role,
    color: staff.color,
    initials: initialsOf(staff.name),
    hoursThisWeek: hoursThisWeek(shifts),
    status: staffStatus(shifts),
  };
}

router.get("/staff", async (_req, res) => {
  const [staff, shifts] = await Promise.all([
    db.select().from(staffTable).orderBy(asc(staffTable.name)),
    db.select().from(shiftsTable),
  ]);
  res.json(staff.map((member) => serialize(member, shifts.filter((shift) => shift.staffId === member.id))));
});

router.get("/shifts", async (_req, res) => {
  const [shifts, staff] = await Promise.all([db.select().from(shiftsTable), db.select().from(staffTable)]);
  const staffById = new Map(staff.map((member) => [member.id, member]));
  res.json(
    shifts.map((shift) => ({
      ...shift,
      start: shift.startTime,
      end: shift.endTime,
      staffName: staffById.get(shift.staffId)?.name ?? "Team member",
    })),
  );
});

const createShiftSchema = z.object({
  staffId: z.uuid(),
  day: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
});

router.post("/shifts", requireRole("owner", "manager", "shift_lead"), async (req, res) => {
  const parsed = createShiftSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const [staff] = await db.select().from(staffTable).where(eq(staffTable.id, parsed.data.staffId)).limit(1);
  if (!staff) return res.status(400).json({ error: "Unknown staff member" });

  const [shift] = await db
    .insert(shiftsTable)
    .values({
      staffId: parsed.data.staffId,
      day: parsed.data.day,
      startTime: parsed.data.start,
      endTime: parsed.data.end,
    })
    .returning();

  return res.status(201).json({ ...shift, start: shift.startTime, end: shift.endTime, staffName: staff.name });
});

export default router;
