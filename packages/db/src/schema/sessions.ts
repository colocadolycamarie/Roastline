import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { staffTable } from "./staff";

export const sessionsTable = pgTable("sessions", {
  token: text("token").primaryKey(),
  staffId: uuid("staff_id")
    .notNull()
    .references(() => staffTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type Session = typeof sessionsTable.$inferSelect;
