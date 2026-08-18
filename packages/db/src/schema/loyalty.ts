import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const loyaltyTiersTable = pgTable("loyalty_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  pointsThreshold: integer("points_threshold").notNull().default(0),
  reward: text("reward").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const loyaltyCustomersTable = pgTable("loyalty_customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").unique(),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// An append-only ledger of point issuance/redemption. `pointsIssued` and
// month-over-month activity in the loyalty snapshot are computed from this,
// rather than stored as a single mutable counter.
export const loyaltyTransactionsTable = pgTable("loyalty_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => loyaltyCustomersTable.id, { onDelete: "cascade" }),
  pointsDelta: integer("points_delta").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLoyaltyCustomerSchema = createInsertSchema(loyaltyCustomersTable, {
  email: (schema) => schema.email(),
}).omit({ id: true, points: true, createdAt: true });
export type InsertLoyaltyCustomer = z.infer<typeof insertLoyaltyCustomerSchema>;

export type LoyaltyTier = typeof loyaltyTiersTable.$inferSelect;
export type LoyaltyCustomer = typeof loyaltyCustomersTable.$inferSelect;
export type LoyaltyTransaction = typeof loyaltyTransactionsTable.$inferSelect;
