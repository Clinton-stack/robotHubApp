import { ArrowRight, BellRing, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUpdateConfirmations } from '../updates/UpdateConfirmationsProvider'
import type { ImportantUpdate } from '../types/update'
import { UpdateSeverityBadge } from './UpdateSeverityBadge'

type RobotUpdatesPanelProps = {
  robotId: string
  updates: ImportantUpdate[]
}

export function RobotUpdatesPanel({ robotId, updates }: RobotUpdatesPanelProps) {
  const { isConfirmed } = useUpdateConfirmations()
  const blockingUpdates = updates.filter(
    (update) => (update.severity === 'critical' || update.severity === 'stop_work') && !isConfirmed(update),
  )
  const latestUpdates = updates.slice(0, 3)

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
            <BellRing className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Important updates</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              {updates.length === 0 ? 'No active notices' : `${updates.length} active notice${updates.length === 1 ? '' : 's'}`}
            </h2>
          </div>
        </div>

        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3.5 text-sm font-black text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800"
          to={`/robots/${robotId}/updates`}
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {blockingUpdates.length > 0 && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-black text-red-700">
            {blockingUpdates.length} critical/stop-work notice{blockingUpdates.length === 1 ? '' : 's'} need attention before production.
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-3">
        {latestUpdates.length === 0 ? (
          <p className="rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
            No important updates are active for this robot.
          </p>
        ) : (
          latestUpdates.map((update) => (
            <article className="rounded-xl bg-slate-50 p-4" key={update.id}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <UpdateSeverityBadge severity={update.severity} />
                    {update.optic && (
                      <span className="rounded-xl bg-white px-2.5 py-1 text-xs font-black text-slate-600">
                        {update.optic}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-black text-slate-950">{update.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{update.message}</p>
                </div>
                {update.requiresConfirmation && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1 text-xs font-black text-slate-500">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {isConfirmed(update) ? 'Confirmed' : 'Confirm'}
                  </span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
