import { Crosshair, ShieldAlert, Zap } from 'lucide-react'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { laserThresholds } from '../data/laserThresholds'
import { useLanguage } from '../i18n/LanguageProvider'
import { cardClassName } from '../styles/ui'
import type { TranslationKey } from '../i18n/translations'
import type { InspectionRecord, Shift } from '../types/inspection'
import type { Robot, RobotOptic } from '../types/robot'

type LaserGrouping = 'by_shift' | 'daily' | 'weekly' | 'monthly'
type LaserMode = RobotOptic | 'both'

type RobotDashboardChartsProps = {
  inspections: InspectionRecord[]
  robot: Robot
}

export function RobotDashboardCharts({ inspections, robot }: RobotDashboardChartsProps) {
  const failedChecks = inspections.filter(hasFailedCheck)
  const correctedChecks = inspections.filter(hasCorrectedCheck)
  const laserEvents = inspections.filter(isLaserReport)

  return (
    <div className="grid gap-5">
      <LaserPowerPanel inspections={inspections} robot={robot} />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <RoutineQualityPanel correctedCount={correctedChecks.length} failedCount={failedChecks.length} inspections={inspections} />
        <ThresholdEventPanel events={laserEvents} />
      </div>
    </div>
  )
}

function LaserPowerPanel({ inspections, robot }: { inspections: InspectionRecord[]; robot: Robot }) {
  const { t } = useLanguage()
  const [mode, setMode] = useState<LaserMode>(robot.optics[0] ?? 'ALO')
  const [grouping, setGrouping] = useState<LaserGrouping>('by_shift')
  const chartData = getLaserRows(inspections, grouping)
  const latestInspection = [...inspections].reverse().find((inspection) => mode === 'both' || inspection.optic === mode)
  const activeThreshold = mode === 'both' ? null : laserThresholds[mode]
  const status = latestInspection ? getLaserStatus(latestInspection) : 'No data'
  const statusClassName = getStatusClassName(status)

  return (
    <section className={`${cardClassName} p-5`}>
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <Zap className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{t('dashboard.laserPower')}</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">{t('dashboard.opticTrend')}</h2>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm font-bold leading-6 text-slate-500">
            {t('dashboard.laserTrendHelp')}
          </p>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            {[...robot.optics, ...(robot.optics.length > 1 ? (['both'] as const) : [])].map((optic) => (
              <button
                className={`h-9 rounded-2xl px-3 text-xs font-black transition ${
                  mode === optic ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
                key={optic}
                onClick={() => setMode(optic)}
                type="button"
              >
                {optic === 'both' ? t('dashboard.both') : optic}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ['by_shift', t('dashboard.byShift')],
              ['daily', t('dashboard.daily')],
              ['weekly', t('dashboard.weekly')],
              ['monthly', t('dashboard.monthly')],
            ].map(([value, label]) => (
              <button
                className={`h-9 rounded-2xl px-3 text-xs font-black transition ${
                  grouping === value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                key={value}
                onClick={() => setGrouping(value as LaserGrouping)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_240px]">
        <div className="h-[300px] min-w-0">
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
              {activeThreshold && (
                <>
                  <ReferenceLine y={activeThreshold.reportBelow} stroke="#f59e0b" strokeDasharray="6 6" label={t('dashboard.report')} />
                  <ReferenceLine y={activeThreshold.stopBelow} stroke="#ef4444" strokeDasharray="6 6" label={t('dashboard.stop')} />
                </>
              )}
              <Tooltip
                contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 16px 40px rgba(15,23,42,0.12)' }}
                formatter={(value, name) => [`${value}`, name]}
                labelFormatter={(_, payload) => payload[0]?.payload?.details?.join(' | ') ?? ''}
              />
              <Legend />
              {(mode === 'ALO' || mode === 'both') && (
                <Line connectNulls dataKey="ALO" dot={{ fill: '#1d4ed8', r: 5 }} stroke="#1d4ed8" strokeWidth={3} />
              )}
              {(mode === 'BEO' || mode === 'both') && (
                <Line connectNulls dataKey="BEO" dot={{ fill: '#7c3aed', r: 5 }} stroke="#7c3aed" strokeWidth={3} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <aside className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-500">{t('dashboard.latestReading')}</p>
          <p className="mt-1 text-3xl font-black text-slate-950">{latestInspection?.laserPower ?? '-'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-2xl px-3 py-1 text-xs font-black ${statusClassName}`}>{t(getStatusLabelKey(status))}</span>
            {latestInspection && (
              <span className="rounded-2xl bg-white px-3 py-1 text-xs font-black text-slate-500">
                {latestInspection.date} / {latestInspection.shift}
              </span>
            )}
          </div>

          <div className="mt-5 grid gap-3">
            {robot.optics.map((optic) => {
              const threshold = laserThresholds[optic]

              return (
                <div className="rounded-xl bg-white p-3 shadow-sm" key={optic}>
                  <p className="font-black text-slate-950">{optic}</p>
                  <p className="mt-1 text-xs font-bold text-amber-700">{t('dashboard.reportBelow')} {threshold.reportBelow}</p>
                  <p className="mt-1 text-xs font-bold text-red-700">{t('dashboard.stopBelow')} {threshold.stopBelow}</p>
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </section>
  )
}

function RoutineQualityPanel({
  correctedCount,
  failedCount,
  inspections,
}: {
  correctedCount: number
  failedCount: number
  inspections: InspectionRecord[]
}) {
  const { t } = useLanguage()
  const data = [
    {
      corrected: inspections.filter((inspection) => inspection.tcpResult === 'corrected').length,
      failed: inspections.filter((inspection) => inspection.tcpResult === 'not_ok').length,
      name: 'TCP',
      ok: inspections.filter((inspection) => inspection.tcpResult === 'ok').length,
    },
    {
      corrected: inspections.filter((inspection) => inspection.drahtlageResult === 'corrected').length,
      failed: inspections.filter((inspection) => inspection.drahtlageResult === 'not_ok').length,
      name: 'Drahtlage',
      ok: inspections.filter((inspection) => inspection.drahtlageResult === 'ok').length,
    },
    {
      corrected: 0,
      failed: inspections.filter((inspection) => !inspection.schussOk).length,
      name: 'Schuss',
      ok: inspections.filter((inspection) => inspection.schussOk).length,
    },
    {
      corrected: inspections.filter((inspection) => inspection.gasResult === 'not_available').length,
      failed: inspections.filter((inspection) => inspection.gasResult === 'not_ok').length,
      name: 'Gas',
      ok: inspections.filter((inspection) => inspection.gasResult === 'ok').length,
    },
  ]

  return (
    <section className={`${cardClassName} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{t('dashboard.routineQuality')}</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{t('dashboard.qualitySummary')}</h2>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Crosshair className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MetricTile label={t('dashboard.correctedDuringRoutine')} tone="blue" value={correctedCount} />
        <MetricTile label={t('dashboard.failedNotOk')} tone="red" value={failedCount} />
      </div>

      <div className="mt-5 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 22 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis allowDecimals={false} type="number" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} />
            <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 16 }} />
            <Legend />
            <Bar dataKey="ok" fill="#10b981" name="OK" radius={[0, 8, 8, 0]} />
            <Bar dataKey="corrected" fill="#2563eb" name={t('dashboard.correctedNa')} radius={[0, 8, 8, 0]} />
            <Bar dataKey="failed" fill="#ef4444" name={t('dashboard.failed')} radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function ThresholdEventPanel({ events }: { events: InspectionRecord[] }) {
  const { t } = useLanguage()
  const latestEvents = events.slice(-5).reverse()

  return (
    <section className={`${cardClassName} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{t('dashboard.thresholdEvents')}</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{t('dashboard.reportStopReadings')}</h2>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-700">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MetricTile label={t('dashboard.reportEvents')} tone="amber" value={events.length} />
        <MetricTile label={t('dashboard.hardStops')} tone="red" value={events.filter(isLaserStop).length} />
      </div>

      <div className="mt-5 grid gap-3">
        {latestEvents.length === 0 ? (
          <p className="rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
            {t('dashboard.noThresholdEvents')}
          </p>
        ) : (
          latestEvents.map((event) => {
            const status = isLaserStop(event) ? 'Stop' : 'Report'

            return (
              <article className="rounded-xl bg-slate-50 p-4" key={event.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-slate-950">
                      {event.optic} / {event.laserPower}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {event.date} / {event.shift} / {event.operator}
                    </p>
                  </div>
                  <span className={`rounded-2xl px-3 py-1 text-xs font-black ${getStatusClassName(status)}`}>
                    {t(getStatusLabelKey(status))}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{event.comments}</p>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

function MetricTile({
  label,
  tone,
  value,
}: {
  label: string
  tone: 'amber' | 'blue' | 'red'
  value: number
}) {
  const tones = {
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
  }

  return (
    <div className={`rounded-xl p-3 ${tones[tone]}`}>
      <p className="text-xl font-black">{value}</p>
      <p className="mt-1 text-xs font-black">{label}</p>
    </div>
  )
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
    row.details.push(`${inspection.optic} / ${inspection.shift}`)
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

function hasCorrectedCheck(inspection: InspectionRecord) {
  return inspection.tcpResult === 'corrected' || inspection.drahtlageResult === 'corrected'
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

function isLaserReport(inspection: InspectionRecord) {
  return inspection.laserPower < laserThresholds[inspection.optic].reportBelow
}

function isLaserStop(inspection: InspectionRecord) {
  return inspection.laserPower < laserThresholds[inspection.optic].stopBelow
}

function getLaserStatus(inspection: InspectionRecord) {
  if (isLaserStop(inspection)) {
    return 'Stop'
  }

  if (isLaserReport(inspection)) {
    return 'Report'
  }

  return 'Stable'
}

function getStatusClassName(status: string) {
  if (status === 'Stop') {
    return 'bg-red-50 text-red-700'
  }

  if (status === 'Report') {
    return 'bg-amber-50 text-amber-700'
  }

  if (status === 'Stable') {
    return 'bg-emerald-50 text-emerald-700'
  }

  return 'bg-slate-100 text-slate-600'
}

function getStatusLabelKey(status: string): TranslationKey {
  if (status === 'Stop') {
    return 'dashboard.stop'
  }

  if (status === 'Report') {
    return 'dashboard.report'
  }

  if (status === 'Stable') {
    return 'dashboard.stable'
  }

  return 'dashboard.noData'
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
