import TopNavigation from '@/components/TopNavigation'
import Link from 'next/link'

export default function BlogPage() {
    const posts = [
        {
            id: 1,
            title: 'Advanced Multi-Material Printing Techniques',
            excerpt: 'Exploring the possibilities of combining different materials in a single print for enhanced functionality.',
            category: 'Tutorial',
            date: '2025-01-15',
            slug: 'multi-material-printing'
        },
        {
            id: 2,
            title: 'Case Study: Architectural Scale Models',
            excerpt: 'How we helped an architecture firm create precise 1:100 scale models for client presentations.',
            category: 'Case Study',
            date: '2025-01-10',
            slug: 'architectural-models'
        },
        {
            id: 3,
            title: 'Sustainable Materials in 3D Printing',
            excerpt: 'A deep dive into eco-friendly filaments and their impact on the environment.',
            category: 'Sustainability',
            date: '2025-01-05',
            slug: 'sustainable-materials'
        },
        {
            id: 4,
            title: 'Optimizing Print Settings for Strength',
            excerpt: 'Learn how to configure your prints for maximum durability and structural integrity.',
            category: 'Tutorial',
            date: '2024-12-28',
            slug: 'print-strength'
        },
        {
            id: 5,
            title: 'The Future of Metal 3D Printing',
            excerpt: 'Exploring emerging technologies in metal additive manufacturing and their applications.',
            category: 'Technology',
            date: '2024-12-20',
            slug: 'metal-printing-future'
        },
        {
            id: 6,
            title: 'Custom Prosthetics: A Success Story',
            excerpt: 'How 3D printing is revolutionizing personalized medical devices and improving lives.',
            category: 'Case Study',
            date: '2024-12-15',
            slug: 'custom-prosthetics'
        }
    ]

    return (
        <>
            <TopNavigation />
            <div className="min-h-screen bg-black text-white pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            Blog & Resources
                        </h1>
                        <p className="text-gray-400">Insights, tutorials, and case studies from the world of 3D printing</p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 mb-8 justify-center">
                        {['All', 'Tutorial', 'Case Study', 'Sustainability', 'Technology'].map((cat) => (
                            <button
                                key={cat}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:border-cyan-400/50 hover:bg-white/10 transition-colors"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-cyan-400/50 transition-all hover:-translate-y-1"
                            >
                                <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-cyan-900/30 flex items-center justify-center">
                                    <span className="text-6xl text-white/20 group-hover:text-white/30 transition-colors">
                                        📸
                                    </span>
                                </div>
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
                                    <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                                    <span className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
                                        Read More →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
