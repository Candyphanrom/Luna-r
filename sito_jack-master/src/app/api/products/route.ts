import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
    const products = await prisma.product.findMany({
        include: {
            variants: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json();
    const { name, description, images, videoUrl, modelUrl, variants } = body;

    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                images,
                videoUrl,
                modelUrl,
                variants: {
                    create: variants.map((v: any) => ({
                        name: v.name,
                        dimensions: v.dimensions,
                        price: v.price
                    })),
                },
            },
            include: {
                variants: true,
            },
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
    }
}
