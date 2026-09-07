import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

async function bootstrap(): Promise<void> {
    await prisma.$connect();
    console.warn("✅ Database connected");

    const app = createApp();
    app.listen(env.PORT, () => {
        console.warn(`🚀 Server running on port ${env.PORT}`);
    });
}

bootstrap().catch((err: unknown) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
});