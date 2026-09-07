import { Router } from "express";
import {
    register,
    login,
    refresh,
    logout,
    googleAuth,
    verifyEmail,
    forgotPassword,
    resetPasswordHandler,
    getMe,
} from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/google", asyncHandler(googleAuth));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));
router.post("/verify-email", asyncHandler(verifyEmail));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password", asyncHandler(resetPasswordHandler));
router.get("/me", authenticate, asyncHandler(getMe));

export default router;