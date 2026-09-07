import { Router } from "express";
import * as ctrl from "./product.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { upload } from "../../middlewares/upload.js";

const router = Router();

router.get("/", asyncHandler(ctrl.getProducts));
router.get("/:slug", asyncHandler(ctrl.getProduct));
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    upload.array("images", 5),
    asyncHandler(ctrl.postProduct),
);
router.patch("/:id", authenticate, authorize("ADMIN"), asyncHandler(ctrl.patchProduct));
router.delete("/:id", authenticate, authorize("ADMIN"), asyncHandler(ctrl.removeProduct));

export default router;