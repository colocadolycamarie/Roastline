import "cookie-parser";
import "./types/express";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import app from "./app";
import { logger } from "./lib/logger";

const port = Number(process.env["PORT"] ?? 4000);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env["PORT"]}"`);
}

async function waitForDatabase(maxAttempts = 10, delayMs = 500): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await db.execute(sql`select 1`);
      return;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      logger.warn({ attempt }, "Database not ready yet, retrying");
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

waitForDatabase()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Could not reach the database, exiting");
    process.exit(1);
  });
