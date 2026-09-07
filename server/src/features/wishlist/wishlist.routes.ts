import { Router } from "express";
import { getWishlist, postToggleWishlist } from "./wishlist.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(getWishlist));
router.post("/toggle", asyncHandler(postToggleWishlist));

export default router;