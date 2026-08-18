import "cookie-parser";
import "../types/express";
import { Router, type IRouter } from "express";
import { asc, count, gte, sql } from "drizzle-orm";
import { db, loyaltyCustomersTable, loyaltyTiersTable, loyaltyTransactionsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/loyalty", async (_req, res) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [tiers, customers, [{ totalMembers }], [{ pointsIssued }], activeCustomerIds, [{ redemptions }]] =
    await Promise.all([
      db.select().from(loyaltyTiersTable).orderBy(asc(loyaltyTiersTable.sortOrder)),
      db.select().from(loyaltyCustomersTable),
      db.select({ totalMembers: count() }).from(loyaltyCustomersTable),
      db
        .select({ pointsIssued: sql<number>`coalesce(sum(greatest(${loyaltyTransactionsTable.pointsDelta}, 0)), 0)` })
        .from(loyaltyTransactionsTable)
        .where(gte(loyaltyTransactionsTable.createdAt, startOfMonth)),
      db
        .selectDistinct({ customerId: loyaltyTransactionsTable.customerId })
        .from(loyaltyTransactionsTable)
        .where(gte(loyaltyTransactionsTable.createdAt, startOfMonth)),
      db
        .select({ redemptions: sql<number>`count(*) filter (where ${loyaltyTransactionsTable.pointsDelta} < 0)` })
        .from(loyaltyTransactionsTable)
        .where(gte(loyaltyTransactionsTable.createdAt, startOfMonth)),
    ]);

  const sortedTiers = [...tiers].sort((a, b) => b.pointsThreshold - a.pointsThreshold);
  const tierForPoints = (points: number) =>
    sortedTiers.find((tier) => points >= tier.pointsThreshold) ?? sortedTiers[sortedTiers.length - 1];

  res.json({
    members: totalMembers,
    activeThisMonth: activeCustomerIds.length,
    pointsIssued: Number(pointsIssued),
    redemptionRate:
      activeCustomerIds.length > 0 ? Math.round((Number(redemptions) / activeCustomerIds.length) * 100) : 0,
    tiers: tiers.map((tier) => ({
      name: tier.name,
      points: tier.pointsThreshold,
      reward: tier.reward,
      members: customers.filter((customer) => tierForPoints(customer.points)?.id === tier.id).length,
    })),
  });
});

export default router;
