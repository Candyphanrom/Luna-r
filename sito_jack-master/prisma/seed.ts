import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('password123', 12)
    const user = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password,
        },
    })
    console.log({ user })

    // Create test products
    const product1 = await prisma.product.create({
        data: {
            name: 'Cyber Helmet',
            description: 'A futuristic helmet with HUD display capabilities and neural link interface.',
            seoTitle: 'Cyber Helmet - HUD Enabled Tactical Gear | LUN/R',
            seoDescription: 'Advanced 3D printed cyber helmet with functioning HUD and neural interface compatibility. Perfect for cosplay and tech enthusiasts.',
            specs: {
                "Material": "Carbon Fiber Reinforced PLA",
                "Weight": "1.2kg",
                "Battery Life": "12 Hours",
                "HUD Resolution": "1080p"
            },
            faq: [
                { "question": "Is the HUD functional?", "answer": "Yes, it connects via Bluetooth to your smartphone." },
                { "question": "What is the head size?", "answer": "It fits up to 62cm circumference." }
            ],
            images: ['https://placehold.co/600x400/png'],
            modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
            variants: {
                create: [
                    {
                        name: 'Standard',
                        dimensions: '30x30x30 cm',
                        price: 299.99
                    }
                ]
            }
        }
    })
    console.log({ product1 })

    const product2 = await prisma.product.create({
        data: {
            name: 'Quantum Core',
            description: 'Advanced power unit for autonomous systems.',
            seoTitle: 'Quantum Core - Autonomous Power Unit | LUN/R',
            seoDescription: 'High-density energy storage unit for robotics and autonomous systems. 3D printed casing with LED indicators.',
            specs: {
                "Output": "500W",
                "Capacity": "20000mAh",
                "Interface": "USB-C / DC",
                "Dimensions": "10x10x10 cm"
            },
            faq: [
                { "question": "Is it rechargeable?", "answer": "Yes, via USB-C fast charging." },
                { "question": "Can it power a laptop?", "answer": "Yes, it supports up to 100W PD output." }
            ],
            images: ['https://placehold.co/600x400/png'],
            modelUrl: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
            variants: {
                create: [
                    {
                        name: 'MK-1',
                        dimensions: '10x10x10 cm',
                        price: 599.99
                    }
                ]
            }
        }
    })
    console.log({ product2 })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
