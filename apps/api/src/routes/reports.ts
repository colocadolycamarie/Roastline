import "cookie-parser";
import "../types/express";
import { Router, type IRouter } from "express";
import { gte } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";

const router: IRouter = Router();

const TAX_RATE = 0.0875;

router.get("/reports/sales", async (_req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const orders = await db
    .select()
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, since));

  const completedOrders = orders.filter((order) => order.status !== "cancelled");
  const grossSalesCents = completedOrders.reduce((sum, order) => sum + order.totalCents, 0);
  const taxCents = Math.round(grossSalesCents * TAX_RATE);
  const netSalesCents = grossSalesCents - taxCents;

  const daily = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
    const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000);
    const value = completedOrders
      .filter((order) => order.createdAt >= day && order.createdAt < nextDay)
      .reduce((sum, order) => sum + order.totalCents, 0);
    return { label: day.toLocaleDateString("en-US", { weekday: "short" }), value: value / 100 };
  });

  res.json({
    periodLabel: "Last 7 days",
    totalSalesCents: grossSalesCents,
    grossSalesCents,
    netSalesCents,
    taxCents,
    tipsCents: 0, // Not yet tracked: `orders` has no tip field.
    averageTicketCents: completedOrders.length > 0 ? Math.round(grossSalesCents / completedOrders.length) : 0,
    daily,
  });
});

export default router;
