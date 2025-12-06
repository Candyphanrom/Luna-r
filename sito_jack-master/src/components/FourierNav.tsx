'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { EyeSVG } from './EyeSVG'

const PHI = 1.618033988749895

const NAV_ITEMS = [
    {
        id: 'shop',
        label: 'Shop',
        kanji: '蔵',
        english: 'Storehouse',
        path: '/products',
        color: '#E91E63', // Pink
        angle: 0
    },
    {
        id: 'custom',
        label: 'Custom Order',
        kanji: '匠',
        english: 'Artisan',
        path: '/admin/products/new',
        color: '#FF9800', // Orange
        angle: 72
    },
    {
        id: 'contact',
        label: 'Contacts',
        kanji: '結',
        english: 'Connection',
        path: '/contact',
        color: '#2196F3', // Blue
        angle: 144
    },
    {
        id: 'projects',
        label: 'Projects',
        kanji: '業',
        english: 'Work',
        path: '/projects',
        color: '#4CAF50', // Green
        angle: 216
    },
    {
        id: 'about',
        label: 'About',
        kanji: '道',
        english: 'The Way',
        path: '/about',
        color: '#9C27B0', // Purple
        angle: 288
    }
]

export default function FourierNav() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const router = useRouter()
    const [showEye, setShowEye] = useState(true)
    const [eyeProgress, setEyeProgress] = useState(0)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    // 3D Rotation State
    const [rotation, setRotation] = useState(0)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStartY, setDragStartY] = useState(0)
    const [dragStartRotation, setDragStartRotation] = useState(0)

    // Mouse Tracking for Eye
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
            const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
            setMousePos({ x, y })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Scroll & Drag Interaction
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            setRotation(prev => prev + e.deltaY * 0.05)
        }

        const handleMouseDown = (e: MouseEvent) => {
            setIsDragging(true)
            setDragStartY(e.clientY)
            setDragStartRotation(rotation)
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const deltaY = e.clientY - dragStartY
                setRotation(dragStartRotation + deltaY * 0.5)
            }
        }

        window.addEventListener('wheel', handleWheel)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('wheel', handleWheel)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [isDragging, dragStartY, dragStartRotation, rotation])

    // Eye Intro Animation
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

    // Autonomous Rotation
    useEffect(() => {
        if (isDragging) return

        const interval = setInterval(() => {
            setRotation(prev => prev + 0.2) // Doubled speed
        }, 50)

        return () => clearInterval(interval)
    }, [isDragging])

    // Canvas Rendering (Background Particles)
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

        const particles = Array.from({ length: 30 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            alpha: Math.random() * 0.3
        }))

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach(p => {
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            })

            animationFrameId = requestAnimationFrame(render)
        }

        render()
        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    const handleClick = (path: string) => router.push(path)

    // 3D Projection Helper
    const get3DPosition = (angleDeg: number) => {
        const angleRad = ((angleDeg + rotation) * Math.PI) / 180

        const radiusY = 245 // 30% closer (350 * 0.7)
        const radiusZ = 105 // 30% closer (150 * 0.7)

        const y = Math.sin(angleRad) * radiusY
        const z = Math.cos(angleRad) * radiusZ

        const perspective = 1000
        const scale = (perspective + z) / perspective
        const opacity = Math.max(0.2, (z + radiusZ) / (2 * radiusZ))

        return { x: 0, y, z, scale, opacity }
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

            <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center cursor-grab active:cursor-grabbing">
                <canvas ref={canvasRef} className="absolute inset-0 z-0" />

                {/* Central Moon / Eye Container */}
                <div className="relative z-10 group pointer-events-none">
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-400/20 transition-all duration-500" />
                    <EyeSVG progress={1} color={showEye ? '#fff' : '#00f7ff'} main mousePos={mousePos} />
                </div>

                {/* 3D Orbiting Wireframe Moons */}
                {NAV_ITEMS.map((item) => {
                    const isHovered = hoveredItem === item.id
                    const { x, y, z, scale, opacity } = get3DPosition(item.angle)
                    const zIndex = z > 0 ? 20 : 5

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute cursor-pointer"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
                                zIndex: zIndex,
                                opacity: opacity
                            }}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => handleClick(item.path)}
                        >
                            {/* Wireframe Moon Container */}
                            <div
                                className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative
                                    ${isHovered ? 'scale-[2]' : 'scale-100'}
                                `}
                                style={{
                                    background: 'transparent',
                                    border: `1px solid ${isHovered ? item.color : 'rgba(255,255,255,0.3)'}`,
                                    boxShadow: isHovered
                                        ? `0 0 30px ${item.color}, inset 0 0 20px ${item.color}40`
                                        : '0 0 10px rgba(255,255,255,0.2)'
                                }}
                            >
                                {/* Wireframe Grid Overlay */}
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                    viewBox="0 0 100 100"
                                    style={{ opacity: isHovered ? 0.8 : 0.4 }}
                                >
                                    {/* Latitude lines */}
                                    {[20, 40, 60, 80].map(latY => (
                                        <ellipse
                                            key={`lat-${latY}`}
                                            cx="50"
                                            cy="50"
                                            rx="48"
                                            ry={48 * Math.cos((latY - 50) * Math.PI / 100)}
                                            fill="none"
                                            stroke={isHovered ? item.color : 'rgba(255,255,255,0.3)'}
                                            strokeWidth="0.5"
                                            transform={`translate(0, ${latY - 50})`}
                                        />
                                    ))}

                                    {/* Longitude lines */}
                                    {[0, 30, 60, 90, 120, 150].map(angle => (
                                        <ellipse
                                            key={`lon-${angle}`}
                                            cx="50"
                                            cy="50"
                                            rx={48 * Math.abs(Math.cos(angle * Math.PI / 180))}
                                            ry="48"
                                            fill="none"
                                            stroke={isHovered ? item.color : 'rgba(255,255,255,0.3)'}
                                            strokeWidth="0.5"
                                        />
                                    ))}

                                    {/* Equator */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="48"
                                        fill="none"
                                        stroke={isHovered ? item.color : 'rgba(255,255,255,0.4)'}
                                        strokeWidth="1"
                                    />
                                </svg>

                                {/* Kanji Content */}
                                <div className="flex flex-col items-center justify-center h-full relative z-10">
                                    <span
                                        className="text-2xl font-black leading-none transition-all duration-300"
                                        style={{
                                            color: isHovered ? item.color : '#f0f0f0',
                                            textShadow: isHovered ? `0 0 20px ${item.color}, 0 0 40px ${item.color}` : '0 0 10px rgba(255,255,255,0.2)',
                                            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                    >
                                        {item.kanji}
                                    </span>

                                    <span
                                        className="text-[6px] uppercase tracking-widest font-bold transition-colors duration-300 mt-1 opacity-80"
                                        style={{ color: isHovered ? item.color : '#f0f0f0' }}
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
