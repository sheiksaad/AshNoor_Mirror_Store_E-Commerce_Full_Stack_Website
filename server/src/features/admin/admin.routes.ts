import { Router } from "express";
import { getAnalyticsData, getCustomers, getStats } from "./admin.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));

router.get("/stats", asyncHandler(getStats));
router.get("/customers", asyncHandler(getCustomers));
router.get("/analytics", asyncHandler(getAnalyticsData));

export default router;