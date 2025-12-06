'use client'

import { useEffect, useRef } from 'react'

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

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

        const columns = Math.floor(canvas.width / 20)
        const drops: number[] = []
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100 // Start above screen randomly
        }

        const chars = '0123456789ABCDEF月星光風蔵匠結業道'

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(10, 14, 39, 0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.fillStyle = '#00f7ff' // Neon Cyan
            ctx.font = '14px monospace'

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)]

                // Randomly highlight some characters in purple
                if (Math.random() > 0.95) {
                    ctx.fillStyle = '#b300ff'
                } else {
                    ctx.fillStyle = 'rgba(0, 247, 255, 0.3)' // Low opacity cyan default
                }

                ctx.fillText(text, i * 20, drops[i] * 20)

                // Reset drop to top randomly after it crosses screen
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }

                drops[i]++
            }
            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-40"
        />
    )
}
