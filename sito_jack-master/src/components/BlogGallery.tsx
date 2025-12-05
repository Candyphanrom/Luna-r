'use client'

import Link from 'next/link'

export default function BlogGallery() {
    const posts = [
        {
            id: 1,
            title: 'Advanced Multi-Material Printing Techniques',
            excerpt: 'Exploring the possibilities of combining different materials in a single print for enhanced functionality.',
            category: 'Tutorial',
            date: '2025-01-15',
            image: '/blog/1.jpg'
        },
        {
            id: 2,
            title: 'Case Study: Architectural Scale Models',
            excerpt: 'How we helped an architecture firm create precise 1:100 scale models for client presentations.',
            category: 'Case Study',
            date: '2025-01-10',
            image: '/blog/2.jpg'
        },
        {
            id: 3,
            title: 'Sustainable Materials in 3D Printing',
            excerpt: 'A deep dive into eco-friendly filaments and their impact on the environment.',
            category: 'Sustainability',
            date: '2025-01-05',
            image: '/blog/3.jpg'
        }
    ]

    return (
        <section className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Latest Projects & Insights
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Explore our work and learn about 3D printing innovations
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
                        >
                            {/* Image */}
                            <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-cyan-900/30 flex items-center justify-center overflow-hidden">
                                <span className="text-6xl text-white/20 group-hover:text-white/30 transition-colors">
                                    📸
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs px-3 py-1 bg-cyan-400/10 text-cyan-400 rounded-full border border-cyan-400/20">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{post.date}</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                    {post.title}
                                </h3>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {post.excerpt}
                                </p>

                                <Link
                                    href={`/blog/${post.id}`}
                                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-12">
                    <Link
                        href="/blog"
                        className="inline-block px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 hover:border-cyan-400/50 transition-all"
                    >
                        View All Articles
                    </Link>
                </div>
            </div>
        </section>
    )
}
