import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const pageTransition = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

function ConfirmationScreen({ email }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-[#111111] font-sans flex flex-col items-center justify-center px-6"
    >
      <Link to="/" className="text-2xl font-black tracking-[0.15em] text-white uppercase mb-10">
        GARAGE
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-emerald-400">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Check your email</h2>
        <p className="text-[#888] text-sm leading-relaxed mb-6">
          We sent a confirmation link to{' '}
          <span className="text-white font-semibold">{email}</span>.{' '}
          Click it to activate your account and then sign in.
        </p>
        <Link
          to="/login"
          className="block w-full bg-[#222] border border-[#333] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#2A2A2A] hover:border-[#444] transition-colors duration-200 cursor-pointer"
        >
          Back to Sign In
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const { data, error: authError } = await supabase.auth.signUp({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Email confirmation disabled → session returned immediately
    if (data.session) {
      navigate('/dashboard')
    } else {
      // Email confirmation required
      setAwaitingConfirmation(true)
      setLoading(false)
    }
  }

  if (awaitingConfirmation) {
    return <ConfirmationScreen email={email} />
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-[#111111] font-sans flex flex-col items-center justify-center px-6"
    >
      <Link to="/" className="text-2xl font-black tracking-[0.15em] text-white uppercase mb-10">
        GARAGE
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8"
      >
        <h1 className="text-2xl font-black text-white mb-1">Create account</h1>
        <p className="text-[#888] text-sm mb-8">Start managing your garage today.</p>

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
              placeholder="Min. 6 characters"
              className="w-full bg-[#111] border border-[#2A2A2A] text-white placeholder:text-[#444] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E63946] transition-colors duration-200"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[#888] uppercase tracking-widest mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-[#888] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold hover:text-[#E63946] transition-colors duration-200">
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}
