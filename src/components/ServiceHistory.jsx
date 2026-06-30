import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const SERVICE_TYPES = [
  'Oil Change', 'Tire Rotation', 'Brake Service', 'Air Filter',
  'Cabin Air Filter', 'Transmission Service', 'Coolant Flush',
  'Wheel Alignment', 'Battery Replacement', 'Spark Plugs',
  'Fuel Filter', 'Inspection', 'Detailing', 'Fluid Top-Up', 'Other',
]

const todayStr = () => new Date().toISOString().split('T')[0]
const emptyForm = () => ({
  service_type: '',
  service_date: todayStr(),
  next_due_date: '',
  cost: '',
  mileage: '',
  notes: '',
})

function parseLocalDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(str) {
  if (!str) return null
  return parseLocalDate(str).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function dueDateStatus(str) {
  if (!str) return null
  const due = parseLocalDate(str)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (due < now) return 'overdue'
  const diff = (due - now) / (1000 * 60 * 60 * 24)
  if (diff <= 30) return 'soon'
  return 'ok'
}

const inputCls =
  'w-full bg-[#111111] border border-[#2A2A2A] text-white placeholder-[#444] rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 transition-colors duration-200'
const labelCls = 'block text-[#888] text-xs font-semibold uppercase tracking-wider mb-1.5'

// ── Spinner ────────────────────────────────────────────────────────────────
function Spinner({ size = 'sm' }) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-6 h-6'
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className={`${sz} border-2 border-white/30 border-t-white rounded-full`}
    />
  )
}

// ── Add / Edit form ────────────────────────────────────────────────────────
function RecordForm({ form, setForm, onSubmit, onCancel, mode, saving }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 mb-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-black text-base">
          {mode === 'edit' ? 'Edit Service Record' : 'Add Service Record'}
        </h3>
        <button
          onClick={onCancel}
          className="text-[#555] hover:text-white transition-colors duration-150 cursor-pointer p-1"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Service type */}
          <div>
            <label className={labelCls}>Service Type *</label>
            <input
              list="svc-types"
              required
              value={form.service_type}
              onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))}
              placeholder="e.g. Oil Change"
              className={inputCls}
            />
            <datalist id="svc-types">
              {SERVICE_TYPES.map(t => <option key={t} value={t} />)}
            </datalist>
          </div>

          {/* Service date */}
          <div>
            <label className={labelCls}>Service Date *</label>
            <input
              type="date"
              required
              value={form.service_date}
              onChange={e => setForm(f => ({ ...f, service_date: e.target.value }))}
              className={inputCls}
            />
          </div>

          {/* Next due */}
          <div>
            <label className={labelCls}>Next Due Date <span className="normal-case font-normal text-[#555]">(optional)</span></label>
            <input
              type="date"
              value={form.next_due_date}
              onChange={e => setForm(f => ({ ...f, next_due_date: e.target.value }))}
              className={inputCls}
            />
          </div>

          {/* Cost */}
          <div>
            <label className={labelCls}>Cost ($) <span className="normal-case font-normal text-[#555]">(optional)</span></label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.cost}
              onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
              placeholder="0.00"
              className={inputCls}
            />
          </div>

          {/* Mileage */}
          <div>
            <label className={labelCls}>Mileage <span className="normal-case font-normal text-[#555]">(optional)</span></label>
            <input
              type="number"
              min="0"
              value={form.mileage}
              onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
              placeholder="e.g. 45000"
              className={inputCls}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-5">
          <label className={labelCls}>Notes <span className="normal-case font-normal text-[#555]">(optional)</span></label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Any additional details…"
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-[#222] border border-[#333] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#2A2A2A] transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#E63946] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#c8303c] transition-colors duration-200 cursor-pointer disabled:opacity-60"
          >
            {saving ? <><Spinner /> Saving…</> : mode === 'edit' ? 'Save Changes' : 'Save Record'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ServiceHistory({ car, user }) {
  const [records, setRecords] = useState([])
  const [recordsLoading, setRecordsLoading] = useState(true)

  const [showForm, setShowForm]       = useState(false)
  const [formMode, setFormMode]       = useState('add')
  const [editingId, setEditingId]     = useState(null)
  const [form, setForm]               = useState(emptyForm())
  const [saving, setSaving]           = useState(false)

  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [deletingId, setDeletingId]           = useState(null)

  // Fetch records whenever the car changes
  useEffect(() => {
    setRecordsLoading(true)
    supabase
      .from('maintenance')
      .select('*')
      .eq('car_id', car.id)
      .order('service_date', { ascending: false })
      .then(({ data }) => {
        setRecords(data ?? [])
        setRecordsLoading(false)
      })
  }, [car.id])

  // Keep records sorted newest-first by service_date after any mutation
  function sortedInsert(prev, record) {
    return [...prev.filter(r => r.id !== record.id), record]
      .sort((a, b) => b.service_date.localeCompare(a.service_date))
  }

  function openAdd() {
    setFormMode('add')
    setEditingId(null)
    setForm(emptyForm())
    setShowForm(true)
    setConfirmDeleteId(null)
  }

  function openEdit(record) {
    setFormMode('edit')
    setEditingId(record.id)
    setForm({
      service_type:  record.service_type  ?? '',
      service_date:  record.service_date  ?? '',
      next_due_date: record.next_due_date ?? '',
      cost:          record.cost != null ? String(record.cost) : '',
      mileage:       record.mileage != null ? String(record.mileage) : '',
      notes:         record.notes ?? '',
    })
    setShowForm(true)
    setConfirmDeleteId(null)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm())
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      service_type:  form.service_type.trim(),
      service_date:  form.service_date,
      next_due_date: form.next_due_date || null,
      cost:          form.cost    ? parseFloat(form.cost)   : null,
      mileage:       form.mileage ? parseInt(form.mileage)  : null,
      notes:         form.notes.trim() || null,
    }

    if (formMode === 'add') {
      const { data, error } = await supabase
        .from('maintenance')
        .insert({ ...payload, car_id: car.id, user_id: user.id })
        .select()
        .single()
      if (!error && data) {
        setRecords(prev => sortedInsert(prev, data))
        closeForm()
      }
    } else {
      const { data, error } = await supabase
        .from('maintenance')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single()
      if (!error && data) {
        setRecords(prev => sortedInsert(prev, data))
        closeForm()
      }
    }
    setSaving(false)
  }

  async function handleDelete(recordId) {
    setDeletingId(recordId)
    const { error } = await supabase.from('maintenance').delete().eq('id', recordId)
    if (!error) {
      setRecords(prev => prev.filter(r => r.id !== recordId))
      setConfirmDeleteId(null)
    }
    setDeletingId(null)
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35 }}
      className="mt-12"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-white">Service History</h2>
          {!recordsLoading && records.length > 0 && (
            <p className="text-[#555] text-xs mt-0.5">
              {records.length} record{records.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={showForm && formMode === 'add' ? closeForm : openAdd}
          className="flex items-center gap-2 bg-[#E63946] text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-[#c8303c] transition-colors duration-200 cursor-pointer"
        >
          {showForm && formMode === 'add' ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Record
            </>
          )}
        </button>
      </div>

      {/* Add / Edit form */}
      <AnimatePresence>
        {showForm && (
          <RecordForm
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            mode={formMode}
            saving={saving}
          />
        )}
      </AnimatePresence>

      {/* Loading */}
      {recordsLoading && (
        <div className="flex justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 border-2 border-[#333] border-t-[#E63946] rounded-full"
          />
        </div>
      )}

      {/* Empty state */}
      {!recordsLoading && records.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-14 text-center bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl"
        >
          <div className="w-14 h-14 rounded-full bg-[#111] border border-[#2A2A2A] flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#444]">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <p className="text-white font-bold text-sm mb-1">No service history yet.</p>
          <p className="text-[#555] text-xs mb-5">Add the first service record for this car.</p>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#E63946] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#c8303c] transition-colors duration-200 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add First Record
          </button>
        </motion.div>
      )}

      {/* Records list */}
      {!recordsLoading && (
        <AnimatePresence mode="popLayout">
          {records.map(record => {
            const dueStatus    = dueDateStatus(record.next_due_date)
            const isConfirming = confirmDeleteId === record.id
            const isDeleting   = deletingId === record.id

            return (
              <motion.div
                key={record.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 mb-3 last:mb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Type + metadata row */}
                    <div className="flex items-center gap-2.5 flex-wrap mb-2">
                      <span className="bg-[#E63946]/15 text-[#E63946] text-xs font-bold px-2.5 py-1 rounded-full">
                        {record.service_type}
                      </span>
                      <span className="text-[#888] text-xs">{formatDate(record.service_date)}</span>
                      {record.mileage != null && (
                        <>
                          <span className="text-[#333] select-none">·</span>
                          <span className="text-[#888] text-xs">{record.mileage.toLocaleString()} mi</span>
                        </>
                      )}
                      {record.cost != null && (
                        <>
                          <span className="text-[#333] select-none">·</span>
                          <span className="text-[#888] text-xs">${parseFloat(record.cost).toFixed(2)}</span>
                        </>
                      )}
                    </div>

                    {/* Next due */}
                    {record.next_due_date && (
                      <div className="flex items-center gap-2 mb-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[#555] flex-shrink-0">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span className="text-[#555] text-xs">Next due:</span>
                        <span className={`text-xs font-semibold ${
                          dueStatus === 'overdue' ? 'text-[#E63946]' :
                          dueStatus === 'soon'    ? 'text-amber-400'  :
                          'text-[#aaa]'
                        }`}>
                          {formatDate(record.next_due_date)}
                        </span>
                        {dueStatus === 'overdue' && (
                          <span className="bg-[#E63946]/15 text-[#E63946] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Overdue
                          </span>
                        )}
                        {dueStatus === 'soon' && (
                          <span className="bg-amber-500/15 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Due soon
                          </span>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {record.notes && (
                      <p className="text-[#666] text-xs leading-relaxed mt-1">{record.notes}</p>
                    )}
                  </div>

                  {/* Action buttons */}
                  {!isConfirming ? (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit(record)}
                        title="Edit"
                        className="text-[#555] hover:text-white p-1.5 rounded-lg hover:bg-[#222] transition-all duration-150 cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(record.id)}
                        title="Delete"
                        className="text-[#555] hover:text-[#E63946] p-1.5 rounded-lg hover:bg-[#E63946]/10 transition-all duration-150 cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 flex-shrink-0"
                    >
                      <span className="text-[#888] text-xs">Delete?</span>
                      <button
                        onClick={() => handleDelete(record.id)}
                        disabled={isDeleting}
                        className="flex items-center gap-1.5 bg-[#E63946] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#c8303c] transition-colors duration-200 cursor-pointer disabled:opacity-60"
                      >
                        {isDeleting ? <Spinner /> : 'Yes'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={isDeleting}
                        className="bg-[#222] border border-[#333] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#2A2A2A] transition-colors duration-200 cursor-pointer disabled:opacity-60"
                      >
                        No
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}
    </motion.section>
  )
}
