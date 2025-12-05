'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
    {
        id: 'about',
        label: 'About Us',
        symbol: '☉', // Sun
        path: '/about',
        description: 'Discover the LUN/R vision and our commitment to precision engineering.',
        color: '#FFD600' // Gradient 8 - Yellow
    },
    {
        id: 'shop',
        label: 'Shop',
        symbol: '☿', // Mercury
        path: '/products',
        description: 'Explore our collection of cyberpunk artifacts and 3D printed gear.',
        color: '#4DD0E1' // Gradient 3 - Cyan
    },
    {
        id: 'custom',
        label: 'Custom Order',
        symbol: '♀', // Venus
        path: '/admin/products/new',
        description: 'Commission a unique piece tailored to your specifications.',
        color: '#E91E63' // Gradient 16 - Magenta
    },
    {
        id: 'contact',
        label: 'Contacts',
        symbol: '♂', // Mars
        path: '/contact',
        description: 'Get in touch with our team for inquiries and support.',
        color: '#FF1744' // Gradient 8 - Red/Magenta
    },
    {
        id: 'projects',
        label: 'Projects',
        symbol: '♃', // Jupiter
        path: '/projects',
        description: 'View our portfolio of completed works and ongoing innovations.',
        color: '#7E57C2' // Gradient 3/7 - Purple
    }
]

export default function AstrologicalNav() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const router = useRouter()
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let time = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', resize)
        resize()

        const drawScribbleLine = (x1: number, y1: number, x2: number, y2: number, jitter: number) => {
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            for (let i = 0; i <= 10; i++) {
                const t = i / 10
                const x = x1 + (x2 - x1) * t + (Math.random() - 0.5) * jitter
                const y = y1 + (y2 - y1) * t + (Math.random() - 0.5) * jitter
                ctx.lineTo(x, y)
            }
            ctx.stroke()
        }

        const drawGear = (x: number, y: number, radius: number, teeth: number, rotation: number, isHovered: boolean) => {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(rotation)

            // Outer gear
            ctx.beginPath()
            for (let i = 0; i < teeth * 2; i++) {
                const angle = (Math.PI * 2 * i) / (teeth * 2)
                const r = i % 2 === 0 ? radius : radius * 0.85
                ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
            }
            ctx.closePath()
            ctx.lineWidth = isHovered ? 2 : 1
            ctx.stroke()

            // Inner circle
            ctx.beginPath()
            ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2)
            ctx.stroke()

            // Spokes
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI * i) / 2
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(Math.cos(angle) * radius * 0.5, Math.sin(angle) * radius * 0.5)
                ctx.stroke()
            }

            ctx.restore()
        }

        const render = () => {
            time += 0.005

            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            gradient.addColorStop(0, '#1A0033') // Gradient 7 start
            gradient.addColorStop(0.5, '#5E35B1') // Gradient 7 mid
            gradient.addColorStop(1, '#00BCD4') // Gradient 7 end
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 1
            ctx.lineCap = 'round'

            const centerX = canvas.width / 2
            const centerY = canvas.height / 2

            // Mouse influence
            const dx = mousePos.x - centerX
            const dy = mousePos.y - centerY
            const dist = Math.sqrt(dx * dx + dy * dy)
            const influence = Math.max(0, 1 - dist / 500)

            // Draw construction lines
            ctx.globalAlpha = 0.1
            ctx.beginPath()
            ctx.arc(centerX, centerY, 300, 0, Math.PI * 2)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(centerX - 400, centerY)
            ctx.lineTo(centerX + 400, centerY)
            ctx.moveTo(centerX, centerY - 400)
            ctx.lineTo(centerX, centerY + 400)
            ctx.stroke()

            // Draw Central Gear (About Us)
            ctx.globalAlpha = 0.9
            const jitter = isHovering ? 2 + influence * 5 : 1
            const isCenterHovered = hoveredItem === 'about'
            drawGear(centerX, centerY, isCenterHovered ? 160 : 150, 24, time, isCenterHovered)

            // Draw symbol in center
            ctx.globalAlpha = 1
            ctx.fillStyle = isCenterHovered ? '#FFD700' : '#ffffff'
            ctx.font = 'bold 48px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('☉', centerX, centerY)

            // Draw Satellite Gears
            NAV_ITEMS.slice(1).forEach((item, i) => {
                const angle = (Math.PI * 2 * i) / (NAV_ITEMS.length - 1) + time * 0.3
                const radius = 280
                const x = centerX + Math.cos(angle) * radius
                const y = centerY + Math.sin(angle) * radius

                const isHovered = hoveredItem === item.id
                ctx.globalAlpha = 0.8
                drawGear(x, y, isHovered ? 70 : 60, 12, -time * 2, isHovered)

                // Connecting lines
                ctx.globalAlpha = 0.2
                drawScribbleLine(centerX, centerY, x, y, jitter)

                // Draw symbol
                ctx.globalAlpha = 1
                ctx.fillStyle = isHovered ? item.color : '#ffffff'
                ctx.font = 'bold 32px Arial'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(item.symbol, x, y)
            })

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [mousePos, isHovering, hoveredItem])

    const handleClick = (path: string) => {
        router.push(path)
    }

    const getItemPosition = (index: number) => {
        if (index === 0) {
            return { x: '50%', y: '50%' }
        }
        const angle = (Math.PI * 2 * (index - 1)) / (NAV_ITEMS.length - 1)
        const radius = 280
        const x = 50 + (Math.cos(angle) * radius * 100) / window.innerWidth
        const y = 50 + (Math.sin(angle) * radius * 100) / window.innerHeight
        return { x: `${x}%`, y: `${y}%` }
    }

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                onMouseMove={(e) => {
                    setMousePos({ x: e.clientX, y: e.clientY })
                    setIsHovering(true)
                }}
                onMouseLeave={() => setIsHovering(false)}
            />

            {/* Invisible clickable areas */}
            <div className="absolute inset-0">
                {NAV_ITEMS.map((item, index) => {
                    const pos = getItemPosition(index)
                    const size = index === 0 ? 160 : 70

                    return (
                        <div
                            key={item.id}
                            className="absolute cursor-pointer"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                transform: 'translate(-50%, -50%)',
                                width: `${size * 2}px`,
                                height: `${size * 2}px`,
                            }}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => handleClick(item.path)}
                        />
                    )
                })}
            </div>

            {/* Preview Panel */}
            <AnimatePresence>
                {hoveredItem && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-md"
                    >
                        {NAV_ITEMS.map(item =>
                            item.id === hoveredItem ? (
                                <div key={item.id}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-4xl" style={{ color: item.color }}>{item.symbol}</span>
                                        <h3 className="text-2xl font-bold text-white">{item.label}</h3>
                                    </div>
                                    <p className="text-gray-300 text-sm">{item.description}</p>
                                    <p className="text-gray-500 text-xs mt-2">Click to navigate</p>
                                </div>
                            ) : null
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
