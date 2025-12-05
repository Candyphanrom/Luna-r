'use client'

import { useState } from 'react'
import TopNavigation from '@/components/TopNavigation'

export default function CustomOrderPage() {
    const [file, setFile] = useState<File | null>(null)
    const [material, setMaterial] = useState('pla')
    const [color, setColor] = useState('#000000')
    const [infill, setInfill] = useState(20)
    const [layerHeight, setLayerHeight] = useState(0.2)
    const [quote, setQuote] = useState<number | null>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const calculateQuote = () => {
        const basePrices: Record<string, number> = {
            pla: 50,
            resin: 80,
            metal: 150,
            abs: 60
        }

        const base = basePrices[material] || 50
        const infillMultiplier = 1 + (infill / 100)
        const layerMultiplier = layerHeight < 0.15 ? 1.5 : 1

        const total = base * infillMultiplier * layerMultiplier
        setQuote(total)
    }

    return (
        <>
            <TopNavigation />
            <div className="min-h-screen bg-black text-white pt-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            Custom Order
                        </h1>
                        <p className="text-gray-400">Upload your 3D model and get an instant quote</p>
                    </div>

                    <div className="space-y-8">
                        {/* File Upload */}
                        <div className="bg-white/5 backdrop-blur-sm border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-cyan-400/50 transition-colors">
                            <input
                                type="file"
                                accept=".stl,.obj,.3mf"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="text-6xl mb-4">📤</div>
                                <h3 className="text-xl font-bold mb-2">
                                    {file ? file.name : 'Upload Your 3D Model'}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Supported formats: .STL, .OBJ, .3MF
                                </p>
                            </label>
                        </div>

                        {/* Material Selection */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-4">Material & Settings</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Material</label>
                                    <select
                                        value={material}
                                        onChange={(e) => setMaterial(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:border-cyan-400 focus:outline-none"
                                    >
                                        <option value="pla">PLA - $50 base</option>
                                        <option value="abs">ABS - $60 base</option>
                                        <option value="resin">Resin - $80 base</option>
                                        <option value="metal">Metal - $150 base</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Color</label>
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full h-10 bg-white/5 border border-white/10 rounded cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Infill: {infill}%
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        step="10"
                                        value={infill}
                                        onChange={(e) => setInfill(parseInt(e.target.value))}
                                        className="w-full accent-cyan-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Layer Height: {layerHeight}mm
                                    </label>
                                    <select
                                        value={layerHeight}
                                        onChange={(e) => setLayerHeight(parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:border-cyan-400 focus:outline-none"
                                    >
                                        <option value="0.1">0.1mm (High Quality)</option>
                                        <option value="0.2">0.2mm (Standard)</option>
                                        <option value="0.3">0.3mm (Fast)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Quote Generator */}
                        <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-400/30 rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-4">Get Your Quote</h3>

                            {quote !== null ? (
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-cyan-400 mb-4">
                                        ${quote.toFixed(2)}
                                    </div>
                                    <p className="text-gray-300 mb-6">Estimated delivery: 5-7 business days</p>
                                    <div className="flex gap-4 justify-center">
                                        <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg transition-all">
                                            Place Order
                                        </button>
                                        <button className="px-8 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all">
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={calculateQuote}
                                    disabled={!file}
                                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Calculate Quote
                                </button>
                            )}
                        </div>

                        {/* Security Badge */}
                        <div className="text-center text-sm text-gray-500">
                            <p>🔒 Your files are encrypted and secure • GDPR compliant</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
