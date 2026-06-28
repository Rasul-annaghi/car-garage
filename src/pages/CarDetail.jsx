import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const pageTransition = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

export default function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchCar() {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setCar(data)
      }
      setLoading(false)
    }
    fetchCar()
  }, [id])

  async function handleLogout() {
    navigate('/')
    await logout()
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase.from('cars').delete().eq('id', car.id)
    if (error) {
      setDeleting(false)
      setConfirmDelete(false)
      return
    }
    navigate('/dashboard')
  }

  function handleEdit() {
    navigate('/add-car', { state: { car } })
  }

  const specs = car
    ? [
        { label: 'Year', value: car.year },
        { label: 'Horsepower', value: car.horsepower ? `${car.horsepower} hp` : '—' },
        { label: 'Engine', value: car.engine || '—' },
        { label: 'Color', value: car.color || '—' },
        { label: 'Status', value: car.status || '—' },
        { label: 'Make', value: car.make },
      ]
    : []

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-black tracking-[0.15em] text-white uppercase">
          GARAGE
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium text-[#888] hover:text-white transition-colors duration-200">
            Dashboard
          </Link>
          <Link to="/add-car" className="text-sm font-medium text-[#888] hover:text-white transition-colors duration-200">
            Add Car
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#888] hidden md:block truncate max-w-[180px]">{user?.email}</span>
          <div className="w-9 h-9 rounded-full bg-[#E63946] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{user?.email?.[0]?.toUpperCase() ?? 'U'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-[#888] hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )

  if (loading) {
    return (
      <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="min-h-screen bg-[#111111] font-sans">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-[#333] border-t-[#E63946] rounded-full"
          />
        </div>
      </motion.div>
    )
  }

  if (notFound) {
    return (
      <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="min-h-screen bg-[#111111] font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9 text-[#444]">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Car not found</h3>
          <p className="text-[#555] text-sm mb-8">This car doesn't exist or you don't have access to it.</p>
          <Link
            to="/dashboard"
            className="bg-[#E63946] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#c8303c] transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-[#111111] font-sans"
    >
      <Navbar />

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-6">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-[#888] hover:text-white transition-colors duration-200 text-sm font-medium cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </Link>
        </motion.div>

        {/* Hero photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative rounded-2xl overflow-hidden mb-10 h-72 md:h-96 bg-[#1A1A1A]"
        >
          {car.image_url ? (
            <img
              src={car.image_url}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-32 h-32 text-[#2A2A2A]">
                <path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#111111] to-transparent" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — main info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <p className="text-[#888] text-sm font-semibold uppercase tracking-widest mb-1">{car.make} · {car.year}</p>
              <h1 className="text-5xl font-black text-white leading-tight mb-4">{car.model}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                {car.horsepower && (
                  <span className="bg-[#E63946]/20 text-[#E63946] font-bold text-sm px-3 py-1.5 rounded-full">
                    {car.horsepower} hp
                  </span>
                )}
                <span
                  className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                    car.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {car.status}
                </span>
                {car.color && (
                  <span className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#ccc] text-sm font-medium px-3 py-1.5 rounded-full">
                    {car.color}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Specs grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
            >
              <h2 className="text-lg font-black text-white mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((spec, i) => (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.25 + i * 0.05 }}
                    className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4"
                  >
                    <p className="text-[#555] text-xs font-semibold uppercase tracking-wider mb-1.5">{spec.label}</p>
                    <p className="text-white font-bold text-sm leading-snug">{spec.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Notes */}
            {car.notes && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3 }}
              >
                <h2 className="text-lg font-black text-white mb-4">Notes</h2>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <p className="text-[#aaa] leading-relaxed text-sm">{car.notes}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — actions */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-3 sticky top-24">
              <h3 className="text-white font-bold text-base mb-4">Actions</h3>

              <button
                onClick={handleEdit}
                className="w-full flex items-center gap-3 bg-[#222] border border-[#333] text-white text-sm font-semibold py-3 px-4 rounded-xl hover:border-[#E63946]/50 hover:bg-[#1E1E1E] transition-all duration-200 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#888]">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Car
              </button>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center gap-3 bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946] text-sm font-semibold py-3 px-4 rounded-xl hover:bg-[#E63946]/20 hover:border-[#E63946]/40 transition-all duration-200 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  Delete Car
                </button>
              ) : (
                <div className="bg-[#E63946]/10 border border-[#E63946]/30 rounded-xl p-4 space-y-3">
                  <p className="text-white text-sm font-semibold">Delete {car.make} {car.model}?</p>
                  <p className="text-[#888] text-xs">This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 bg-[#E63946] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#c8303c] transition-colors duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                    >
                      {deleting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Deleting…
                        </>
                      ) : (
                        'Yes, delete'
                      )}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      disabled={deleting}
                      className="flex-1 bg-[#222] border border-[#333] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#2A2A2A] transition-colors duration-200 cursor-pointer disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-[#222]">
                <p className="text-[#555] text-xs font-medium mb-3">Quick info</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-[#666] text-xs">Engine</span>
                    <span className="text-[#aaa] text-xs font-medium text-right max-w-[130px]">{car.engine || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666] text-xs">Output</span>
                    <span className="text-[#aaa] text-xs font-medium">{car.horsepower ? `${car.horsepower} hp` : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666] text-xs">Status</span>
                    <span
                      className={`text-xs font-semibold ${
                        car.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {car.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
