import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { staffTable } from "./staff";

export const shiftStatusValues = ["draft", "published"] as const;
export type ShiftStatus = (typeof shiftStatusValues)[number];

export const shiftsTable = pgTable("shifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffId: uuid("staff_id")
    .notNull()
    .references(() => staffTable.id, { onDelete: "cascade" }),
  // NOTE: stored as a short display label ("Mon", "Wed, Oct 9") rather than a
  // real date, matching the current scheduling UI's week-view contract. This
  // is a known simplification to revisit when the scheduling UI is rebuilt
  // with a proper calendar model.
  day: text("day").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  status: text("status", { enum: shiftStatusValues }).notNull().default("draft"),
});

export const insertShiftSchema = createInsertSchema(shiftsTable).omit({ id: true, status: true });
export type InsertShift = z.infer<typeof insertShiftSchema>;
export type Shift = typeof shiftsTable.$inferSelect;
