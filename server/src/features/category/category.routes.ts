import { Router } from "express";
import * as ctrl from "./category.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

router.get("/", asyncHandler(ctrl.getCategories));
router.post("/", authenticate, authorize("ADMIN"), asyncHandler(ctrl.postCategory));
router.patch("/:id", authenticate, authorize("ADMIN"), asyncHandler(ctrl.patchCategory));
router.delete("/:id", authenticate, authorize("ADMIN"), asyncHandler(ctrl.removeCategory));

export default router;