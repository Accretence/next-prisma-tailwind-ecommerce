import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding cross-sell relationships...')

    // Get all products
    const products = await prisma.product.findMany({
        select: { id: true, title: true },
    })

    if (products.length < 2) {
        console.warn('Need at least 2 products to create cross-sell relationships.')
        return
    }

    // For demo, we'll make each product cross-sell 1–3 other random products
    for (const product of products) {
        // Choose random other products (not itself)
        const otherProducts = products
        .filter((p) => p.id !== product.id)
        .sort(() => 0.5 - Math.random()) // shuffle
        .slice(0, Math.floor(Math.random() * 3) + 1) // 1–3 cross-sells

        await prisma.product.update({
        where: { id: product.id },
        data: {
            crossSellProducts: {
            set: [], // clear old relations if any
            connect: otherProducts.map((p) => ({ id: p.id })),
            },
        },
        })

        console.log(
        `Linked ${product.title} → ${otherProducts
            .map((p) => p.title)
            .join(', ')}`
        )
    }

    console.log('Cross-sell seeding completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
