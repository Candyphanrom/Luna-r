'use client'

import { useState } from 'react'
import TopNavigation from '@/components/TopNavigation'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement actual form submission
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
    }

    return (
        <>
            <TopNavigation />
            <div className="min-h-screen bg-black text-white pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            Get In Touch
                        </h1>
                        <p className="text-gray-400">We'd love to hear about your project</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
                            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                            {submitted && (
                                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded text-green-400">
                                    ✓ Message sent successfully!
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white focus:border-cyan-400 focus:outline-none resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg transition-all"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            {/* Multi-Channel Options */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
                                <h2 className="text-2xl font-bold mb-6">Contact Channels</h2>

                                <div className="space-y-4">
                                    <a
                                        href="mailto:info@lunavex.com"
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-3xl">📧</span>
                                        <div>
                                            <div className="font-semibold">Email</div>
                                            <div className="text-sm text-gray-400">info@lunavex.com</div>
                                        </div>
                                    </a>

                                    <a
                                        href="https://wa.me/1234567890"
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-3xl">💬</span>
                                        <div>
                                            <div className="font-semibold">WhatsApp</div>
                                            <div className="text-sm text-gray-400">Chat with us</div>
                                        </div>
                                    </a>

                                    <a
                                        href="https://t.me/lunavex"
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-3xl">✈️</span>
                                        <div>
                                            <div className="font-semibold">Telegram</div>
                                            <div className="text-sm text-gray-400">@lunavex</div>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Location & Hours */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
                                <h2 className="text-2xl font-bold mb-6">Visit Us</h2>

                                <div className="space-y-4">
                                    <div>
                                        <div className="font-semibold mb-1">📍 Location</div>
                                        <div className="text-gray-400">Bologna, Italy</div>
                                    </div>

                                    <div>
                                        <div className="font-semibold mb-1">🕐 Hours</div>
                                        <div className="text-gray-400">
                                            Mon-Fri: 9:00 AM - 6:00 PM<br />
                                            Sat: 10:00 AM - 4:00 PM<br />
                                            Sun: Closed
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 aspect-video bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-lg flex items-center justify-center">
                                    <span className="text-4xl text-white/20">🗺️</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
