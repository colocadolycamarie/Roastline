import type { PublicStaff } from "@workspace/db";

declare global {
  namespace Express {
    interface Request {
      staff?: PublicStaff;
    }
  }
}

export {};
