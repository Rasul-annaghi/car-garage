import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const pageTransition = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    title: 'Track your cars',
    desc: 'Keep a detailed record of every vehicle — specs, history, and current status, all in one organised space.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: 'Upload photos',
    desc: 'Build a stunning visual gallery for each car. Every angle, every detail, perfectly catalogued.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'Service history',
    desc: 'Never miss a service interval. Log maintenance records and track upcoming service dates with ease.',
  },
]

export default function LandingPage() {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-[#EDEAE4] font-sans"
    >
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#EDEAE4]/90 backdrop-blur-md border-b border-black/6">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-[0.15em] text-[#111111] uppercase">
            GARAGE
          </Link>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#555] hover:text-[#111] transition-colors duration-200 cursor-pointer">
              Features
            </a>
            <Link to="/login" className="text-sm font-medium text-[#555] hover:text-[#111] transition-colors duration-200">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-[#E63946] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#c8303c] transition-colors duration-200 cursor-pointer"
            >
              Start your garage
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — full-viewport split layout */}
      <section className="h-screen pt-16 flex items-center px-6 lg:px-16 xl:px-24">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center lg:items-center lg:justify-between gap-12 lg:gap-16">

          {/* Left: text content */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2.5 bg-[#E63946]/10 text-[#E63946] text-sm font-bold px-5 py-2.5 rounded-full uppercase tracking-widest mb-8 w-fit"
            >
              <span className="w-2 h-2 bg-[#E63946] rounded-full" />
              Premium Garage Management
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-black text-[#111111] tracking-tight mb-7"
              style={{ fontSize: 'clamp(3.5rem, 6.5vw, 7rem)', lineHeight: '1.05' }}
            >
              Your garage.
              <br />
              <span className="text-[#E63946]">Beautifully</span>
              <br />
              <span className="block -mt-2.5">organised.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-xl text-[#666] leading-relaxed max-w-md mb-10 font-normal"
            >
              Track every car you own, love, or dream about.
              All in one place — built for enthusiasts.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/signup"
                className="bg-[#E63946] text-white font-bold px-9 py-4 rounded-full text-base hover:bg-[#c8303c] transition-colors duration-200 cursor-pointer"
              >
                Get started free
              </Link>
              <a
                href="#features"
                className="border-2 border-[#111] text-[#111] font-bold px-9 py-4 rounded-full text-base hover:bg-[#111] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                See how it works
              </a>
            </motion.div>
          </div>

          {/* Right: BMW M3 featured card */}
          <div className="flex items-center shrink-0 lg:ml-6 mt-16">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-[400px] max-w-full"
            >
              {/* Blue ambient glow */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background: 'radial-gradient(ellipse at 50% 60%, rgba(59,130,246,0.3) 0%, transparent 68%)',
                  transform: 'scale(1.25) translateY(5%)',
                  filter: 'blur(32px)',
                }}
              />

              {/* Floating animation */}
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div
                  className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-[#2A2A2A]"
                  style={{
                    boxShadow:
                      '0 0 120px -10px rgba(59,130,246,0.28), 0 60px 120px -24px rgba(0,0,0,0.8), 0 12px 48px -8px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Photo area */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1719573216387-bd296bf97cb1?q=80&w=740&auto=format&fit=crop"
                      alt="BMW M3 Competition"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      2024
                    </div>
                    <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full">
                      Active
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Card body */}
                  <div className="p-8">
                    <p className="text-[#555] text-xs font-bold uppercase tracking-widest mb-1">BMW</p>
                    <h3 className="text-white text-3xl font-black leading-tight mb-1">M3 Competition</h3>
                    <p className="text-[#444] text-sm font-medium mb-7">S58 3.0L Twin-Turbo I6</p>

                    <div className="flex items-center gap-3 flex-wrap mb-7">
                      <span className="bg-[#E63946]/20 text-[#E63946] text-sm font-bold px-4 py-2 rounded-full">
                        510 hp
                      </span>
                      <span className="flex items-center gap-2 text-sm text-[#888] font-medium">
                        <span
                          className="w-4 h-4 rounded-full border border-white/10 flex-shrink-0"
                          style={{ backgroundColor: '#1D4ED8' }}
                        />
                        Isle of Man Blue
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-[#222]">
                      <span className="text-[#444] text-sm font-medium">Added to garage</span>
                      <span className="text-[#888] text-sm font-medium">Jan 2024</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[#E63946] text-xs font-bold uppercase tracking-widest mb-4">Everything you need</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Built for car people,
              <br />by car people.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 hover:border-[#E63946]/40 transition-colors duration-300 cursor-default"
              >
                <div className="text-[#E63946] mb-6">{f.icon}</div>
                <h3 className="text-white font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-[#888] leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] border-t border-[#1E1E1E] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xl font-black tracking-[0.15em] text-white uppercase">GARAGE</span>
          <p className="text-[#555] text-sm">© 2024 Garage. Built for enthusiasts.</p>
          <div className="flex gap-6">
            <a href="#" className="text-[#555] text-sm hover:text-white transition-colors duration-200 cursor-pointer">Privacy</a>
            <a href="#" className="text-[#555] text-sm hover:text-white transition-colors duration-200 cursor-pointer">Terms</a>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}
