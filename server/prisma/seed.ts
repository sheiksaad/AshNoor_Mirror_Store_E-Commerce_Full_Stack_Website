import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
    const category = await prisma.category.upsert({
        where: { slug: "wall-mirrors" },
        update: {},
        create: { name: "Wall Mirrors", slug: "wall-mirrors" },
    });

    await prisma.product.upsert({
        where: { slug: "round-gold-frame-mirror" },
        update: {},
        create: {
            name: "Round Gold Frame Mirror",
            slug: "round-gold-frame-mirror",
            description: "Elegant round mirror with a brushed gold metal frame, 24-inch diameter.",
            price: 4500,
            stock: 25,
            categoryId: category.id,
            images: {
                create: [
                    {
                        url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                        publicId: "sample",
                        isPrimary: true,
                    },
                ],
            },
        },
    });

    console.log("✅ Seed complete");
}

main()
    .catch((err: unknown) => {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    })
    .finally(() => {
        void prisma.$disconnect();
    });