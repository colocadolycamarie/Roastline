import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const staffRoleValues = ["owner", "manager", "shift_lead", "barista"] as const;
export type StaffRole = (typeof staffRoleValues)[number];

export const staffTable = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: staffRoleValues }).notNull().default("barista"),
  color: text("color").notNull().default("blue"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStaffSchema = createInsertSchema(staffTable, {
  email: (schema) => schema.email(),
}).omit({ id: true, passwordHash: true, createdAt: true });
export type InsertStaff = z.infer<typeof insertStaffSchema>;

export const staffSchema = createSelectSchema(staffTable).omit({ passwordHash: true });
export type Staff = typeof staffTable.$inferSelect;
export type PublicStaff = Omit<Staff, "passwordHash">;
