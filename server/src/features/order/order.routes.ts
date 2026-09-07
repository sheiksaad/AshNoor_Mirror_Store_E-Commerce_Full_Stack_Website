import { Router } from "express";
import * as ctrl from "./order.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();
router.use(authenticate);

router.post("/", asyncHandler(ctrl.postOrder));
router.post("/:orderId/confirm-payment", asyncHandler(ctrl.postConfirmPayment));
router.get("/", asyncHandler(ctrl.getMyOrders));
router.get("/admin/all", authorize("ADMIN"), asyncHandler(ctrl.getAllOrders));
router.patch("/admin/:orderId/status", authorize("ADMIN"), asyncHandler(ctrl.patchOrderStatus));

export default router;