import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const pageTransition = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

function CarCard({ car, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 + index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden bg-[#222]">
        {car.image_url ? (
          <motion.img
            src={car.image_url}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-[#333]">
              <path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
        )}

        <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${
          car.status === 'Active'
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-amber-500/20 text-amber-400'
        }`}>
          {car.status}
        </div>

        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {car.year}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <p className="text-[#888] text-xs font-medium uppercase tracking-wider mb-1">{car.make}</p>
          <h3 className="text-white font-bold text-lg leading-tight">{car.model}</h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-6">
          {car.horsepower && (
            <span className="bg-[#E63946]/20 text-[#E63946] text-xs font-bold px-2.5 py-1 rounded-full">
              {car.horsepower} hp
            </span>
          )}
          {car.color && (
            <span className="text-xs text-[#888] font-medium">{car.color}</span>
          )}
        </div>

        <Link
          to={`/car/${car.id}`}
          className="block w-full text-center bg-[#222] border border-[#333] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#E63946] hover:border-[#E63946] transition-all duration-200 cursor-pointer"
        >
          View details
        </Link>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function fetchCars() {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setCars(data ?? [])
      setLoading(false)
    }
    fetchCars()
  }, [user])

  const totalHp = cars.reduce((sum, c) => sum + (c.horsepower || 0), 0)
  const activeCars = cars.filter((c) => c.status === 'Active').length

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-[#111111] font-sans"
    >
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-[0.15em] text-white uppercase">
            GARAGE
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-white cursor-pointer">
              Dashboard
            </Link>
            <Link to="/add-car" className="text-sm font-medium text-[#888] hover:text-white transition-colors duration-200 cursor-pointer">
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

      <div className="pt-28 pb-16 px-6 max-w-7xl mx-auto">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Good morning, {user?.email?.split('@')[0]} 👋
          </h1>
          <p className="text-[#888] text-lg">Here's what's in your garage today.</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          {[
            {
              label: 'Total Cars',
              value: loading ? '—' : cars.length,
              unit: 'vehicles',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                  <path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              ),
            },
            {
              label: 'Total Horsepower',
              value: loading ? '—' : totalHp.toLocaleString(),
              unit: 'hp combined',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              ),
            },
            {
              label: 'Active Cars',
              value: loading ? '—' : activeCars,
              unit: 'in active status',
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ),
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-[#E63946]">{stat.icon}</div>
                <p className="text-[#888] text-sm font-medium">{stat.label}</p>
              </div>
              <p className="text-white text-3xl font-black mb-1">{stat.value}</p>
              <p className="text-[#555] text-xs font-medium">{stat.unit}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="text-2xl font-black text-white"
          >
            My Cars
          </motion.h2>
          <Link
            to="/add-car"
            className="flex items-center gap-2 bg-[#E63946] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#c8303c] transition-colors duration-200 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Car
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-[#333] border-t-[#E63946] rounded-full"
            />
          </div>
        )}

        {/* Empty state */}
        {!loading && cars.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9 text-[#444]">
                <path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Your garage is empty</h3>
            <p className="text-[#555] text-sm mb-8 max-w-xs">Add your first car to start building your collection.</p>
            <Link
              to="/add-car"
              className="flex items-center gap-2 bg-[#E63946] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#c8303c] transition-colors duration-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add your first car
            </Link>
          </motion.div>
        )}

        {/* Car grid */}
        {!loading && cars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cars.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
