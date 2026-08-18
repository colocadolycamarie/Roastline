import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const inventoryItemsTable = pgTable("inventory_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  onHand: numeric("on_hand", { precision: 12, scale: 3, mode: "number" }).notNull().default(0),
  parLevel: numeric("par_level", { precision: 12, scale: 3, mode: "number" }).notNull().default(0),
  costPerUnitCents: integer("cost_per_unit_cents").notNull().default(0),
  lastCountedAt: timestamp("last_counted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItemsTable).omit({
  id: true,
  lastCountedAt: true,
});
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItemsTable.$inferSelect;
