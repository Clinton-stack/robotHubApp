import { CalendarClock, FileText, Layers, UserRound } from 'lucide-react'
import { robots } from '../data/robots'
import type { RobotDocument } from '../types/documentation'

type RobotDocumentCardProps = {
  document: RobotDocument
}

const typeLabels: Record<RobotDocument['type'], string> = {
  bauteil: 'Bauteil',
  maintenance: 'Maintenance',
  optic: 'Optic',
  program: 'Program',
  quality: 'Quality',
  setup: 'Setup',
  troubleshooting: 'Troubleshooting',
}

export function RobotDocumentCard({ document }: RobotDocumentCardProps) {
  const affectedRobots = robots.filter((robot) => document.robotIds.includes(robot.id))

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">
              {typeLabels[document.type]}
            </span>
            {document.optic && (
              <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                {document.optic}
              </span>
            )}
            <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
              v{document.version}
            </span>
          </div>
          <h2 className="mt-3 text-xl font-black text-slate-950">{document.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{document.description}</p>
        </div>

        <button
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3.5 text-sm font-black text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800"
          type="button"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          Open
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {affectedRobots.map((robot) => (
          <span className="rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700" key={robot.id}>
            {robot.name} / {robot.assetId}
          </span>
        ))}
      </div>

      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-4">
        <InfoLine icon={Layers} label="Project" value={[document.customer, document.project, document.bauteil].filter(Boolean).join(' / ')} />
        <InfoLine icon={FileText} label="File" value={document.fileLabel} />
        <InfoLine icon={UserRound} label="Updated by" value={document.updatedBy} />
        <InfoLine icon={CalendarClock} label="Updated" value={document.updatedAt} />
      </div>
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
        <p className="mt-1 font-bold text-slate-700">{value || '-'}</p>
      </div>
    </div>
  )
}
