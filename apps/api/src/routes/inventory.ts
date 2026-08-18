import "cookie-parser";
import "../types/express";
import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db, inventoryItemsTable, type InventoryItem } from "@workspace/db";

const router: IRouter = Router();

/** "healthy" | "watch" | "low", derived from on-hand vs. par level (never stored — always current). */
export function stockStatus(item: Pick<InventoryItem, "onHand" | "parLevel">): "healthy" | "watch" | "low" {
  if (item.onHand < item.parLevel * 0.75) return "low";
  if (item.onHand < item.parLevel) return "watch";
  return "healthy";
}

function serialize(item: InventoryItem) {
  const { lastCountedAt, ...rest } = item;
  return { ...rest, status: stockStatus(item), lastCounted: lastCountedAt.toISOString() };
}

router.get("/inventory", async (_req, res) => {
  const items = await db.select().from(inventoryItemsTable).orderBy(asc(inventoryItemsTable.name));
  res.json(items.map(serialize));
});

const countSchema = z.object({ onHand: z.number().min(0) });

router.post("/inventory/:id/count", async (req, res) => {
  const parsed = countSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const [item] = await db
    .update(inventoryItemsTable)
    .set({ onHand: parsed.data.onHand, lastCountedAt: new Date() })
    .where(eq(inventoryItemsTable.id, req.params.id))
    .returning();

  if (!item) return res.status(404).json({ error: "Inventory item not found" });
  return res.json(serialize(item));
});

export default router;
