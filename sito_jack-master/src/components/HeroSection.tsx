'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const PHI = 1.618033988749895

interface Product {
    id: string
    name: string
    price: number
    modelUrl?: string
}

interface HeroSectionProps {
    featuredProducts: Product[]
}

// Placeholder Cyber Artifact (Animated Wireframe Icosahedron)
function CyberArtifact() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} scale={1.5}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color="#4DD0E1"
                    wireframe
                    emissive="#7E57C2"
                    emissiveIntensity={0.5}
                />
            </mesh>
            {/* Inner core */}
            <mesh scale={0.5}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color="#E91E63"
                    emissive="#E91E63"
                    emissiveIntensity={2}
                    wireframe={false}
                />
            </mesh>
        </Float>
    )
}

import { STLLoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'

// Model Loader Component
function Model({ url }: { url: string }) {
    const isStl = url.toLowerCase().endsWith('.stl')

    if (isStl) {
        const geometry = useLoader(STLLoader, url)
        return (
            <mesh scale={0.05} rotation={[-Math.PI / 2, 0, 0]}>
                <primitive object={geometry} attach="geometry" />
                <meshStandardMaterial color="#4DD0E1" />
            </mesh>
        )
    }

    // Default to GLTF
    const { scene } = useGLTF(url)
    return <primitive object={scene} scale={2} />
}

function Scene({ modelUrl }: { modelUrl?: string }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls
                enableZoom={false}
                autoRotate
                autoRotateSpeed={2}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
            />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4DD0E1" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#E91E63" />
            <Environment preset="city" />

            <Suspense fallback={<CyberArtifact />}>
                {modelUrl ? <Model url={modelUrl} /> : <CyberArtifact />}
            </Suspense>
        </>
    )
}

export default function HeroSection({ featuredProducts }: HeroSectionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [currentProductIndex, setCurrentProductIndex] = useState(0)

    // Fourier background animation
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let time = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = 600
        }
        window.addEventListener('resize', resize)
        resize()

        const epicycles = Array.from({ length: 5 }, (_, i) => ({
            radius: 60 / Math.pow(PHI, i * 0.5),
            frequency: Math.pow(PHI, i * 0.3) * 0.08,
            phase: (Math.PI * 2 * i) / 5
        }))

        const render = () => {
            time += 0.003
            ctx.fillStyle = 'transparent'
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const centerX = canvas.width / 2
            const centerY = 300

            let currentX = centerX
            let currentY = centerY

            epicycles.forEach((epicycle, i) => {
                const angle = time * epicycle.frequency + epicycle.phase

                ctx.globalAlpha = 0.08
                ctx.strokeStyle = i % 2 === 0 ? '#7E57C2' : '#4DD0E1'
                ctx.lineWidth = 1

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

            ctx.globalAlpha = 1
            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    const currentProduct = featuredProducts[currentProductIndex] || {
        id: '0',
        name: 'Premium 3D Print',
        price: 99.99
    }

    return (
        <section className="relative h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-purple-900/10 to-black">
            {/* Fourier Background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Precision 3D Printing
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                        Transform your ideas into reality with cutting-edge additive manufacturing.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link
                            href="/products"
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
                        >
                            Browse Catalog
                        </Link>
                        <Link
                            href="/custom-order"
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all"
                        >
                            Get a Quote
                        </Link>
                    </div>
                </div>

                {/* 3D Viewer */}
                <div className="h-[400px] w-full relative">
                    {/* Glassmorphism Container */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20">
                        <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/30">
                                INTERACTIVE PREVIEW
                            </span>
                        </div>

                        <Canvas>
                            <Scene modelUrl={currentProduct.modelUrl} />
                        </Canvas>

                        {/* Product Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-2xl font-bold text-white">{currentProduct.name}</h3>
                            <p className="text-cyan-400 text-lg">${currentProduct.price.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
