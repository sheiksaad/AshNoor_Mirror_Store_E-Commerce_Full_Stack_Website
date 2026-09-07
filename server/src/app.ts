import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./features/auth/auth.routes.js";
import categoryRoutes from "./features/category/category.routes.js";
import productRoutes from "./features/product/product.routes.js";
import cartRoutes from "./features/cart/cart.routes.js";
import addressRoutes from "./features/address/address.routes.js";
import orderRoutes from "./features/order/order.routes.js";
import adminRoutes from "./features/admin/admin.routes.js";
import reviewRoutes from "./features/review/review.routes.js";
import couponRoutes from "./features/coupon/coupon.routes.js";
import wishlistRoutes from "./features/wishlist/wishlist.routes.js";

export function createApp(): Express {
    const app = express();

    app.use(helmet());
    app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
    app.use(express.json());
    app.use(cookieParser());

    app.get("/api/health", (_req, res) => {
        res.status(200).json({ status: "ok" });
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/addresses", addressRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/reviews", reviewRoutes);
    app.use("/api/coupons", couponRoutes);
    app.use("/api/wishlist", wishlistRoutes);

    app.use(errorHandler);

    return app;
}