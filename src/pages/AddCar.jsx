import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const pageTransition = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const fieldVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const fields = [
  { id: 'make', label: 'Make', placeholder: 'e.g. BMW, Porsche, Toyota…', type: 'text' },
  { id: 'model', label: 'Model', placeholder: 'e.g. M3 Competition, 911 GT3…', type: 'text' },
  { id: 'year', label: 'Year', placeholder: 'e.g. 2024', type: 'number' },
  { id: 'color', label: 'Color', placeholder: 'e.g. Isle of Man Blue', type: 'text' },
  { id: 'horsepower', label: 'Horsepower', placeholder: 'e.g. 510', type: 'number' },
  { id: 'engine', label: 'Engine Type', placeholder: 'e.g. S58 3.0L Twin-Turbo I6', type: 'text' },
]

export default function AddCar() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    make: '', model: '', year: '', color: '', horsepower: '', engine: '', notes: '',
  })
  const [dragOver, setDragOver] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => navigate('/dashboard'), 1200)
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
            <Link to="/dashboard" className="text-sm font-medium text-[#888] hover:text-white transition-colors duration-200">
              Dashboard
            </Link>
            <Link to="/add-car" className="text-sm font-medium text-white">
              Add Car
            </Link>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#E63946] flex items-center justify-center cursor-pointer">
            <span className="text-white font-bold text-sm">R</span>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-16 px-6 max-w-3xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black text-white mb-2">Add a Car</h1>
          <p className="text-[#888]">Add a new vehicle to your garage collection.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo upload */}
          <motion.div
            custom={0}
            variants={fieldVariant}
            initial="hidden"
            animate="visible"
          >
            <label className="block text-sm font-semibold text-[#ccc] mb-2">
              Photos
            </label>
            <motion.div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
              animate={{ borderColor: dragOver ? '#E63946' : '#2A2A2A' }}
              className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors duration-200 bg-[#1A1A1A] hover:border-[#E63946]/50"
              onClick={() => {}}
            >
              <div className="text-[#555] mb-3 flex justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="text-white font-semibold text-sm mb-1">
                {dragOver ? 'Drop to upload' : 'Drag & drop photos here'}
              </p>
              <p className="text-[#555] text-xs">or click to browse · PNG, JPG, WEBP up to 10MB</p>
            </motion.div>
          </motion.div>

          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((field, i) => (
              <motion.div
                key={field.id}
                custom={i + 1}
                variants={fieldVariant}
                initial="hidden"
                animate="visible"
              >
                <label htmlFor={field.id} className="block text-sm font-semibold text-[#ccc] mb-2">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.id]}
                  onChange={handleChange}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white placeholder-[#444] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 transition-colors duration-200"
                />
              </motion.div>
            ))}
          </div>

          {/* Notes */}
          <motion.div
            custom={fields.length + 1}
            variants={fieldVariant}
            initial="hidden"
            animate="visible"
          >
            <label htmlFor="notes" className="block text-sm font-semibold text-[#ccc] mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              placeholder="Add notes about modifications, condition, history…"
              value={form.notes}
              onChange={handleChange}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white placeholder-[#444] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 transition-colors duration-200 resize-none"
            />
          </motion.div>

          {/* Submit */}
          <motion.div
            custom={fields.length + 2}
            variants={fieldVariant}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              type="submit"
              disabled={submitted}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#E63946] text-white font-bold py-4 rounded-xl text-base hover:bg-[#c8303c] transition-colors duration-200 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitted ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Adding to garage…
                </>
              ) : (
                'Add to Garage'
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}
