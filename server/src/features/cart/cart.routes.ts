import { Router } from "express";
import * as ctrl from "./cart.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

router.use(authenticate); // every cart route requires login

router.get("/", asyncHandler(ctrl.getMyCart));
router.post("/", asyncHandler(ctrl.postCartItem));
router.patch("/:itemId", asyncHandler(ctrl.patchCartItem));
router.delete("/:itemId", asyncHandler(ctrl.deleteCartItem));
router.delete("/", asyncHandler(ctrl.deleteCart));

export default router;