import "cookie-parser";
import "../types/express";
import { Router, type IRouter } from "express";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod/v4";
import {
  db,
  inventoryItemsTable,
  menuItemRecipeLinesTable,
  menuItemsTable,
  orderChannelValues,
  orderItemsTable,
  orderPaymentMethodValues,
  ordersTable,
  orderStatusValues,
  type Order,
  type OrderItem,
} from "@workspace/db";

const router: IRouter = Router();

function serialize(order: Order, items: OrderItem[]) {
  const itemSummary = items
    .map((item) => (item.quantity > 1 ? `${item.quantity} × ${item.nameSnapshot}` : item.nameSnapshot))
    .join(" · ");
  return { ...order, id: `RL-${order.orderNumber}`, itemSummary };
}

router.get("/orders", async (_req, res) => {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(100);
  if (orders.length === 0) return res.json([]);

  const items = await db
    .select()
    .from(orderItemsTable)
    .where(inArray(orderItemsTable.orderId, orders.map((order) => order.id)));

  return res.json(orders.map((order) => serialize(order, items.filter((item) => item.orderId === order.id))));
});

// The ordering client (POS or online checkout) sends real menu item
// references so stock can be decremented accurately from each item's recipe,
// rather than guessed from a free-text summary.
const createOrderSchema = z.object({
  clientGeneratedUuid: z.uuid(),
  channel: z.enum(orderChannelValues),
  paymentMethod: z.enum(orderPaymentMethodValues),
  customerName: z.string().default("Walk-in"),
  items: z.array(z.object({ menuItemId: z.uuid(), quantity: z.number().int().min(1).default(1) })).min(1),
});

router.post("/orders", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const input = parsed.data;

  const [existing] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.clientGeneratedUuid, input.clientGeneratedUuid))
    .limit(1);
  if (existing) {
    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, existing.id));
    return res.status(201).json(serialize(existing, items));
  }

  const menuItems = await db
    .select()
    .from(menuItemsTable)
    .where(inArray(menuItemsTable.id, input.items.map((line) => line.menuItemId)));
  const menuItemById = new Map(menuItems.map((item) => [item.id, item]));

  for (const line of input.items) {
    if (!menuItemById.has(line.menuItemId)) {
      return res.status(400).json({ error: `Unknown menu item: ${line.menuItemId}` });
    }
  }

  const totalCents = input.items.reduce(
    (sum, line) => sum + menuItemById.get(line.menuItemId)!.priceCents * line.quantity,
    0,
  );

  const order = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(ordersTable)
      .values({
        clientGeneratedUuid: input.clientGeneratedUuid,
        channel: input.channel,
        paymentMethod: input.paymentMethod,
        customerName: input.customerName,
        totalCents,
      })
      .returning();

    await tx.insert(orderItemsTable).values(
      input.items.map((line) => ({
        orderId: created.id,
        menuItemId: line.menuItemId,
        nameSnapshot: menuItemById.get(line.menuItemId)!.name,
        quantity: line.quantity,
        unitPriceCents: menuItemById.get(line.menuItemId)!.priceCents,
      })),
    );

    const recipeLines = await tx
      .select()
      .from(menuItemRecipeLinesTable)
      .where(inArray(menuItemRecipeLinesTable.menuItemId, input.items.map((line) => line.menuItemId)));

    for (const line of input.items) {
      for (const recipeLine of recipeLines.filter((r) => r.menuItemId === line.menuItemId)) {
        await tx
          .update(inventoryItemsTable)
          .set({
            onHand: sql`greatest(0, ${inventoryItemsTable.onHand} - ${recipeLine.quantityPerOrder * line.quantity})`,
          })
          .where(eq(inventoryItemsTable.id, recipeLine.inventoryItemId));
      }
    }

    return created;
  });

  const savedItems = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  return res.status(201).json(serialize(order, savedItems));
});

const statusSchema = z.object({ status: z.enum(orderStatusValues) });

router.patch("/orders/:id/status", async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const orderNumber = Number(req.params.id.replace(/^RL-/, ""));
  if (!Number.isFinite(orderNumber)) return res.status(404).json({ error: "Order not found" });

  const [order] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.orderNumber, orderNumber))
    .returning();

  if (!order) return res.status(404).json({ error: "Order not found" });
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  return res.json(serialize(order, items));
});

export default router;
