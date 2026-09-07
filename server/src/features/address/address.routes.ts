import { Router } from "express";
import * as ctrl from "./address.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(ctrl.getAddresses));
router.post("/", asyncHandler(ctrl.postAddress));
router.delete("/:id", asyncHandler(ctrl.removeAddress));

export default router;