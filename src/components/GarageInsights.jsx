import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

const ACCENT  = '#E63946'
const BLUE    = '#4A90D9'
const PURPLE  = '#9B72CF'

const STATUS_COLOR = {
  Active:       '#4CAF7D',
  'In Service': '#C9A84C',
  Unknown:      '#666666',
}

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  const title = label ?? p.name
  let val = p.value?.toLocaleString()
  if (p.dataKey === 'hp')    val += ' hp'
  if (p.dataKey === 'count') val += ` car${p.value !== 1 ? 's' : ''}`
  if (p.dataKey === 'value') val += ` car${p.value !== 1 ? 's' : ''}`
  return (
    <div
      style={{
        background: '#141414',
        border: '1px solid #2A2A2A',
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {title && (
        <p style={{ color: '#888', fontSize: 11, marginBottom: 5, fontWeight: 500 }}>{title}</p>
      )}
      <p style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{val}</p>
    </div>
  )
}

function ChartCard({ title, children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 ${className}`}
    >
      <p className="text-[#888] text-xs font-semibold uppercase tracking-widest mb-5">
        {title}
      </p>
      {children}
    </motion.div>
  )
}

const tickX  = { fill: '#555', fontSize: 11 }
const tickY  = { fill: '#888', fontSize: 11 }
const cursor = { fill: 'rgba(255,255,255,0.03)' }

export default function GarageInsights({ cars }) {
  // 1. Horsepower — sorted highest → lowest, cars with hp only
  const hpData = useMemo(() => (
    cars
      .filter(c => c.horsepower > 0)
      .map(c => ({ name: `${c.make} ${c.model}`, hp: c.horsepower }))
      .sort((a, b) => b.hp - a.hp)
  ), [cars])

  // 2. Cars grouped by year
  const yearData = useMemo(() => {
    const counts = {}
    cars.forEach(c => { if (c.year) counts[c.year] = (counts[c.year] || 0) + 1 })
    return Object.entries(counts)
      .map(([y, count]) => ({ year: +y, count }))
      .sort((a, b) => a.year - b.year)
  }, [cars])

  // 3. Cars grouped by status
  const statusData = useMemo(() => {
    const counts = {}
    cars.forEach(c => {
      const s = c.status || 'Unknown'
      counts[s] = (counts[s] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [cars])

  // 4. Cars grouped by make
  const makeData = useMemo(() => {
    const counts = {}
    cars.forEach(c => { if (c.make) counts[c.make] = (counts[c.make] || 0) + 1 })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [cars])

  // HP chart grows taller with more cars so bars don't get squished
  const hpChartHeight = Math.max(220, hpData.length * 50)

  return (
    <div className="mb-14">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-black text-white">Garage Insights</h2>
        <p className="text-[#555] text-sm mt-1">Visual breakdown of your collection.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ── 1. Horsepower by car (horizontal bar, full width) ── */}
        <ChartCard title="Horsepower by Car" delay={0.14} className="md:col-span-2">
          {hpData.length === 0 ? (
            <p className="text-[#555] text-sm py-6 text-center">
              Add horsepower to your cars to see this chart.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={hpChartHeight}>
              <BarChart
                data={hpData}
                layout="vertical"
                margin={{ top: 2, right: 36, bottom: 2, left: 0 }}
              >
                <XAxis
                  type="number"
                  dataKey="hp"
                  tick={tickX}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={tickY}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                  tickFormatter={v => v.length > 22 ? v.slice(0, 21) + '…' : v}
                />
                <Tooltip content={<DarkTooltip />} cursor={cursor} />
                <Bar
                  dataKey="hp"
                  fill={ACCENT}
                  radius={[0, 6, 6, 0]}
                  animationDuration={750}
                  label={{
                    position: 'right',
                    fill: '#E63946',
                    fontSize: 11,
                    fontWeight: 700,
                    formatter: v => `${v}`,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* ── 2. Cars by year ── */}
        <ChartCard title="Cars by Year" delay={0.2}>
          {yearData.length === 0 ? (
            <p className="text-[#555] text-sm py-6 text-center">No year data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={yearData}
                margin={{ top: 2, right: 10, bottom: 2, left: -10 }}
              >
                <XAxis
                  dataKey="year"
                  tick={tickY}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={tickX}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<DarkTooltip />} cursor={cursor} />
                <Bar
                  dataKey="count"
                  fill={BLUE}
                  radius={[6, 6, 0, 0]}
                  animationDuration={750}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* ── 3. Cars by status (donut) ── */}
        <ChartCard title="Cars by Status" delay={0.26}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={statusData.length > 1 ? 4 : 0}
                animationDuration={750}
                strokeWidth={0}
              >
                {statusData.map(entry => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLOR[entry.name] ?? PURPLE}
                  />
                ))}
              </Pie>
              <Tooltip content={<DarkTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: STATUS_COLOR[d.name] ?? PURPLE }}
                />
                <span className="text-[#888] text-xs">{d.name}</span>
                <span className="text-white text-xs font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* ── 4. Cars by make (full width) ── */}
        <ChartCard title="Cars by Make" delay={0.32} className="md:col-span-2">
          {makeData.length === 0 ? (
            <p className="text-[#555] text-sm py-6 text-center">No make data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={makeData}
                margin={{ top: 2, right: 10, bottom: 2, left: -10 }}
              >
                <XAxis
                  dataKey="name"
                  tick={tickY}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={tickX}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<DarkTooltip />} cursor={cursor} />
                <Bar
                  dataKey="count"
                  fill={PURPLE}
                  radius={[6, 6, 0, 0]}
                  animationDuration={750}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

      </div>
    </div>
  )
}
