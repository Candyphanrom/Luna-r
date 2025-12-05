'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const PHI = 1.618033988749895

export default function CTASection() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let time = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = 400
        }
        window.addEventListener('resize', resize)
        resize()

        const render = () => {
            time += 0.002
            ctx.fillStyle = 'transparent'
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Wave at bottom
            const waveY = 200
            ctx.globalAlpha = 0.15
            ctx.strokeStyle = '#4DD0E1'
            ctx.lineWidth = 2
            ctx.beginPath()

            for (let x = 0; x < canvas.width; x++) {
                let y = waveY
                for (let i = 1; i <= 5; i++) {
                    const amplitude = 30 / Math.pow(PHI, i - 1)
                    const frequency = i * 0.008
                    y += amplitude * Math.sin(frequency * x + time * i * 2)
                }
                if (x === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.stroke()

            ctx.globalAlpha = 1
            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <section className="relative py-20 overflow-hidden bg-gradient-to-b from-black via-purple-900/10 to-black">
            <canvas ref={canvasRef} className="absolute inset-0" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Ready to Bring Your Vision to Life?
                </h2>

                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                    Upload your 3D model or design specifications and get an instant quote.
                    Our team will bring your creation to reality with precision and care.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/admin/products/new"
                        className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            📤 Upload Your Design
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    <Link
                        href="/contact"
                        className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/20 hover:border-cyan-400/50 transition-all"
                    >
                        Contact Us
                    </Link>
                </div>

                <p className="mt-8 text-gray-500 text-sm">
                    Free quote • Fast turnaround • Professional quality
                </p>
            </div>
        </section>
    )
}
