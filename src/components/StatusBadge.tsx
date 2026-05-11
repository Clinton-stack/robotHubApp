import { useLanguage } from '../i18n/LanguageProvider'
import type { RobotStatus } from '../types/robot'

type StatusBadgeProps = {
  status: RobotStatus
}

const statusStyles: Record<RobotStatus, { labelKey: 'status.green' | 'status.yellow' | 'status.red'; className: string; dotClassName: string }> = {
  ok: {
    labelKey: 'status.green',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    dotClassName: 'bg-emerald-500',
  },
  warning: {
    labelKey: 'status.yellow',
    className: 'bg-amber-50 text-amber-700 ring-amber-100',
    dotClassName: 'bg-amber-500',
  },
  critical: {
    labelKey: 'status.red',
    className: 'bg-red-50 text-red-700 ring-red-100',
    dotClassName: 'bg-red-500',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status]
  const { t } = useLanguage()

  return (
    <span
      className={`inline-flex h-8 items-center gap-2 rounded-xl px-2.5 text-xs font-black ring-1 ${style.className}`}
    >
      <span className={`h-2 w-2 rounded-full ${style.dotClassName}`} />
      {t(style.labelKey)}
    </span>
  )
}
