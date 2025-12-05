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
        path: '/products',
        symbol: '☿',
        inactiveColor: '#E91E63',
        hoverColor: '#673AB7',
        angle: 0
    },
    {
        id: 'custom',
        label: 'Custom Order',
        path: '/admin/products/new',
        symbol: '♃',
        inactiveColor: '#FF9800',
        hoverColor: '#F44336',
        angle: 72
    },
    {
        id: 'contact',
        label: 'Contacts',
        path: '/contact',
        symbol: '♆',
        inactiveColor: '#3F51B5',
        hoverColor: '#03A9F4',
        angle: 144
    },
    {
        id: 'projects',
        label: 'Projects',
        path: '/projects',
        symbol: '♄',
        inactiveColor: '#E91E63',
        hoverColor: '#CDDC39',
        angle: 216
    },
    {
        id: 'about',
        label: 'About',
        path: '/about',
        symbol: '♅',
        inactiveColor: '#4CAF50',
        hoverColor: '#CDDC39',
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
    const animationRef = useRef<number>(0)

    useEffect(() => {
        if (!showEye) return
        const duration = 1125 // 75% of original 1500ms
        const startTime = Date.now()
        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setEyeProgress(eased)
            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setTimeout(() => setShowEye(false), 300) // 50% slower fade
            }
        }
        animate()
    }, [showEye])

    useEffect(() => {
        if (hoveredItem) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
            return
        }
        const animate = () => {
            setRotation(prev => (prev + 0.05) % 360)
            animationRef.current = requestAnimationFrame(animate)
        }
        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [hoveredItem])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let time = 0
        const pathHistory: Array<{ x: number; y: number }> = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', resize)
        resize()

        const epicycles = Array.from({ length: 5 }, (_, i) => ({
            radius: 25 / Math.pow(PHI, i * 0.4),
            frequency: Math.pow(PHI, i * 0.3) * 0.15,
            phase: (Math.PI * 2 * i) / 5
        }))

        const render = () => {
            time += 0.002 // Slower wave movement
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const centerX = canvas.width / 2
            const centerY = canvas.height / 2
            const radius = 250

            // Axes
            ctx.globalAlpha = 0.1
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(0, centerY)
            ctx.lineTo(canvas.width, centerY)
            ctx.moveTo(centerX, 0)
            ctx.lineTo(centerX, canvas.height)
            ctx.stroke()

            // Fourier epicycles around each planet
            NAV_ITEMS.forEach((item, planetIndex) => {
                const planetAngle = ((item.angle + rotation) * Math.PI) / 180
                const planetX = centerX + Math.cos(planetAngle) * radius
                const planetY = centerY + Math.sin(planetAngle) * radius

                let currentX = planetX
                let currentY = planetY

                epicycles.forEach((epicycle, i) => {
                    const angle = time * epicycle.frequency + epicycle.phase + planetIndex * Math.PI / 3

                    ctx.globalAlpha = 0.15
                    ctx.strokeStyle = i % 2 === 0 ? item.inactiveColor : item.hoverColor
                    ctx.lineWidth = 0.8

                    ctx.beginPath()
                    ctx.arc(currentX, currentY, epicycle.radius, 0, Math.PI * 2)
                    ctx.stroke()

                    const nextX = currentX + Math.cos(angle) * epicycle.radius
                    const nextY = currentY + Math.sin(angle) * epicycle.radius

                    ctx.beginPath()
                    ctx.moveTo(currentX, currentY)
                    ctx.lineTo(nextX, nextY)
                    ctx.stroke()

                    currentX = nextX
                    currentY = nextY
                })

                // Traced point
                ctx.globalAlpha = 0.7
                ctx.beginPath()
                ctx.arc(currentX, currentY, 2, 0, Math.PI * 2)
                ctx.fillStyle = item.inactiveColor
                ctx.fill()
            })

            // Central epicycles
            let currentX = centerX
            let currentY = centerY

            epicycles.forEach((epicycle, i) => {
                const angle = time * epicycle.frequency * 0.5 + epicycle.phase

                ctx.globalAlpha = 0.12
                ctx.strokeStyle = i % 2 === 0 ? '#7E57C2' : '#4DD0E1'
                ctx.lineWidth = 1

                ctx.beginPath()
                ctx.arc(currentX, currentY, epicycle.radius * 1.5, 0, Math.PI * 2)
                ctx.stroke()

                const nextX = currentX + Math.cos(angle) * epicycle.radius * 1.5
                const nextY = currentY + Math.sin(angle) * epicycle.radius * 1.5

                ctx.beginPath()
                ctx.moveTo(currentX, currentY)
                ctx.lineTo(nextX, nextY)
                ctx.stroke()

                currentX = nextX
                currentY = nextY
            })

            pathHistory.push({ x: currentX, y: currentY })
            if (pathHistory.length > 150) pathHistory.shift()

            if (pathHistory.length > 1) {
                ctx.globalAlpha = 0.25
                ctx.strokeStyle = '#808080'
                ctx.lineWidth = 1
                ctx.beginPath()
                for (let i = 0; i < pathHistory.length; i++) {
                    const point = pathHistory[i]
                    if (i === 0) ctx.moveTo(point.x, point.y)
                    else ctx.lineTo(point.x, point.y)
                }
                ctx.stroke()
            }

            ctx.globalAlpha = 1
            ctx.beginPath()
            ctx.arc(currentX, currentY, 3, 0, Math.PI * 2)
            const pointGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 15)
            pointGradient.addColorStop(0, '#ffffff')
            pointGradient.addColorStop(0.5, '#E91E63')
            pointGradient.addColorStop(1, 'transparent')
            ctx.fillStyle = pointGradient
            ctx.fill()

            // Reactive wave at bottom
            const waveY = canvas.height - 80
            const waveAmplitudeMultiplier = hoveredItem ? 1.8 : 1
            ctx.globalAlpha = 0.35
            ctx.strokeStyle = hoveredItem
                ? NAV_ITEMS.find(i => i.id === hoveredItem)?.hoverColor || '#4DD0E1'
                : '#4DD0E1'
            ctx.lineWidth = 1.5
            ctx.beginPath()

            for (let x = 0; x < canvas.width; x++) {
                let y = waveY
                for (let i = 1; i <= 5; i++) {
                    const amplitude = (15 / Math.pow(PHI, i - 1)) * waveAmplitudeMultiplier
                    const frequency = i * 0.01
                    y += amplitude * Math.sin(frequency * x) // No time animation
                }
                if (x === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.stroke()

            // Wave probability fill
            ctx.globalAlpha = hoveredItem ? 0.3 : 0.15
            ctx.fillStyle = hoveredItem
                ? NAV_ITEMS.find(i => i.id === hoveredItem)?.hoverColor || '#4DD0E1'
                : '#4DD0E1'
            ctx.beginPath()
            ctx.moveTo(0, waveY)
            for (let x = 0; x < canvas.width; x++) {
                let y = waveY
                for (let i = 1; i <= 5; i++) {
                    const amplitude = (15 / Math.pow(PHI, i - 1)) * waveAmplitudeMultiplier
                    const frequency = i * 0.01
                    y += amplitude * Math.sin(frequency * x) // No time animation
                }
                ctx.lineTo(x, y)
            }
            ctx.lineTo(canvas.width, waveY)
            ctx.closePath()
            ctx.fill()

            // Planetary connections
            ctx.globalAlpha = 0.2
            NAV_ITEMS.forEach((item, i) => {
                const nextItem = NAV_ITEMS[(i + 1) % NAV_ITEMS.length]
                const angle1 = ((item.angle + rotation) * Math.PI) / 180
                const angle2 = ((nextItem.angle + rotation) * Math.PI) / 180
                const x1 = centerX + Math.cos(angle1) * radius
                const y1 = centerY + Math.sin(angle1) * radius
                const x2 = centerX + Math.cos(angle2) * radius
                const y2 = centerY + Math.sin(angle2) * radius

                ctx.strokeStyle = item.inactiveColor
                ctx.lineWidth = 1
                ctx.beginPath()

                const steps = 50
                for (let j = 0; j <= steps; j++) {
                    const t = j / steps
                    const baseX = x1 + (x2 - x1) * t
                    const baseY = y1 + (y2 - y1) * t
                    let offset = 0
                    for (let n = 1; n <= 3; n++) {
                        const amplitude = 12 / Math.pow(PHI, n)
                        const frequency = n * 2
                        offset += amplitude * Math.sin(frequency * t * Math.PI + time * n)
                    }
                    const dx = x2 - x1
                    const dy = y2 - y1
                    const length = Math.sqrt(dx * dx + dy * dy)
                    const perpX = -dy / length
                    const perpY = dx / length
                    const finalX = baseX + perpX * offset
                    const finalY = baseY + perpY * offset
                    if (j === 0) ctx.moveTo(finalX, finalY)
                    else ctx.lineTo(finalX, finalY)
                }
                ctx.stroke()
            })

            ctx.globalAlpha = 1
            animationFrameId = requestAnimationFrame(render)
        }

        render()
        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [rotation, hoveredItem])

    const handleClick = (path: string) => router.push(path)

    const getCirclePosition = (angle: number, radius: number) => {
        const rad = ((angle + rotation) * Math.PI) / 180
        return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius }
    }

    return (
        <>
            <AnimatePresence>
                {showEye && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: 'blur(20px)' }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
                    >
                        <div className="relative">
                            {/* Glitch layers */}
                            <motion.div
                                animate={{
                                    x: [0, -2, 2, -1, 1, 0],
                                    y: [0, 1, -1, 2, -2, 0],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{
                                    duration: 0.2,
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    repeatDelay: Math.random() * 2
                                }}
                                className="absolute inset-0 mix-blend-screen"
                            >
                                <EyeSVG progress={eyeProgress} color="#ff0000" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    x: [0, 2, -2, 1, -1, 0],
                                    y: [0, -1, 1, -2, 2, 0],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{
                                    duration: 0.2,
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    repeatDelay: Math.random() * 2 + 0.1
                                }}
                                className="absolute inset-0 mix-blend-screen"
                            >
                                <EyeSVG progress={eyeProgress} color="#00ffff" />
                            </motion.div>

                            {/* Main Eye */}
                            <div className="relative z-10">
                                <EyeSVG progress={eyeProgress} color="#00BCD4" main />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
                <canvas ref={canvasRef} className="absolute inset-0" />

                <div className="relative z-10">
                    <div
                        className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 border-4"
                        style={{
                            borderColor: hoveredItem ? '#00BCD4' : '#2196F3',
                            backgroundColor: 'transparent',
                            boxShadow: hoveredItem ? '0 0 40px #00BCD4' : '0 0 20px #2196F3'
                        }}
                    >
                        <span className="text-6xl transition-colors duration-300" style={{ color: hoveredItem ? '#00BCD4' : '#2196F3' }}>
                            ☽
                        </span>
                    </div>

                    {hoveredItem && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className="text-white text-xl font-bold">
                                {NAV_ITEMS.find(item => item.id === hoveredItem)?.label}
                            </span>
                        </motion.div>
                    )}
                </div>

                {NAV_ITEMS.map((item) => {
                    const isHovered = hoveredItem === item.id
                    const position = getCirclePosition(item.angle, 250)

                    return (
                        <motion.div
                            key={item.id}
                            className="absolute cursor-pointer z-10"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
                            }}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => handleClick(item.path)}
                        >
                            <div
                                className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-4"
                                style={{
                                    borderColor: isHovered ? item.hoverColor : item.inactiveColor,
                                    backgroundColor: 'transparent',
                                    boxShadow: isHovered ? `0 0 30px ${item.hoverColor}` : `0 0 15px ${item.inactiveColor}88`
                                }}
                            >
                                <span className="text-4xl transition-colors duration-300" style={{ color: isHovered ? item.hoverColor : item.inactiveColor }}>
                                    {item.symbol}
                                </span>
                            </div>

                            {isHovered && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className="text-white text-lg font-bold">{item.label}</span>
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </div>
        </>
    )
}
