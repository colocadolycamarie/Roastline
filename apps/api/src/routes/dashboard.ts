import "cookie-parser";
import "../types/express";
import { Router, type IRouter } from "express";
import { and, desc, gte, lt, sql } from "drizzle-orm";
import { db, inventoryItemsTable, ordersTable } from "@workspace/db";
import { stockStatus } from "./inventory";

const router: IRouter = Router();

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

router.get("/dashboard", async (_req, res) => {
  const today = startOfDay(new Date());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const [todayOrders, yesterdayOrders, inventoryItems, recentOrders] = await Promise.all([
    db.select().from(ordersTable).where(gte(ordersTable.createdAt, today)),
    db.select().from(ordersTable).where(and(gte(ordersTable.createdAt, yesterday), lt(ordersTable.createdAt, today))),
    db.select().from(inventoryItemsTable),
    db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(6),
  ]);

  const todaySalesCents = todayOrders.reduce((sum, order) => sum + order.totalCents, 0);
  const yesterdaySalesCents = yesterdayOrders.reduce((sum, order) => sum + order.totalCents, 0);
  const salesChangePercent =
    yesterdaySalesCents > 0 ? Math.round(((todaySalesCents - yesterdaySalesCents) / yesterdaySalesCents) * 100) : 0;

  const salesByHour = Array.from({ length: 12 }, (_, i) => {
    const hour = 7 + i; // 7am–6pm storefront hours
    const value = todayOrders
      .filter((order) => order.createdAt.getHours() === hour)
      .reduce((sum, order) => sum + order.totalCents, 0);
    return { label: hour <= 12 ? `${hour}a` : `${hour - 12}p`, value: value / 100 };
  });

  res.json({
    todaySalesCents,
    salesChangePercent,
    ordersToday: todayOrders.length,
    averageTicketCents: todayOrders.length > 0 ? Math.round(todaySalesCents / todayOrders.length) : 0,
    // Not yet computable: the staff schema has no hourly wage field, so
    // labor cost can't be derived from data that doesn't exist. Wiring this
    // up for real requires adding wages to `staff` and clocked hours to
    // `shifts`, tracked as a follow-up rather than faked here.
    laborPercent: 0,
    lowStockCount: inventoryItems.filter((item) => stockStatus(item) === "low").length,
    openTickets: todayOrders.filter((order) => order.status === "queued" || order.status === "preparing").length,
    salesByHour,
    recentActivity: recentOrders.map((order) => ({
      id: order.id,
      title: `Order RL-${order.orderNumber}`,
      detail: `${order.customerName} · ${(order.totalCents / 100).toFixed(2)}`,
      time: order.createdAt.toISOString(),
      tone: order.status === "cancelled" ? "warning" : "positive",
    })),
  });
});

export default router;
