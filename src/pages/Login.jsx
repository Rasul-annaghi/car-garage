import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const pageTransition = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-[#111111] font-sans flex flex-col items-center justify-center px-6"
    >
      {/* Logo */}
      <Link to="/" className="text-2xl font-black tracking-[0.15em] text-white uppercase mb-10">
        GARAGE
      </Link>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8"
      >
        <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
        <p className="text-[#888] text-sm mb-8">Sign in to access your garage.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[#888] uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#111] border border-[#2A2A2A] text-white placeholder:text-[#444] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E63946] transition-colors duration-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-[#888] uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#111] border border-[#2A2A2A] text-white placeholder:text-[#444] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E63946] transition-colors duration-200"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#E63946] text-sm bg-[#E63946]/10 border border-[#E63946]/20 rounded-xl px-4 py-3"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E63946] hover:bg-[#c8303c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-xl transition-colors duration-200 cursor-pointer mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#888] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white font-semibold hover:text-[#E63946] transition-colors duration-200">
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}
