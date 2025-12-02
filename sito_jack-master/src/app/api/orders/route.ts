import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { items, total } = await req.json()

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items in order' },
                { status: 400 }
            )
        }

        // Get user from DB to ensure we have the ID
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Create the order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total: total,
                status: 'PAID', // Simulating successful payment
                items: {
                    create: items.map((item: any) => ({
                        productId: item.product.id,
                        variantId: item.variant.id,
                        quantity: item.quantity,
                        price: item.variant.price
                    }))
                }
            }
        })

        return NextResponse.json({ order })
    } catch (error) {
        console.error('Order creation error:', error)
        return NextResponse.json(
            { error: 'Error creating order' },
            { status: 500 }
        )
    }
}
