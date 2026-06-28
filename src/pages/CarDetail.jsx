import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const pageTransition = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const cars = [
  {
    id: 1,
    make: 'BMW',
    model: 'M3 Competition',
    year: 2024,
    hp: 510,
    color: 'Isle of Man Blue',
    colorHex: '#1D4ED8',
    engine: 'S58 3.0L Twin-Turbo I6',
    status: 'Active',
    notes: 'Track-ready setup with M Performance parts. Suspension upgraded with KW coilovers, carbon ceramic brakes, and full Alcantara interior. Last service at 4,200 miles.',
    photo: 'https://images.unsplash.com/photo-1719573216387-bd296bf97cb1?q=80&w=740&auto=format&fit=crop',
  },
  {
    id: 2,
    make: 'Porsche',
    model: '911 GT3',
    year: 2023,
    hp: 502,
    color: 'Carrara White',
    colorHex: '#E5E7EB',
    engine: '4.0L Naturally Aspirated H6',
    status: 'Active',
    notes: 'Clubsport package with full roll cage. Michelin Pilot Sport Cup 2 tyres. Delivered from Porsche Centre with PDK gearbox. Race-spec air filter installed.',
    photo: 'https://images.unsplash.com/photo-1731514298268-9b4518462ca6?q=80&w=1740&auto=format&fit=crop',
  },
  {
    id: 3,
    make: 'Toyota',
    model: 'Supra MK4',
    year: 1998,
    hp: 320,
    color: 'Super Orange',
    colorHex: '#EA580C',
    engine: '2JZ-GTE 3.0L Twin-Turbo I6',
    status: 'In Service',
    notes: 'Full engine rebuild in progress. New turbochargers, head gasket, and timing belt. Target: 600hp on e85 by end of year.',
    photo: 'https://images.unsplash.com/photo-1688576788457-76df1c87d021?q=80&w=654&auto=format&fit=crop',
  },
  {
    id: 4,
    make: 'Mercedes',
    model: 'AMG GT63',
    year: 2022,
    hp: 630,
    color: 'Obsidian Black',
    colorHex: '#374151',
    engine: 'M177 4.0L Bi-Turbo V8',
    status: 'Active',
    notes: 'Daily driver with AMG Dynamic Plus package. Rear-axle steering, ceramic AMG brakes, and Burmester audio. Tinted windows and AMG aero package installed.',
    photo: 'https://images.unsplash.com/photo-1617814065893-00757125efab?q=80&w=2064&auto=format&fit=crop',
  },
]

const specs = (car) => [
  { label: 'Year', value: car.year },
  { label: 'Horsepower', value: `${car.hp} hp` },
  { label: 'Engine', value: car.engine },
  { label: 'Color', value: car.color },
  { label: 'Status', value: car.status },
  { label: 'Make', value: car.make },
]

export default function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const car = cars.find((c) => c.id === Number(id)) || cars[0]

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
            <Link to="/dashboard" className="text-sm font-medium text-[#888] hover:text-white transition-colors duration-200">
              Dashboard
            </Link>
            <Link to="/add-car" className="text-sm font-medium text-[#888] hover:text-white transition-colors duration-200">
              Add Car
            </Link>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#E63946] flex items-center justify-center cursor-pointer">
            <span className="text-white font-bold text-sm">R</span>
          </div>
        </div>
      </nav>

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
          className="relative rounded-2xl overflow-hidden mb-10 h-72 md:h-96"
        >
          <img
            src={car.photo}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
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
                <span className="bg-[#E63946]/20 text-[#E63946] font-bold text-sm px-3 py-1.5 rounded-full">
                  {car.hp} hp
                </span>
                <span
                  className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                    car.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {car.status}
                </span>
                <span className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[#ccc] text-sm font-medium px-3 py-1.5 rounded-full">
                  <span
                    className="w-3 h-3 rounded-full border border-white/10"
                    style={{ backgroundColor: car.colorHex }}
                  />
                  {car.color}
                </span>
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
                {specs(car).map((spec, i) => (
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
                className="w-full flex items-center gap-3 bg-[#222] border border-[#333] text-white text-sm font-semibold py-3 px-4 rounded-xl hover:border-[#E63946]/50 hover:bg-[#1E1E1E] transition-all duration-200 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#888]">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Car
              </button>

              <button
                onClick={() => navigate('/dashboard')}
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

              <div className="pt-2 border-t border-[#222]">
                <p className="text-[#555] text-xs font-medium mb-3">Quick info</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-[#666] text-xs">Engine</span>
                    <span className="text-[#aaa] text-xs font-medium text-right max-w-[130px]">{car.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666] text-xs">Output</span>
                    <span className="text-[#aaa] text-xs font-medium">{car.hp} hp</span>
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
