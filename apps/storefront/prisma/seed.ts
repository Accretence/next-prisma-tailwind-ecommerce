import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding cross-sell products...')

    // Map of product IDs for easier reference
    const products = {
        bkidPipe: 'cmeqvyimb000clk0skopgi7c4',
        boSpeaker: 'cmeqvyjri000elk0s3a4dijd1',
        audioTurntable: 'cmeqvykeh000glk0svp62b99s',
        monocleSneakers: 'cmeqvyl1e000ilk0sgoifqkq3',
        zone2Watch: 'cmeqvylo5000klk0s62dzzh6a',
        l1Phone: 'cmeqvymar000mlk0s7ygcsjbn',
        scanner: 'cmeqvymxf000olk0s5voq403x',
        neonHelmet: 'cmeqvynhs000qlk0s9tg6u2ud',
    }

    // Define cross-sell relationships (example)
    const crossSellMap = [
        {
            source: products.bkidPipe,
            targets: [products.boSpeaker, products.audioTurntable],
        },
        {
            source: products.boSpeaker,
            targets: [products.bkidPipe, products.monocleSneakers],
        },
        {
            source: products.audioTurntable,
            targets: [products.bkidPipe],
        },
        {
            source: products.monocleSneakers,
            targets: [products.zone2Watch, products.neonHelmet],
        },
        {
            source: products.zone2Watch,
            targets: [products.monocleSneakers, products.l1Phone],
        },
        {
            source: products.l1Phone,
            targets: [products.zone2Watch, products.scanner],
        },
        {
            source: products.scanner,
            targets: [products.l1Phone],
        },
        {
            source: products.neonHelmet,
            targets: [products.monocleSneakers],
        },
    ]

    // Apply cross-sell relationships
    for (const entry of crossSellMap) {
        await prisma.product.update({
            where: { id: entry.source },
            data: {
                crossSellProducts: {
                    connect: entry.targets.map((id) => ({ id })),
                },
            },
        })
    }

    console.log('✅ Cross-sell products seeded successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
