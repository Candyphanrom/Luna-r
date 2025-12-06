'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { EyeSVG } from './EyeSVG'

// Color Schemes
const COLOR_SCHEMES = {
    10: { inactive: '#b300ff', hover: '#ff00ff' },
    12: { inactive: '#ff9000', hover: '#ffcc00' },
    14: { inactive: '#0080ff', hover: '#00f7ff' },
    15: { inactive: '#00f7ff', hover: '#00ff88' },
    16: { inactive: '#4CAF50', hover: '#00ff00' }
}

const NAV_ITEMS = [
    {
        id: 'shop-online',
        label: 'Shop Online',
        symbol: '☿',
        path: '/products',
        colorScheme: 15,
        angle: -90
    },
    {
        id: 'custom',
        label: 'Custom',
        symbol: '♃',
        path: '/admin/products/new',
        colorScheme: 12,
        angle: -18
    },
    {
        id: 'shop-offline',
        label: 'Shop Offline',
        symbol: '♆',
        path: '/contact',
        colorScheme: 14,
        angle: 54
    },
    {
        id: 'cart',
        label: 'Shopping Cart',
        symbol: '♄',
        path: '/checkout',
        colorScheme: 16,
        angle: 126
    },
    {
        id: 'secret-club',
        label: 'Secret Club',
        symbol: '♅',
        path: '/experience',
        colorScheme: 10,
        angle: 198
    }
]

export default function FourierNav() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const router = useRouter()
    const [showEye, setShowEye] = useState(true)
    const [eyeProgress, setEyeProgress] = useState(0)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [rotation, setRotation] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
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

    useEffect(() => {
        if (hoveredItem) return

        const interval = setInterval(() => {
            setRotation(prev => (prev + 0.15) % 360)
        }, 50)
        return () => clearInterval(interval)
    }, [hoveredItem])

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
            const eyeRadius = isMobile ? 100 : 200
            const planetRadius = isMobile ? 20 : 35
            const orbitalRadius = eyeRadius + planetRadius

            ctx.strokeStyle = 'rgba(0, 247, 255, 0.2)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(centerX, centerY, orbitalRadius, 0, Math.PI * 2)
            ctx.stroke()

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
            ctx.lineWidth = 0.5
            NAV_ITEMS.forEach(item => {
                const angleRad = ((item.angle + rotation) * Math.PI) / 180
                const x = centerX + Math.cos(angleRad) * orbitalRadius
                const y = centerY + Math.sin(angleRad) * orbitalRadius

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

    const getCirclePosition = (angle: number) => {
        const rad = ((angle + rotation) * Math.PI) / 180
        const eyeRadius = isMobile ? 100 : 200
        const planetRadius = isMobile ? 20 : 35
        const orbitalRadius = eyeRadius + planetRadius

        return {
            x: Math.cos(rad) * orbitalRadius,
            y: Math.sin(rad) * orbitalRadius
        }
    }

    const getMoonSize = () => {
        return isMobile ? 40 : 70
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
                            <EyeSVG progress={eyeProgress} color="#00f7ff" main />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative w-full min-h-screen overflow-hidden bg-black flex items-center justify-center">
                <canvas ref={canvasRef} className="absolute inset-0 z-0" />

                <div
                    className="relative z-10 group pointer-events-none"
                    style={{
                        width: isMobile ? '200px' : '400px',
                        height: isMobile ? '200px' : '400px',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full group-hover:bg-cyan-400/20 transition-all duration-500" />
                    <EyeSVG progress={1} color={showEye ? '#fff' : '#00f7ff'} main />
                </div>

                {NAV_ITEMS.map((item, index) => {
                    const isHovered = hoveredItem === item.id
                    const position = getCirclePosition(item.angle)
                    const size = getMoonSize()
                    const hoverSize = size * 1.8
                    const colors = COLOR_SCHEMES[item.colorScheme as keyof typeof COLOR_SCHEMES]

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute cursor-pointer pointer-events-auto"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: 1,
                                scale: isHovered ? hoverSize / size : 1
                            }}
                            transition={{
                                opacity: { delay: 2.5 + (index * 0.1), duration: 0.4 },
                                scale: { duration: 0.3, ease: 'easeOut' }
                            }}
                            style={{
                                left: `calc(50% + ${position.x}px)`,
                                top: `calc(50% + ${position.y}px)`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 20
                            }}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => handleClick(item.path)}
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

                                <div className="flex flex-col items-center justify-center h-full relative z-10">
                                    <span
                                        className="font-black leading-none"
                                        style={{
                                            fontSize: `${Math.max(size * 0.5, 16)}px`,
                                            color: isHovered ? colors.hover : colors.inactive,
                                            textShadow: isHovered ? `0 0 20px ${colors.hover}` : 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {item.symbol}
                                    </span>
                                </div>
                            </div>

                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                                >
                                    <span
                                        className="text-xs font-bold uppercase tracking-wider"
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
