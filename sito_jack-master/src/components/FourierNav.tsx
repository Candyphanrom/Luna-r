'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { EyeSVG } from './EyeSVG'

// Color Schemes (from standard Leibniz palette)
const COLOR_SCHEMES = {
    10: { inactive: '#b300ff', hover: '#ff00ff' }, // Purple/Magenta - Secret Club
    12: { inactive: '#ff9000', hover: '#ffcc00' }, // Orange/Gold - Custom
    14: { inactive: '#0080ff', hover: '#00f7ff' }, // Blue/Cyan - Shop Offline
    15: { inactive: '#00f7ff', hover: '#00ff88' }, // Cyan/Lime - Shop Online
    16: { inactive: '#4CAF50', hover: '#00ff00' }  // Green/Bright Green - Cart
}

const NAV_ITEMS = [
    {
        id: 'shop-online',
        label: 'Shop Online',
        symbol: '☿', // Mercury
        path: '/products',
        colorScheme: 15,
        probability: 25,
        orbitalRadius: 300,
        angle: 0
    },
    {
        id: 'custom',
        label: 'Custom',
        symbol: '♃', // Jupiter
        path: '/admin/products/new',
        colorScheme: 12,
        probability: 20,
        orbitalRadius: 260,
        angle: 72
    },
    {
        id: 'shop-offline',
        label: 'Shop Offline',
        symbol: '♆', // Neptune
        path: '/contact',
        colorScheme: 14,
        probability: 15,
        orbitalRadius: 220,
        angle: 144
    },
    {
        id: 'cart',
        label: 'Shopping Cart',
        symbol: '♄', // Saturn
        path: '/checkout',
        colorScheme: 16,
        probability: 18,
        orbitalRadius: 280,
        angle: 216
    },
    {
        id: 'secret-club',
        label: 'Secret Club',
        symbol: '♅', // Uranus
        path: '/experience',
        colorScheme: 10,
        probability: 12,
        orbitalRadius: 240,
        angle: 288
    }
]

export default function FourierNav() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const router = useRouter()
    const [showEye, setShowEye] = useState(true)
    const [eyeProgress, setEyeProgress] = useState(0)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [rotation, setRotation] = useState(0)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isMobile, setIsMobile] = useState(false)

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
            const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
            setMousePos({ x, y })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useEffect(() => {
        if (!showEye) return
        const duration = 2000
        const startTime = Date.now()
        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setEyeProgress(eased)
            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setTimeout(() => setShowEye(false), 500)
            }
        }
        animate()
    }, [showEye])

    // Autonomous Rotation - stops when hovering
    useEffect(() => {
        if (hoveredItem) return // Stop rotation when hovering

        const interval = setInterval(() => {
            setRotation(prev => (prev + 0.15) % 360)
        }, 50)
        return () => clearInterval(interval)
    }, [hoveredItem])

    // Canvas Rendering (Multiple orbital circles)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', resize)
        resize()

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const centerX = canvas.width / 2
            const centerY = canvas.height / 2

            // Draw orbital circles for each element
            NAV_ITEMS.forEach(item => {
                const radius = isMobile ? item.orbitalRadius * 0.65 : item.orbitalRadius
                const colors = COLOR_SCHEMES[item.colorScheme as keyof typeof COLOR_SCHEMES]

                ctx.strokeStyle = `${colors.inactive}40`
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
                ctx.stroke()
            })

            // Connecting radial lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
            ctx.lineWidth = 0.5
            NAV_ITEMS.forEach(item => {
                const radius = isMobile ? item.orbitalRadius * 0.65 : item.orbitalRadius
                const angleRad = ((item.angle + rotation) * Math.PI) / 180
                const x = centerX + Math.cos(angleRad) * radius
                const y = centerY + Math.sin(angleRad) * radius

                ctx.beginPath()
                ctx.moveTo(centerX, centerY)
                ctx.lineTo(x, y)
                ctx.stroke()
            })

            animationFrameId = requestAnimationFrame(render)
        }

        render()
        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [rotation, isMobile])

    const handleClick = (path: string) => {
        window.dispatchEvent(new Event('lunarInteraction'))
        router.push(path)
    }

    const getCirclePosition = (angle: number, radius: number) => {
        const rad = ((angle + rotation) * Math.PI) / 180
        const scaledRadius = isMobile ? radius * 0.65 : radius
        return {
            x: Math.cos(rad) * scaledRadius,
            y: Math.sin(rad) * scaledRadius
        }
    }

    const getMoonSize = (probability: number) => {
        const baseSize = 40 + (probability * 2.4)
        const scaleFactor = isMobile ? 0.65 : 1
        return Math.round(baseSize * scaleFactor)
    }

    return (
        <>
            <AnimatePresence>
                {showEye && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: 'blur(20px)' }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
                    >
                        <div className="relative">
                            <EyeSVG progress={eyeProgress} color="#00f7ff" main mousePos={mousePos} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
                <canvas ref={canvasRef} className="absolute inset-0 z-0" />

                {/* Central Eye - Leibniz Universal Monad */}
                <div className="relative z-10 group pointer-events-none" style={{ width: isMobile ? '260px' : '400px', height: isMobile ? '260px' : '400px' }}>
                    <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full group-hover:bg-cyan-400/20 transition-all duration-500" />
                    <EyeSVG progress={1} color={showEye ? '#fff' : '#00f7ff'} main mousePos={mousePos} />
                </div>

                {/* Aristotelian Elements - Planetary Symbols */}
                {NAV_ITEMS.map((item) => {
                    const isHovered = hoveredItem === item.id
                    const position = getCirclePosition(item.angle, item.orbitalRadius)
                    const size = getMoonSize(item.probability)
                    const hoverSize = size * 1.8
                    const colors = COLOR_SCHEMES[item.colorScheme as keyof typeof COLOR_SCHEMES]

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute cursor-pointer pointer-events-auto"
                            style={{
                                left: `calc(50% + ${position.x}px)`,
                                top: `calc(50% + ${position.y}px)`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 20
                            }}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => handleClick(item.path)}
                            animate={{
                                scale: isHovered ? hoverSize / size : 1
                            }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <div
                                className="rounded-full flex flex-col items-center justify-center relative"
                                style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    background: 'transparent',
                                    border: `2px solid ${isHovered ? colors.hover : colors.inactive}`,
                                    boxShadow: isHovered
                                        ? `0 0 40px ${colors.hover}, inset 0 0 25px ${colors.hover}60`
                                        : `0 0 15px ${colors.inactive}40`
                                }}
                            >
                                {/* Wireframe Grid */}
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                    viewBox="0 0 100 100"
                                    style={{ opacity: isHovered ? 0.9 : 0.5 }}
                                >
                                    {[25, 50, 75].map(y => (
                                        <ellipse
                                            key={`lat-${y}`}
                                            cx="50"
                                            cy="50"
                                            rx="47"
                                            ry={47 * Math.cos((y - 50) * Math.PI / 100)}
                                            fill="none"
                                            stroke={isHovered ? colors.hover : colors.inactive}
                                            strokeWidth="0.8"
                                            transform={`translate(0, ${y - 50})`}
                                        />
                                    ))}

                                    {[0, 45, 90, 135].map(angle => (
                                        <ellipse
                                            key={`lon-${angle}`}
                                            cx="50"
                                            cy="50"
                                            rx={47 * Math.abs(Math.cos(angle * Math.PI / 180))}
                                            ry="47"
                                            fill="none"
                                            stroke={isHovered ? colors.hover : colors.inactive}
                                            strokeWidth="0.8"
                                        />
                                    ))}

                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="47"
                                        fill="none"
                                        stroke={isHovered ? colors.hover : colors.inactive}
                                        strokeWidth="1.5"
                                    />
                                </svg>

                                {/* Planetary Symbol */}
                                <div className="flex flex-col items-center justify-center h-full relative z-10">
                                    <span
                                        className="font-black leading-none"
                                        style={{
                                            fontSize: `${Math.max(size * 0.5, 20)}px`,
                                            color: isHovered ? colors.hover : colors.inactive,
                                            textShadow: isHovered ? `0 0 20px ${colors.hover}` : 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {item.symbol}
                                    </span>
                                </div>
                            </div>

                            {/* Label (appears on hover) */}
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                                >
                                    <span
                                        className="text-sm font-bold uppercase tracking-wider"
                                        style={{
                                            color: colors.hover,
                                            textShadow: `0 0 10px ${colors.hover}`
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </div>
        </>
    )
}
