'use client'

export default function TrustSection() {
    const reviews = [
        {
            id: 1,
            name: 'Sarah Chen',
            role: 'Product Designer',
            content: 'Exceptional quality and precision. LUN/R brought my prototype to life exactly as envisioned.',
            rating: 5,
            project: 'Custom Enclosure'
        },
        {
            id: 2,
            name: 'Marcus Rodriguez',
            role: 'Architect',
            content: 'Fast turnaround and sustainable materials. Perfect for our architectural models.',
            rating: 5,
            project: 'Scale Model'
        },
        {
            id: 3,
            name: 'Elena Volkov',
            role: 'Engineer',
            content: 'Professional service and attention to detail. Highly recommend for technical parts.',
            rating: 5,
            project: 'Mechanical Components'
        }
    ]

    const projects = [
        { id: 1, image: '/projects/1.jpg', title: 'Cyberpunk Helmet' },
        { id: 2, image: '/projects/2.jpg', title: 'Architectural Model' },
        { id: 3, image: '/projects/3.jpg', title: 'Custom Enclosure' },
        { id: 4, image: '/projects/4.jpg', title: 'Art Installation' }
    ]

    return (
        <section className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Trusted by Creators
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Join hundreds of satisfied clients worldwide
                    </p>
                </div>

                {/* Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-cyan-400/30 transition-all"
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                ))}
                            </div>
                            <p className="text-gray-300 mb-4 italic">"{review.content}"</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-semibold">{review.name}</p>
                                    <p className="text-gray-500 text-sm">{review.role}</p>
                                </div>
                                <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                                    {review.project}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Project Gallery Preview */}
                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">Recent Projects</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="aspect-square bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-lg overflow-hidden group cursor-pointer border border-white/10 hover:border-cyan-400/50 transition-all"
                            >
                                <div className="w-full h-full flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
                                    <span className="text-6xl">🔷</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sustainability Message */}
                <div className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border border-green-500/20 rounded-lg p-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <span className="text-4xl">🌱</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Sustainable 3D Printing</h3>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        We use eco-friendly, recyclable materials and energy-efficient processes.
                        Every print is optimized to minimize waste while maintaining exceptional quality.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        <span className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm">
                            ♻️ Recyclable Materials
                        </span>
                        <span className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm">
                            ⚡ Energy Efficient
                        </span>
                        <span className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm">
                            🌍 Carbon Neutral
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
