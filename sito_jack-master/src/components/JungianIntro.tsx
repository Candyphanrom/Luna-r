'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUOTES = [
    "Who looks outside, dreams; who looks inside, awakes.",
    "The privilege of a lifetime is to become who you truly are.",
    "One does not become enlightened by imagining figures of light, but by making the darkness conscious.",
    "In all chaos there is a cosmos, in all disorder a secret order.",
    "e^(iπ) + 1 = 0",
    "φ = (1 + √5) / 2",
    "∇ × E = -∂B/∂t",
    "SYSTEM_INTEGRITY: 99.9%",
    "NEURAL_LINK: ACTIVE"
]

export default function JungianIntro({ onEnter }: { onEnter: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let time = 0

        // Resize handler
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', resize)
        resize()

        // Drawing helpers
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

        const drawGear = (x: number, y: number, radius: number, teeth: number, rotation: number) => {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(rotation)
            ctx.beginPath()
            for (let i = 0; i < teeth * 2; i++) {
                const angle = (Math.PI * 2 * i) / (teeth * 2)
                const r = i % 2 === 0 ? radius : radius * 0.85
                ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
            }
            ctx.closePath()
            ctx.stroke()

            // Inner circle
            ctx.beginPath()
            ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2)
            ctx.stroke()

            // Spokes
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI * i) / 2
                ctx.moveTo(0, 0)
                ctx.lineTo(Math.cos(angle) * radius * 0.5, Math.sin(angle) * radius * 0.5)
                ctx.stroke()
            }
            ctx.restore()
        }

        const render = () => {
            time += 0.005
            ctx.fillStyle = '#000000'
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
            const influence = Math.max(0, 1 - dist / 500) // Stronger near center

            // Draw Da Vinci style construction lines
            ctx.globalAlpha = 0.15
            ctx.beginPath()
            ctx.arc(centerX, centerY, 300, 0, Math.PI * 2)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(centerX - 400, centerY)
            ctx.lineTo(centerX + 400, centerY)
            ctx.moveTo(centerX, centerY - 400)
            ctx.lineTo(centerX, centerY + 400)
            ctx.stroke()

            // Draw Gears (Mandala)
            ctx.globalAlpha = 0.8
            const jitter = isHovering ? 2 + influence * 5 : 1

            // Main Gear
            drawGear(centerX, centerY, 150, 24, time)

            // Satellite Gears
            const satellites = 6
            for (let i = 0; i < satellites; i++) {
                const angle = (Math.PI * 2 * i) / satellites + time * 0.5
                const x = centerX + Math.cos(angle) * 250
                const y = centerY + Math.sin(angle) * 250
                drawGear(x, y, 60, 12, -time * 2)

                // Connecting lines (scribbled)
                ctx.globalAlpha = 0.3
                drawScribbleLine(centerX, centerY, x, y, jitter)
            }

            // Floating Text (Math & Quotes)
            ctx.globalAlpha = 0.6
            ctx.font = '12px "Courier New", monospace'
            ctx.fillStyle = '#ffffff'

            QUOTES.forEach((quote, i) => {
                const angle = (Math.PI * 2 * i) / QUOTES.length + time * 0.2
                const radius = 350 + Math.sin(time * 2 + i) * 20
                const x = centerX + Math.cos(angle) * radius
                const y = centerY + Math.sin(angle) * radius

                ctx.save()
                ctx.translate(x, y)
                ctx.rotate(angle + Math.PI / 2)
                ctx.fillText(quote, 0, 0)
                ctx.restore()
            })

            // "Enter" Text
            ctx.globalAlpha = 1
            ctx.font = '24px "Courier New", monospace'
            ctx.textAlign = 'center'
            const blink = Math.sin(time * 5) > 0 ? 1 : 0.5
            ctx.globalAlpha = blink
            ctx.fillText("[ CLICK TO INTEGRATE ]", centerX, centerY + 400)

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [mousePos, isHovering])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[100] cursor-pointer bg-black"
            onClick={onEnter}
            onMouseMove={(e) => {
                setMousePos({ x: e.clientX, y: e.clientY })
                setIsHovering(true)
            }}
            onMouseLeave={() => setIsHovering(false)}
        >
            <canvas
                ref={canvasRef}
                className="h-full w-full"
            />
        </motion.div>
    )
}
