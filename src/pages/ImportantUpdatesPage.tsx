import { BellRing, CheckCircle2, OctagonAlert, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppNavbar } from '../components/AppNavbar'
import { CreateImportantUpdateForm } from '../components/CreateImportantUpdateForm'
import { ImportantUpdateCard } from '../components/ImportantUpdateCard'
import { PageNav } from '../components/PageNav'
import { robots } from '../data/robots'
import { cardClassName, inputClassName } from '../styles/ui'
import type { UpdateSeverity } from '../types/update'
import { useImportantUpdates } from '../updates/ImportantUpdatesProvider'
import { useUpdateConfirmations } from '../updates/UpdateConfirmationsProvider'

type SeverityFilter = 'all' | UpdateSeverity

export function ImportantUpdatesPage() {
  const { robotId } = useParams()
  const { updates } = useImportantUpdates()
  const { getUnreadCount } = useUpdateConfirmations()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')
  const selectedRobot = robots.find((robot) => robot.id === robotId)
  const scopedUpdates = selectedRobot
    ? updates.filter((update) => update.robotIds.includes(selectedRobot.id))
    : updates
  const visibleUpdates =
    severityFilter === 'all'
      ? scopedUpdates
      : scopedUpdates.filter((update) => update.severity === severityFilter)
  const confirmationCount = getUnreadCount(scopedUpdates)
  const stopWorkCount = scopedUpdates.filter((update) => update.severity === 'stop_work').length

  return (
    <main className="min-h-svh bg-[#f7f9fc] text-slate-950">
      <AppNavbar />
      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-6">
        <PageNav
          label={selectedRobot ? 'Robot Dashboard' : 'Robot Grid'}
          to={selectedRobot ? `/robots/${selectedRobot.id}` : '/robots'}
        />

        <section className={`${cardClassName} mt-5 p-5 lg:p-6`}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Important updates</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
                {selectedRobot ? `${selectedRobot.name} updates` : 'Operator notices'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Program changes, optic notices, stop-work instructions, and project information operators need before production.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
              <label className="relative flex-1">
                <span className="sr-only">Search updates</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input className={`${inputClassName} w-full pl-12`} placeholder="Search Bauteil, project, robot" />
              </label>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-black text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800"
                onClick={() => setShowCreateForm((isVisible) => !isVisible)}
                type="button"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                New update
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <SummaryTile icon={BellRing} label="Active updates" value={scopedUpdates.length} tone="blue" />
            <SummaryTile icon={CheckCircle2} label="Unread confirmations" value={confirmationCount} tone="amber" />
            <SummaryTile icon={OctagonAlert} label="Stop work" value={stopWorkCount} tone="red" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ['all', 'All'],
              ['info', 'Info'],
              ['important', 'Important'],
              ['critical', 'Critical'],
              ['stop_work', 'Stop Work'],
            ].map(([value, label]) => (
              <button
                className={`h-9 rounded-xl px-3 text-xs font-black transition ${
                  severityFilter === value
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
                key={value}
                onClick={() => setSeverityFilter(value as SeverityFilter)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {showCreateForm && (
          <section className="mt-5">
            <CreateImportantUpdateForm defaultRobotId={selectedRobot?.id} onCreated={() => setShowCreateForm(false)} />
          </section>
        )}

        <section className="mt-5 grid gap-4">
          {visibleUpdates.length === 0 ? (
            <div className={`${cardClassName} p-5`}>
              <p className="text-sm font-bold text-slate-600">No updates match this filter.</p>
            </div>
          ) : (
            visibleUpdates.map((update) => <ImportantUpdateCard update={update} key={update.id} />)
          )}
        </section>
      </section>
    </main>
  )
}

function SummaryTile({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: typeof BellRing
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
    <div className={`flex items-center gap-3 rounded-xl p-4 ${tones[tone]}`}>
      <Icon className="h-5 w-5" aria-hidden="true" />
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-xs font-black">{label}</p>
      </div>
    </div>
  )
}
