import { Router } from "express";
import * as ctrl from "./coupon.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));

router.post("/", asyncHandler(ctrl.postCoupon));
router.get("/", asyncHandler(ctrl.getCoupons));
router.patch("/:id/deactivate", asyncHandler(ctrl.patchDeactivateCoupon));

export default router;