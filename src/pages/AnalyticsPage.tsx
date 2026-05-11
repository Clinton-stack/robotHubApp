import { Gauge, ShieldAlert, Target, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AppNavbar } from '../components/AppNavbar'
import { PageNav } from '../components/PageNav'
import { dashboardIssues } from '../data/robotDashboard'
import { inspections } from '../data/inspections'
import { laserThresholds } from '../data/laserThresholds'
import { robots } from '../data/robots'
import { cardClassName } from '../styles/ui'
import type { InspectionRecord, Shift } from '../types/inspection'
import type { RobotOptic } from '../types/robot'

const shifts: Shift[] = ['Morning', 'Afternoon', 'Night']
const optics: RobotOptic[] = ['ALO', 'BEO']
type LaserGrouping = 'by_shift' | 'daily' | 'weekly' | 'monthly'
type LaserMode = 'ALO' | 'BEO' | 'both'

export function AnalyticsPage() {
  const { robotId } = useParams()
  const selectedRobot = robots.find((robot) => robot.id === robotId)
  const selectedInspections = selectedRobot
    ? inspections.filter((inspection) => inspection.robotId === selectedRobot.id)
    : inspections
  const selectedIssues = selectedRobot
    ? dashboardIssues.filter((issue) => issue.robotId === selectedRobot.id)
    : dashboardIssues

  const averageHealth = Math.round(
    (selectedRobot ? selectedRobot.healthScore : robots.reduce((sum, robot) => sum + robot.healthScore, 0)) /
      (selectedRobot ? 1 : robots.length),
  )
  const laserReportCount = selectedInspections.filter(isLaserReport).length
  const hardStopCount = selectedInspections.filter(isLaserStop).length
  const failedCheckCount = selectedInspections.filter(hasFailedCheck).length
  const correctedCount = selectedInspections.filter(
    (inspection) => inspection.tcpResult === 'corrected' || inspection.drahtlageResult === 'corrected',
  ).length

  return (
    <main className="min-h-svh bg-[#f7f9fc] text-slate-950">
      <AppNavbar />
      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-6">
        <PageNav
          label={selectedRobot ? 'Robot Dashboard' : 'Robot Grid'}
          to={selectedRobot ? `/robots/${selectedRobot.id}` : '/robots'}
        />

        <section className={`${cardClassName} mt-5 overflow-hidden`}>
          <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
            <div className="p-5 lg:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Analytics</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
                {selectedRobot ? `${selectedRobot.name} performance` : 'Production performance'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Time-based readings, threshold events, optic comparison, shift workload, and maintenance signals.
              </p>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-5 lg:border-l lg:border-t-0 lg:p-6">
              <p className="text-sm font-bold text-slate-500">Scope</p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {selectedRobot ? selectedRobot.assetId : `${robots.length} robots`}
              </p>
              <p className="mt-2 text-sm font-bold text-slate-500">
                {selectedRobot ? `${selectedRobot.type} / ${selectedRobot.location}` : 'All halls and optics'}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Gauge} label="Average health" value={`${averageHealth}%`} detail="Current robot status" tone="blue" />
          <MetricCard icon={TriangleAlert} label="Report events" value={String(laserReportCount)} detail="Below report threshold" tone="amber" />
          <MetricCard icon={ShieldAlert} label="Hard stops" value={String(hardStopCount)} detail="Below stop threshold" tone="red" />
          <MetricCard icon={Target} label="Corrected checks" value={String(correctedCount)} detail="Fixed during routine" tone="emerald" />
        </div>

        <div className="mt-5">
          <LaserPowerTimeChart inspections={selectedInspections} />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <OpticComparisonChart inspections={selectedInspections} />
          <RoutineQualityChart inspections={selectedInspections} />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <ShiftWorkloadChart inspections={selectedInspections} />
          <IssuePatternPanel failedCheckCount={failedCheckCount} issues={selectedIssues} />
        </div>
      </section>
    </main>
  )
}

function MetricCard({
  detail,
  icon: Icon,
  label,
  tone,
  value,
}: {
  detail: string
  icon: typeof Gauge
  label: string
  tone: 'amber' | 'blue' | 'emerald' | 'red'
  value: string
}) {
  const tones = {
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
  }

  return (
    <section className={`${cardClassName} p-5`}>
      <div className={`grid h-12 w-12 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="mt-5 text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-400">{detail}</p>
    </section>
  )
}

function LaserPowerTimeChart({ inspections }: { inspections: InspectionRecord[] }) {
  const [grouping, setGrouping] = useState<LaserGrouping>('by_shift')
  const [mode, setMode] = useState<LaserMode>('ALO')
  const chartData = getLaserRows(inspections, grouping)
  const visibleEvents = inspections.filter((inspection) => isLaserReport(inspection))
  const activeThreshold = mode === 'both' ? null : laserThresholds[mode]

  return (
    <section className={`${cardClassName} p-6`}>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Laser power over time</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Threshold-aware readings</h2>
          <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-500">
            Shift-level checks are shown by default. Daily, weekly, and monthly views smooth the trend for review.
          </p>
        </div>
        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            {(['ALO', 'BEO', 'both'] as LaserMode[]).map((item) => (
              <button
                type="button"
                className={`h-9 rounded-2xl px-3 text-xs font-black transition ${
                  mode === item ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
                onClick={() => setMode(item)}
                key={item}
              >
                {item === 'both' ? 'Both' : item}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              ['by_shift', 'By shift'],
              ['daily', 'Daily'],
              ['weekly', 'Weekly'],
              ['monthly', 'Monthly'],
            ] as const).map(([value, label]) => (
              <button
                type="button"
                className={`h-9 rounded-2xl px-3 text-xs font-black transition ${
                  grouping === value
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                onClick={() => setGrouping(value)}
                key={value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ bottom: 12, left: 8, right: 20, top: 12 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
            <YAxis domain={[2500, 4000]} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
            {mode === 'both' && (
              <>
                <ReferenceArea y1={2500} y2={3200} fill="#fee2e2" fillOpacity={0.45} />
                <ReferenceArea y1={3200} y2={3600} fill="#fef3c7" fillOpacity={0.45} />
                <ReferenceArea y1={3600} y2={4000} fill="#dcfce7" fillOpacity={0.35} />
              </>
            )}
            <Tooltip
              contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 16px 40px rgba(15,23,42,0.12)' }}
              formatter={(value, name) => [`${value}`, name]}
              labelFormatter={(_, payload) => payload[0]?.payload?.details?.join(' | ') ?? ''}
            />
            <Legend />
            {activeThreshold && (
              <>
                <ReferenceLine y={activeThreshold.reportBelow} stroke="#f59e0b" strokeDasharray="6 6" label="Report" />
                <ReferenceLine y={activeThreshold.stopBelow} stroke="#ef4444" strokeDasharray="6 6" label="Stop" />
              </>
            )}
            {(mode === 'ALO' || mode === 'both') && (
              <Line connectNulls dataKey="ALO" stroke="#1d4ed8" strokeWidth={3} dot={{ fill: '#1d4ed8', r: 5 }} />
            )}
            {(mode === 'BEO' || mode === 'both') && (
              <Line connectNulls dataKey="BEO" stroke="#7c3aed" strokeWidth={3} dot={{ fill: '#7c3aed', r: 5 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Threshold events</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{visibleEvents.length} report or stop readings</h3>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleEvents.map((event) => {
            const robot = robots.find((item) => item.id === event.robotId)
            const status = isLaserStop(event) ? 'Stop' : 'Report'
            const className = status === 'Stop' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'

            return (
              <article className="rounded-2xl bg-white p-4 shadow-sm" key={event.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{robot?.name}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {event.date} / {event.shift} / {event.optic}
                    </p>
                  </div>
                  <span className={`rounded-2xl px-3 py-1 text-xs font-black ${className}`}>{status}</span>
                </div>
                <p className="mt-3 text-lg font-black text-slate-950">{event.laserPower}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">{event.operator}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function OpticComparisonChart({ inspections }: { inspections: InspectionRecord[] }) {
  const data = optics.map((optic) => {
    const opticInspections = inspections.filter((inspection) => inspection.optic === optic)
    const failed = opticInspections.filter(hasFailedCheck).length
    const reports = opticInspections.filter(isLaserReport).length
    const corrected = opticInspections.filter(
      (inspection) => inspection.tcpResult === 'corrected' || inspection.drahtlageResult === 'corrected',
    ).length

    return { optic, corrected, failed, reports }
  })

  return (
    <section className={`${cardClassName} p-6`}>
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Optic comparison</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">ALO vs BEO events</h2>
      <div className="mt-6 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis dataKey="optic" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} />
            <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} />
            <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 16 }} />
            <Legend />
            <Bar dataKey="reports" fill="#f59e0b" name="Laser reports" radius={[8, 8, 0, 0]} />
            <Bar dataKey="failed" fill="#ef4444" name="Failed checks" radius={[8, 8, 0, 0]} />
            <Bar dataKey="corrected" fill="#2563eb" name="Corrected" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function RoutineQualityChart({ inspections }: { inspections: InspectionRecord[] }) {
  const data = [
    { name: 'TCP', ok: countCheck(inspections, 'tcpResult', 'ok'), corrected: countCheck(inspections, 'tcpResult', 'corrected'), fail: countCheck(inspections, 'tcpResult', 'not_ok') },
    { name: 'Drahtlage', ok: countCheck(inspections, 'drahtlageResult', 'ok'), corrected: countCheck(inspections, 'drahtlageResult', 'corrected'), fail: countCheck(inspections, 'drahtlageResult', 'not_ok') },
    { name: 'Schuss', ok: inspections.filter((item) => item.schussOk).length, corrected: 0, fail: inspections.filter((item) => !item.schussOk).length },
    { name: 'Cooling', ok: inspections.filter((item) => item.coolingOk).length, corrected: 0, fail: inspections.filter((item) => !item.coolingOk).length },
    { name: 'Gas', ok: inspections.filter((item) => item.gasResult === 'ok').length, corrected: inspections.filter((item) => item.gasResult === 'not_available').length, fail: inspections.filter((item) => item.gasResult === 'not_ok').length },
  ]

  return (
    <section className={`${cardClassName} p-6`}>
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Routine check quality</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">OK, corrected, failed</h2>
      <div className="mt-6 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 22 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis allowDecimals={false} type="number" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} />
            <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 16 }} />
            <Legend />
            <Bar dataKey="ok" stackId="quality" fill="#10b981" name="OK" radius={[0, 8, 8, 0]} />
            <Bar dataKey="corrected" stackId="quality" fill="#2563eb" name="Corrected / N/A" radius={[0, 8, 8, 0]} />
            <Bar dataKey="fail" stackId="quality" fill="#ef4444" name="Failed" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function ShiftWorkloadChart({ inspections }: { inspections: InspectionRecord[] }) {
  const data = shifts.map((shift) => ({
    failed: inspections.filter((inspection) => inspection.shift === shift && hasFailedCheck(inspection)).length,
    name: shift,
    ok: inspections.filter((inspection) => inspection.shift === shift && !hasFailedCheck(inspection)).length,
  }))
  const pieData = data.map((item) => ({ name: item.name, value: item.failed + item.ok }))
  const colors = ['#2563eb', '#0f172a', '#f59e0b']

  return (
    <section className={`${cardClassName} p-6`}>
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Shift comparison</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Workload and failures</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_220px]">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 16 }} />
              <Legend />
              <Bar dataKey="ok" fill="#10b981" name="OK checks" radius={[8, 8, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" name="Failed checks" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={58} outerRadius={86} paddingAngle={3}>
                {pieData.map((entry, index) => (
                  <Cell fill={colors[index % colors.length]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}

function IssuePatternPanel({
  failedCheckCount,
  issues,
}: {
  failedCheckCount: number
  issues: typeof dashboardIssues
}) {
  return (
    <section className={`${cardClassName} p-6`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Issue patterns</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Attention areas</h2>
        </div>
        <span className="rounded-2xl bg-red-50 px-3 py-1 text-sm font-black text-red-700">
          {failedCheckCount} failed checks
        </span>
      </div>

      <div className="mt-6 grid gap-3">
        {issues.length === 0 ? (
          <p className="rounded-3xl bg-emerald-50 p-5 text-sm font-bold text-emerald-700">
            No active issue patterns detected.
          </p>
        ) : (
          issues.map((issue) => (
            <article className="rounded-3xl bg-slate-50 p-5" key={issue.id}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-black text-slate-950">{issue.title}</h3>
                <span className="rounded-2xl bg-white px-3 py-1 text-xs font-black text-slate-500">{issue.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{issue.detail}</p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

function isLaserReport(inspection: InspectionRecord) {
  return inspection.laserPower < laserThresholds[inspection.optic].reportBelow
}

function isLaserStop(inspection: InspectionRecord) {
  return inspection.laserPower < laserThresholds[inspection.optic].stopBelow
}

function hasFailedCheck(inspection: InspectionRecord) {
  return (
    inspection.tcpResult === 'not_ok' ||
    inspection.drahtlageResult === 'not_ok' ||
    !inspection.schussOk ||
    !inspection.coolingOk ||
    inspection.gasResult === 'not_ok'
  )
}

function countCheck(
  inspections: InspectionRecord[],
  key: 'drahtlageResult' | 'tcpResult',
  value: InspectionRecord['drahtlageResult'],
) {
  return inspections.filter((inspection) => inspection[key] === value).length
}

function getLaserRows(inspections: InspectionRecord[], grouping: LaserGrouping) {
  if (grouping === 'by_shift') {
    return getGroupedLaserRows(inspections, (inspection) => ({
      key: `${inspection.date}-${inspection.shift}`,
      label: `${inspection.date.slice(5)} ${formatShiftShort(inspection.shift)}`,
    }))
  }

  if (grouping === 'weekly') {
    return getGroupedLaserRows(inspections, (inspection) => ({
      key: getWeekKey(inspection.date),
      label: getWeekLabel(inspection.date),
    }))
  }

  if (grouping === 'monthly') {
    return getGroupedLaserRows(inspections, (inspection) => ({
      key: inspection.date.slice(0, 7),
      label: formatMonthLabel(inspection.date),
    }))
  }

  return getGroupedLaserRows(inspections, (inspection) => ({
    key: inspection.date,
    label: inspection.date.slice(5),
  }))
}

function getGroupedLaserRows(
  inspections: InspectionRecord[],
  getGroup: (inspection: InspectionRecord) => { key: string; label: string },
) {
  const rows = inspections.reduce<
    Map<string, { aloValues: number[]; beoValues: number[]; details: string[]; label: string }>
  >((map, inspection) => {
    const robot = robots.find((item) => item.id === inspection.robotId)
    const group = getGroup(inspection)
    const row = map.get(group.key) ?? {
      aloValues: [],
      beoValues: [],
      details: [],
      label: group.label,
    }

    if (inspection.optic === 'ALO') {
      row.aloValues.push(inspection.laserPower)
    } else {
      row.beoValues.push(inspection.laserPower)
    }
    row.details.push(`${robot?.name ?? inspection.robotId} / ${inspection.optic} / ${inspection.shift}`)
    map.set(group.key, row)

    return map
  }, new Map())

  return Array.from(rows.values()).map((row) => ({
    ALO: average(row.aloValues),
    BEO: average(row.beoValues),
    details: row.details,
    label: row.label,
  }))
}

function average(values: number[]) {
  if (values.length === 0) {
    return null
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function formatShiftShort(shift: Shift) {
  const labels: Record<Shift, string> = {
    Afternoon: 'A',
    Morning: 'M',
    Night: 'N',
  }

  return labels[shift]
}

function getWeekKey(date: string) {
  const { week, year } = getIsoWeek(date)

  return `${year}-W${String(week).padStart(2, '0')}`
}

function getWeekLabel(date: string) {
  const { week, year } = getIsoWeek(date)

  return `W${week} ${year}`
}

function getIsoWeek(date: string) {
  const value = new Date(`${date}T00:00:00`)
  value.setHours(0, 0, 0, 0)
  value.setDate(value.getDate() + 3 - ((value.getDay() + 6) % 7))

  const weekOne = new Date(value.getFullYear(), 0, 4)
  const week = 1 + Math.round(((value.getTime() - weekOne.getTime()) / 86400000 - 3 + ((weekOne.getDay() + 6) % 7)) / 7)

  return {
    week,
    year: value.getFullYear(),
  }
}

function formatMonthLabel(date: string) {
  const value = new Date(`${date}T00:00:00`)

  return value.toLocaleDateString('en', { month: 'short', year: '2-digit' })
}
