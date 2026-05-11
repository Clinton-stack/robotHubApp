import { CheckCircle2, CircleAlert, Clock, FileText } from 'lucide-react'
import { robots } from '../data/robots'
import { useUpdateConfirmations } from '../updates/UpdateConfirmationsProvider'
import type { ImportantUpdate } from '../types/update'
import { UpdateSeverityBadge } from './UpdateSeverityBadge'

type ImportantUpdateCardProps = {
  update: ImportantUpdate
}

export function ImportantUpdateCard({ update }: ImportantUpdateCardProps) {
  const { confirmUpdate, isConfirmed } = useUpdateConfirmations()
  const affectedRobots = robots.filter((robot) => update.robotIds.includes(robot.id))
  const targetLabel = update.targetLabel ?? `${affectedRobots.length} robot${affectedRobots.length === 1 ? '' : 's'}`
  const confirmed = isConfirmed(update)
  const confirmationText = update.requiresConfirmation
    ? confirmed
      ? 'Confirmed by you'
      : 'Needs your confirmation'
    : 'No confirmation required'

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <UpdateSeverityBadge severity={update.severity} />
            {update.optic && (
              <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                {update.optic}
              </span>
            )}
          </div>
          <h2 className="mt-3 text-xl font-black text-slate-950">{update.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{update.message}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-500">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {update.createdAt}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
          Target: {targetLabel}
        </span>
        {affectedRobots.map((robot) => (
          <span className="rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700" key={robot.id}>
            {robot.name} / {robot.assetId}
          </span>
        ))}
      </div>

      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-3">
        <InfoLine icon={FileText} label="Project" value={[update.customer, update.project, update.bauteil].filter(Boolean).join(' / ') || '-'} />
        <InfoLine icon={CircleAlert} label="Created by" value={update.createdBy} />
        <InfoLine icon={CheckCircle2} label="Confirmation" value={confirmationText} />
      </div>

      {update.requiresConfirmation && (
        <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
          <button
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3.5 text-sm font-black transition ${
              confirmed
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-blue-700 text-white shadow-md shadow-blue-700/15 hover:bg-blue-800'
            }`}
            disabled={confirmed}
            onClick={() => confirmUpdate(update.id)}
            type="button"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {confirmed ? 'Confirmed' : 'Confirm read'}
          </button>
        </div>
      )}
    </article>
  )
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      <div>
        <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-400">{label}</p>
        <p className="mt-1 font-bold text-slate-700">{value}</p>
      </div>
    </div>
  )
}
