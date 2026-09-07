import { Router } from "express";
import * as ctrl from "./review.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

router.get("/product/:productId", asyncHandler(ctrl.getProductReviews));
router.post("/", authenticate, asyncHandler(ctrl.postReview));

export default router;