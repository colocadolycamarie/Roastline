import { integer, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { menuItemsTable } from "./menu";

export const orderChannelValues = ["pos", "online"] as const;
export type OrderChannel = (typeof orderChannelValues)[number];

export const orderStatusValues = ["queued", "preparing", "ready", "completed", "cancelled"] as const;
export type OrderStatus = (typeof orderStatusValues)[number];

export const orderPaymentMethodValues = ["card", "cash"] as const;
export type OrderPaymentMethod = (typeof orderPaymentMethodValues)[number];

export const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Human-friendly sequential number, rendered as `RL-${orderNumber}`.
  orderNumber: serial("order_number").notNull(),
  // Idempotency key supplied by the ordering client (POS terminal or online
  // checkout) so a retried submission never creates a duplicate order.
  clientGeneratedUuid: uuid("client_generated_uuid").notNull().unique(),
  channel: text("channel", { enum: orderChannelValues }).notNull(),
  status: text("status", { enum: orderStatusValues }).notNull().default("queued"),
  totalCents: integer("total_cents").notNull(),
  paymentMethod: text("payment_method", { enum: orderPaymentMethodValues }).notNull(),
  customerName: text("customer_name").notNull().default("Walk-in"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItemsTable = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  menuItemId: uuid("menu_item_id").references(() => menuItemsTable.id, { onDelete: "set null" }),
  // Item name at time of purchase, kept even if the menu item is later renamed/removed.
  nameSnapshot: text("name_snapshot").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPriceCents: integer("unit_price_cents").notNull(),
});

export const createOrderItemSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

export const createOrderSchema = createInsertSchema(ordersTable)
  .pick({ channel: true, paymentMethod: true, customerName: true, clientGeneratedUuid: true })
  .extend({ items: z.array(createOrderItemSchema).min(1) });
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export type Order = typeof ordersTable.$inferSelect;
export type OrderItem = typeof orderItemsTable.$inferSelect;
