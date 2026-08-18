import { boolean, integer, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { inventoryItemsTable } from "./inventory";

export const menuCategoriesTable = pgTable("menu_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const menuItemsTable = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => menuCategoriesTable.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  available: boolean("available").notNull().default(true),
  bestseller: boolean("bestseller").notNull().default(false),
  color: text("color").notNull().default("neutral"),
  imageUrl: text("image_url"),
});

// A recipe line consumes a quantity of an inventory item (in that item's own
// unit) when the menu item is ordered — this is what lets order creation
// decrement real stock instead of guessing from a text summary.
export const menuItemRecipeLinesTable = pgTable("menu_item_recipe_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  menuItemId: uuid("menu_item_id")
    .notNull()
    .references(() => menuItemsTable.id, { onDelete: "cascade" }),
  inventoryItemId: uuid("inventory_item_id")
    .notNull()
    .references(() => inventoryItemsTable.id, { onDelete: "restrict" }),
  quantityPerOrder: numeric("quantity_per_order", { precision: 12, scale: 3, mode: "number" }).notNull(),
});

export const modifierGroupsTable = pgTable("modifier_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  required: boolean("required").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const modifierOptionsTable = pgTable("modifier_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id")
    .notNull()
    .references(() => modifierGroupsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  priceDeltaCents: integer("price_delta_cents").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({
  id: true,
  available: true,
  bestseller: true,
});
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type MenuCategory = typeof menuCategoriesTable.$inferSelect;
export type MenuItem = typeof menuItemsTable.$inferSelect;
export type ModifierGroup = typeof modifierGroupsTable.$inferSelect;
export type ModifierOption = typeof modifierOptionsTable.$inferSelect;
