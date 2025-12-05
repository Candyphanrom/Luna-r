'use client'

import { useState } from 'react'

export default function ProductFilters() {
    const [filters, setFilters] = useState({
        material: '',
        priceRange: [0, 500],
        color: '',
        infill: 20
    })

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-bold text-white mb-4">Filters</h3>

            {/* Material */}
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Material</label>
                <select
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:border-cyan-400 focus:outline-none"
                    value={filters.material}
                    onChange={(e) => setFilters({ ...filters, material: e.target.value })}
                >
                    <option value="">All Materials</option>
                    <option value="pla">PLA</option>
                    <option value="resin">Resin</option>
                    <option value="metal">Metal</option>
                    <option value="abs">ABS</option>
                </select>
            </div>

            {/* Price Range */}
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                    className="w-full accent-cyan-400"
                />
            </div>

            {/* Color */}
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                    {['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'].map((color) => (
                        <button
                            key={color}
                            onClick={() => setFilters({ ...filters, color })}
                            className={`w-10 h-10 rounded-full border-2 ${filters.color === color ? 'border-cyan-400' : 'border-white/20'
                                }`}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* Infill % */}
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Infill: {filters.infill}%
                </label>
                <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={filters.infill}
                    onChange={(e) => setFilters({ ...filters, infill: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400"
                />
            </div>

            {/* Reset Button */}
            <button
                onClick={() => setFilters({ material: '', priceRange: [0, 500], color: '', infill: 20 })}
                className="w-full px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
            >
                Reset Filters
            </button>
        </div>
    )
}
