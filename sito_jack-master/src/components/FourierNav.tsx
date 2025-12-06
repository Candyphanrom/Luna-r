'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { EyeSVG } from './EyeSVG'

const NAV_ITEMS = [
    {
        id: 'shop',
        label: 'Shop',
        kanji: '蔵',
        english: 'Storehouse',
        path: '/products',
        color: '#00f7ff', // Cyan - Innovation, Primary CTA
        probability: 25, // Highest - main conversion action
        angle: 0
    },
    {
        id: 'custom',
        label: 'Custom Order',
        kanji: '匠',
        english: 'Artisan',
        path: '/admin/products/new',
        color: '#ff9000', // Orange - Energy, Secondary action
        probability: 20,
        angle: 72
    },
    {
        id: 'projects',
        label: 'Projects',
        kanji: '業',
        english: 'Work',
        path: '/projects',
        color: '#4CAF50', // Green - Trust, Portfolio
        probability: 15,
        angle: 144
    },
    {
        id: 'contact',
        label: 'Contacts',
        kanji: '結',
        english: 'Connection',
        path: '/contact',
        color: '#00ff88', // Lime - Support/Assistance
        probability: 12,
        angle: 216
    },
    {
        id: 'about',
        label: 'About',
        kanji: '道',
        english: 'The Way',
        path: '/about',
        color: '#b300ff', // Purple - Info/Exploration
        probability: 8,
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

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation(prev => (prev + 0.15) % 360)
        }, 50)
        return () => clearInterval(interval)
    }, [])

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
            const orbitalRadius = 300

            ctx.strokeStyle = 'rgba(0, 247, 255, 0.15)'
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

            ctx.strokeStyle = 'rgba(0, 247, 255, 0.08)'
            ctx.lineWidth = 1
            ctx.beginPath()
            NAV_ITEMS.forEach((item, i) => {
                const angleRad = ((item.angle + rotation) * Math.PI) / 180
                const x = centerX + Math.cos(angleRad) * orbitalRadius
                const y = centerY + Math.sin(angleRad) * orbitalRadius
                if (i === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            })
            ctx.closePath()
            ctx.stroke()

            animationFrameId = requestAnimationFrame(render)
        }

        render()
        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [rotation])

    const handleClick = (path: string) => router.push(path)

    const getCirclePosition = (angle: number) => {
        const rad = ((angle + rotation) * Math.PI) / 180
        const orbitalRadius = 300
        return {
            x: Math.cos(rad) * orbitalRadius,
            y: Math.sin(rad) * orbitalRadius
        }
    }

    // Calculate size based on probability (25% = 100px, scales down)
    const getMoonSize = (probability: number) => {
        const baseSize = 40 + (probability * 2.4) // 25% = 100px, 8% = 59px
        return Math.round(baseSize)
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

                {/* Central Eye */}
                <div className="relative z-10 group pointer-events-none" style={{ width: '400px', height: '400px' }}>
                    <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full group-hover:bg-cyan-400/20 transition-all duration-500" />
                    <EyeSVG progress={1} color={showEye ? '#fff' : '#00f7ff'} main mousePos={mousePos} />
                </div>

                {/* Probability-Weighted Wireframe Moons */}
                {NAV_ITEMS.map((item) => {
                    const isHovered = hoveredItem === item.id
                    const position = getCirclePosition(item.angle)
                    const size = getMoonSize(item.probability)
                    const hoverSize = size * 1.5

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute cursor-pointer z-10 pointer-events-auto"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
                            }}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => handleClick(item.path)}
                            animate={{
                                scale: isHovered ? hoverSize / size : 1
                            }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            {/* Wireframe Moon */}
                            <div
                                className="rounded-full flex flex-col items-center justify-center relative"
                                style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    background: 'transparent',
                                    border: `2px solid ${isHovered ? item.color : 'rgba(255,255,255,0.4)'}`,
                                    boxShadow: isHovered
                                        ? `0 0 30px ${item.color}, inset 0 0 20px ${item.color}40`
                                        : '0 0 10px rgba(255,255,255,0.2)'
                                }}
                            >
                                {/* Probability Badge */}
                                <div
                                    className="absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                    style={{
                                        background: 'rgba(0,0,0,0.8)',
                                        border: `1px solid ${item.color}`,
                                        color: item.color,
                                        boxShadow: `0 0 8px ${item.color}40`
                                    }}
                                >
                                    {item.probability}%
                                </div>

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
                                            stroke={isHovered ? item.color : 'rgba(255,255,255,0.4)'}
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
                                            stroke={isHovered ? item.color : 'rgba(255,255,255,0.4)'}
                                            strokeWidth="0.8"
                                        />
                                    ))}

                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="47"
                                        fill="none"
                                        stroke={isHovered ? item.color : 'rgba(255,255,255,0.5)'}
                                        strokeWidth="1.5"
                                    />
                                </svg>

                                {/* Kanji Content */}
                                <div className="flex flex-col items-center justify-center h-full relative z-10">
                                    <span
                                        className="font-black leading-none"
                                        style={{
                                            fontSize: `${Math.max(size * 0.4, 16)}px`,
                                            color: isHovered ? item.color : 'rgba(255,255,255,0.8)',
                                            textShadow: isHovered ? `0 0 15px ${item.color}` : 'none'
                                        }}
                                    >
                                        {item.kanji}
                                    </span>

                                    <span
                                        className="uppercase tracking-wider font-bold mt-1 opacity-70"
                                        style={{
                                            fontSize: `${Math.max(size * 0.09, 7)}px`,
                                            color: isHovered ? item.color : 'rgba(255,255,255,0.6)'
                                        }}
                                    >
                                        {item.english}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </>
    )
}
