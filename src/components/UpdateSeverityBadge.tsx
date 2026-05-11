import type { UpdateSeverity } from '../types/update'

type UpdateSeverityBadgeProps = {
  severity: UpdateSeverity
}

const severityStyles: Record<UpdateSeverity, { className: string; label: string }> = {
  critical: {
    className: 'bg-red-50 text-red-700 ring-red-100',
    label: 'Critical',
  },
  important: {
    className: 'bg-amber-50 text-amber-700 ring-amber-100',
    label: 'Important',
  },
  info: {
    className: 'bg-blue-50 text-blue-700 ring-blue-100',
    label: 'Info',
  },
  stop_work: {
    className: 'bg-slate-950 text-white ring-slate-950',
    label: 'Stop Work',
  },
}

export function UpdateSeverityBadge({ severity }: UpdateSeverityBadgeProps) {
  const style = severityStyles[severity]

  return (
    <span className={`inline-flex h-7 items-center rounded-xl px-2.5 text-xs font-black ring-1 ${style.className}`}>
      {style.label}
    </span>
  )
}
