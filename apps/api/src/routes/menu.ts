import "cookie-parser";
import "../types/express";
import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  db,
  inventoryItemsTable,
  menuCategoriesTable,
  menuItemRecipeLinesTable,
  menuItemsTable,
  modifierGroupsTable,
  modifierOptionsTable,
} from "@workspace/db";

const router: IRouter = Router();

async function loadMenu() {
  const [categories, items, recipeLines, inventoryItems, modifierGroups, modifierOptions] = await Promise.all([
    db.select().from(menuCategoriesTable).orderBy(asc(menuCategoriesTable.sortOrder)),
    db.select().from(menuItemsTable).orderBy(asc(menuItemsTable.name)),
    db.select().from(menuItemRecipeLinesTable),
    db.select().from(inventoryItemsTable),
    db.select().from(modifierGroupsTable).orderBy(asc(modifierGroupsTable.sortOrder)),
    db.select().from(modifierOptionsTable).orderBy(asc(modifierOptionsTable.sortOrder)),
  ]);

  const inventoryById = new Map(inventoryItems.map((item) => [item.id, item]));

  return {
    categories,
    items: items.map((item) => ({
      ...item,
      recipe: recipeLines
        .filter((line) => line.menuItemId === item.id)
        .map((line) => {
          const ingredient = inventoryById.get(line.inventoryItemId);
          return ingredient ? `${line.quantityPerOrder} ${ingredient.unit} ${ingredient.name}` : line.quantityPerOrder;
        }),
    })),
    modifierGroups: modifierGroups.map((group) => ({
      ...group,
      options: modifierOptions.filter((option) => option.groupId === group.id),
    })),
  };
}

router.get("/menu", async (_req, res) => {
  res.json(await loadMenu());
});

const createMenuItemSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(1),
  description: z.string().default(""),
  priceCents: z.number().int().min(0),
  imageUrl: z.url().optional(),
});

router.post("/menu/items", async (req, res) => {
  const parsed = createMenuItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const [item] = await db.insert(menuItemsTable).values(parsed.data).returning();
  return res.status(201).json({ ...item, recipe: [] });
});

const availabilitySchema = z.object({ available: z.boolean() });

router.patch("/menu/items/:id/availability", async (req, res) => {
  const parsed = availabilitySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const [item] = await db
    .update(menuItemsTable)
    .set({ available: parsed.data.available })
    .where(eq(menuItemsTable.id, req.params.id))
    .returning();

  if (!item) return res.status(404).json({ error: "Menu item not found" });
  return res.json({ ...item, recipe: [] });
});

export default router;
