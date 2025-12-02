'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/admin')
    } else {
      alert('Invalid credentials')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-indigo-500/30 bg-gray-900/60 backdrop-blur-xl shadow-[0_0_40px_rgba(79,70,229,0.15)]"
      >
        <div className="relative p-8 sm:p-12">
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/30">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Admin Access
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Enter your credentials to access the control panel
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-700 bg-gray-800/50 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-gray-800 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-700 bg-gray-800/50 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-gray-800 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-70"
              >
                {loading ? (
                  'Authenticating...'
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="bg-gray-900/80 px-8 py-4 text-center border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Secure System • Authorized Personnel Only
          </p>
        </div>
      </motion.div>
    </div>
  )
}
