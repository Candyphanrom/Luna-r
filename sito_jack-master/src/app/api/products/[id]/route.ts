import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json();
    const { name, description, images, videoUrl, modelUrl, variants } = body;

    try {
        // Transaction to handle product update and variants replacement
        const product = await prisma.$transaction(async (tx) => {
            // 1. Update basic product info
            const updatedProduct = await tx.product.update({
                where: { id },
                data: {
                    name,
                    description,
                    images,
                    videoUrl,
                    modelUrl,
                },
            });

            // 2. Delete existing variants
            await tx.productVariant.deleteMany({
                where: { productId: id },
            });

            // 3. Create new variants
            if (variants && variants.length > 0) {
                await tx.productVariant.createMany({
                    data: variants.map((v: any) => ({
                        name: v.name,
                        dimensions: v.dimensions,
                        price: v.price,
                        productId: id,
                    })),
                });
            }

            return updatedProduct;
        });

        // Fetch the complete result with variants to return
        const finalProduct = await prisma.product.findUnique({
            where: { id },
            include: { variants: true },
        });

        return NextResponse.json(finalProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    try {
        await prisma.product.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Product deleted' });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
    }
}
