import { OctagonAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ImportantUpdate } from '../types/update'
import { UpdateSeverityBadge } from './UpdateSeverityBadge'

type RoutineUpdateWarningProps = {
  robotId: string
  updates: ImportantUpdate[]
}

export function RoutineUpdateWarning({ robotId, updates }: RoutineUpdateWarningProps) {
  if (updates.length === 0) {
    return null
  }

  const hasStopWork = updates.some((update) => update.severity === 'stop_work')

  return (
    <section className={`rounded-2xl border p-5 ${hasStopWork ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex items-start gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${hasStopWork ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-700'}`}>
            <OctagonAlert className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className={`text-sm font-black uppercase tracking-[0.14em] ${hasStopWork ? 'text-red-700' : 'text-amber-800'}`}>
              Read before routine check
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              {hasStopWork ? 'Stop-work notice active' : 'Critical notice active'}
            </h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
              Review these updates before continuing. Stop-work notices must be released by supervisor or maintenance.
            </p>
          </div>
        </div>

        <Link
          className={`inline-flex h-10 items-center justify-center rounded-xl px-3.5 text-sm font-black shadow-sm ${
            hasStopWork ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-amber-700 text-white hover:bg-amber-800'
          }`}
          to={`/robots/${robotId}/updates`}
        >
          Open updates
        </Link>
      </div>

      <div className="mt-4 grid gap-3">
        {updates.map((update) => (
          <article className="rounded-xl bg-white/80 p-4 shadow-sm" key={update.id}>
            <div className="flex flex-wrap items-center gap-2">
              <UpdateSeverityBadge severity={update.severity} />
              {update.optic && (
                <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">{update.optic}</span>
              )}
            </div>
            <h3 className="mt-2 font-black text-slate-950">{update.title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{update.message}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
