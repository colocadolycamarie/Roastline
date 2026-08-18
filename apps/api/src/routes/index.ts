import { Router, type IRouter } from "express";
import { requireAuth } from "../middleware/session";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import healthRouter from "./health";
import inventoryRouter from "./inventory";
import loyaltyRouter from "./loyalty";
import menuRouter from "./menu";
import ordersRouter from "./orders";
import reportsRouter from "./reports";
import staffRouter from "./staff";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);

// Every operational route below requires an authenticated session.
router.use(requireAuth, dashboardRouter);
router.use(requireAuth, menuRouter);
router.use(requireAuth, inventoryRouter);
router.use(requireAuth, ordersRouter);
router.use(requireAuth, staffRouter);
router.use(requireAuth, loyaltyRouter);
router.use(requireAuth, reportsRouter);

export default router;
