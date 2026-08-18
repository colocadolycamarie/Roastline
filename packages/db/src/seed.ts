/**
 * Seeds reference/catalog data for local development: menu categories and
 * items, modifier groups, inventory items, and loyalty tiers, plus a single
 * bootstrap "owner" staff account so there's someone who can log in.
 *
 * This is NOT run automatically — a production deployment starts with an
 * empty database and is populated through the app's own CRUD endpoints.
 * Run explicitly with: `pnpm --filter @workspace/db run seed`
 */
import { hashPassword } from "./auth";
import { db, pool } from "./index";
import {
  inventoryItemsTable,
  loyaltyTiersTable,
  menuCategoriesTable,
  menuItemRecipeLinesTable,
  menuItemsTable,
  modifierGroupsTable,
  modifierOptionsTable,
  staffTable,
} from "./schema";

async function seed() {
  const ownerEmail = process.env.SEED_OWNER_EMAIL ?? "owner@roastline.test";
  const ownerPassword = process.env.SEED_OWNER_PASSWORD ?? "roastline-dev";

  const [owner] = await db
    .insert(staffTable)
    .values({
      name: "Store Owner",
      email: ownerEmail,
      passwordHash: await hashPassword(ownerPassword),
      role: "owner",
      color: "plum",
    })
    .onConflictDoNothing({ target: staffTable.email })
    .returning();

  if (owner) {
    console.log(`Created owner account: ${ownerEmail} / ${ownerPassword}`);
  } else {
    console.log(`Owner account ${ownerEmail} already exists, skipping.`);
  }

  const categories = await db
    .insert(menuCategoriesTable)
    .values([
      { name: "Coffee", sortOrder: 1 },
      { name: "Espresso", sortOrder: 2 },
      { name: "Tea & More", sortOrder: 3 },
      { name: "Bakery", sortOrder: 4 },
    ])
    .returning();

  const byName = (name: string) => categories.find((c) => c.name === name)!.id;

  const inventoryItems = await db
    .insert(inventoryItemsTable)
    .values([
      { name: "House espresso beans", unit: "kg", onHand: 6.4, parLevel: 10, costPerUnitCents: 2400 },
      { name: "Oat milk", unit: "L", onHand: 14, parLevel: 18, costPerUnitCents: 480 },
      { name: "Whole milk", unit: "L", onHand: 26, parLevel: 20, costPerUnitCents: 210 },
      { name: "Cacao powder", unit: "kg", onHand: 1.8, parLevel: 2, costPerUnitCents: 1550 },
      { name: "Butter croissants", unit: "each", onHand: 18, parLevel: 24, costPerUnitCents: 185 },
      { name: "Ceremonial matcha", unit: "kg", onHand: 0.65, parLevel: 0.5, costPerUnitCents: 7200 },
      { name: "Jasmine sachets", unit: "each", onHand: 32, parLevel: 40, costPerUnitCents: 42 },
    ])
    .returning();

  const invByName = (name: string) => inventoryItems.find((i) => i.name === name)!.id;

  const menuItems = await db
    .insert(menuItemsTable)
    .values([
      { categoryId: byName("Coffee"), name: "Oat Milk Latte", description: "Double espresso, velvety oat milk", priceCents: 575, bestseller: true, color: "latte", imageUrl: "https://images.unsplash.com/photo-1576343209181-360ef7d9ad5c?w=800&h=800&fit=crop&auto=format&q=80" },
      { categoryId: byName("Espresso"), name: "Cortado", description: "Equal parts espresso and steamed milk", priceCents: 450, bestseller: true, color: "cortado", imageUrl: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800&h=800&fit=crop&auto=format&q=80" },
      { categoryId: byName("Coffee"), name: "Cold Brew", description: "Slow-steeped for 18 hours", priceCents: 495, color: "coldbrew", imageUrl: "https://images.unsplash.com/photo-1759259639356-6eee63241869?w=800&h=800&fit=crop&auto=format&q=80" },
      { categoryId: byName("Tea & More"), name: "Ceremonial Matcha", description: "Stone-ground matcha, choice of milk", priceCents: 625, color: "matcha", imageUrl: "https://images.unsplash.com/photo-1560148196-df61132466ce?w=800&h=800&fit=crop&auto=format&q=80" },
      { categoryId: byName("Coffee"), name: "Dark Mocha", description: "Cacao, espresso, steamed milk", priceCents: 625, color: "mocha", imageUrl: "https://images.unsplash.com/photo-1521868212215-fb62189f1889?w=800&h=800&fit=crop&auto=format&q=80" },
      { categoryId: byName("Bakery"), name: "Butter Croissant", description: "Flaky, laminated, baked this morning", priceCents: 425, bestseller: true, color: "croissant", imageUrl: "https://images.unsplash.com/photo-1548538931-b47653628cdc?w=800&h=800&fit=crop&auto=format&q=80" },
      { categoryId: byName("Bakery"), name: "Banana Bread", description: "Toasted walnut, brown sugar crumb", priceCents: 475, color: "banana", imageUrl: "https://images.unsplash.com/photo-1675712841671-cbcbe2c84103?w=800&h=800&fit=crop&auto=format&q=80" },
      { categoryId: byName("Tea & More"), name: "Jasmine Green Tea", description: "Whole-leaf jasmine green tea", priceCents: 400, available: false, color: "tea", imageUrl: "https://images.unsplash.com/photo-1559175892-a918b243dac0?w=800&h=800&fit=crop&auto=format&q=80" },
    ])
    .returning();

  const itemByName = (name: string) => menuItems.find((i) => i.name === name)!.id;

  await db.insert(menuItemRecipeLinesTable).values([
    { menuItemId: itemByName("Oat Milk Latte"), inventoryItemId: invByName("House espresso beans"), quantityPerOrder: 0.018 },
    { menuItemId: itemByName("Oat Milk Latte"), inventoryItemId: invByName("Oat milk"), quantityPerOrder: 0.25 },
    { menuItemId: itemByName("Cortado"), inventoryItemId: invByName("House espresso beans"), quantityPerOrder: 0.018 },
    { menuItemId: itemByName("Cortado"), inventoryItemId: invByName("Whole milk"), quantityPerOrder: 0.09 },
    { menuItemId: itemByName("Dark Mocha"), inventoryItemId: invByName("House espresso beans"), quantityPerOrder: 0.018 },
    { menuItemId: itemByName("Dark Mocha"), inventoryItemId: invByName("Cacao powder"), quantityPerOrder: 0.03 },
    { menuItemId: itemByName("Dark Mocha"), inventoryItemId: invByName("Whole milk"), quantityPerOrder: 0.25 },
    { menuItemId: itemByName("Ceremonial Matcha"), inventoryItemId: invByName("Ceremonial matcha"), quantityPerOrder: 0.003 },
    { menuItemId: itemByName("Butter Croissant"), inventoryItemId: invByName("Butter croissants"), quantityPerOrder: 1 },
    { menuItemId: itemByName("Jasmine Green Tea"), inventoryItemId: invByName("Jasmine sachets"), quantityPerOrder: 1 },
  ]);

  const modifierGroups = await db
    .insert(modifierGroupsTable)
    .values([
      { name: "Size", required: true, sortOrder: 1 },
      { name: "Milk", required: false, sortOrder: 2 },
      { name: "Extras", required: false, sortOrder: 3 },
    ])
    .returning();

  const groupByName = (name: string) => modifierGroups.find((g) => g.name === name)!.id;

  await db.insert(modifierOptionsTable).values([
    { groupId: groupByName("Size"), name: "Regular", priceDeltaCents: 0, sortOrder: 1 },
    { groupId: groupByName("Size"), name: "Large", priceDeltaCents: 75, sortOrder: 2 },
    { groupId: groupByName("Milk"), name: "Whole", priceDeltaCents: 0, sortOrder: 1 },
    { groupId: groupByName("Milk"), name: "Oat", priceDeltaCents: 75, sortOrder: 2 },
    { groupId: groupByName("Milk"), name: "Almond", priceDeltaCents: 75, sortOrder: 3 },
    { groupId: groupByName("Extras"), name: "Extra shot", priceDeltaCents: 100, sortOrder: 1 },
    { groupId: groupByName("Extras"), name: "Vanilla", priceDeltaCents: 75, sortOrder: 2 },
  ]);

  await db.insert(loyaltyTiersTable).values([
    { name: "Regular", pointsThreshold: 0, reward: "Join the club", sortOrder: 1 },
    { name: "Neighborhood", pointsThreshold: 250, reward: "Free flavor add-on", sortOrder: 2 },
    { name: "House Favorite", pointsThreshold: 750, reward: "Free drink", sortOrder: 3 },
  ]);

  console.log("Seed complete.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
