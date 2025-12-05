import TopNavigation from '@/components/TopNavigation'

export default function GalleryPage() {
    const projects = [
        { id: 1, title: 'Cyberpunk Helmet', category: 'Cosplay', materials: ['PLA', 'Resin'] },
        { id: 2, title: 'Architectural Model', category: 'Architecture', materials: ['Resin'] },
        { id: 3, title: 'Custom Enclosure', category: 'Electronics', materials: ['ABS'] },
        { id: 4, title: 'Art Installation', category: 'Art', materials: ['Metal', 'Resin'] },
        { id: 5, title: 'Mechanical Parts', category: 'Engineering', materials: ['Metal'] },
        { id: 6, title: 'Jewelry Collection', category: 'Fashion', materials: ['Resin'] },
        { id: 7, title: 'Drone Components', category: 'Robotics', materials: ['PLA', 'Carbon Fiber'] },
        { id: 8, title: 'Medical Model', category: 'Healthcare', materials: ['Resin'] }
    ]

    return (
        <>
            <TopNavigation />
            <div className="min-h-screen bg-black text-white pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            Project Gallery
                        </h1>
                        <p className="text-gray-400">Explore our portfolio of completed 3D printing projects</p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 mb-8 justify-center">
                        {['All', 'Cosplay', 'Architecture', 'Electronics', 'Art', 'Engineering'].map((cat) => (
                            <button
                                key={cat}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:border-cyan-400/50 hover:bg-white/10 transition-colors"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Project Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-cyan-400/50 transition-all hover:-translate-y-1 cursor-pointer"
                            >
                                <div className="aspect-square bg-gradient-to-br from-purple-900/20 to-cyan-900/20 flex items-center justify-center relative overflow-hidden">
                                    <span className="text-6xl text-white/20 group-hover:text-white/40 transition-colors">
                                        🔷
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <span className="text-cyan-400 text-sm font-semibold">View 3D Model →</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-2">{project.category}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {project.materials.map((material) => (
                                            <span
                                                key={material}
                                                className="text-xs px-2 py-1 bg-cyan-400/10 text-cyan-400 rounded"
                                            >
                                                {material}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
                        <a
                            href="/custom-order"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg transition-all"
                        >
                            Upload Your Design
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
