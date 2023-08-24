import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from 'lib/prisma'
import { IdentifyAccess } from 'lib/jwt'
import Auth from 'middlewares/Auth'
import { getRequestBody, isVariableValid } from 'lib/utils'

export default Auth(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = await IdentifyAccess({
            req,
            secret: process.env.ACCESS_TOKEN_SECRET,
        })

        const { vendorProductId } = getRequestBody(req)

        if (req.method == 'DELETE') {
            await prisma.cartItem.delete({
                where: { UniqueCartItem: { cartId: id, vendorProductId } },
            })
        }

        if (req.method == 'PATCH') {
            await prisma.cartItem.update({
                where: {
                    UniqueCartItem: {
                        cartId: id,
                        vendorProductId,
                    },
                },
                data: {
                    count: { decrement: 1 },
                },
            })
        }

        if (req.method == 'POST') {
            await prisma.cart.upsert({
                where: {
                    userId: id,
                },
                create: {
                    user: {
                        connect: {
                            id,
                        },
                    },
                },
                update: {
                    items: {
                        connectOrCreate: {
                            where: {
                                UniqueCartItem: {
                                    vendorProductId,
                                    cartId: id,
                                },
                            },
                            create: {
                                vendorProductId,
                                count: 1,
                            },
                        },
                    },
                },
            })
        }

        if (req.method == 'PUT') {
            await prisma.cartItem.update({
                where: {
                    UniqueCartItem: {
                        cartId: id,
                        vendorProductId,
                    },
                },
                data: {
                    count: { increment: 1 },
                },
            })
        }

        const cart = await prisma.cart.findUniqueOrThrow({
            where: {
                userId: id,
            },
            include: {
                items: {
                    include: {
                        vendorProduct: {
                            include: {
                                subproduct: { include: { product: true } },
                            },
                        },
                    },
                },
            },
        })

        return res.status(200).json({ cart })
    } catch (error) {
        const message = error.message
        console.error({ error, message })
        return res.status(400).json({ error, message })
    }
})
