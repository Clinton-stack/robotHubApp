import { ArrowRight, BellRing, Bot, Clock, Gauge, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageProvider'
import { useImportantUpdates } from '../updates/ImportantUpdatesProvider'
import { useUpdateConfirmations } from '../updates/UpdateConfirmationsProvider'
import { StatusBadge } from './StatusBadge'
import { cardClassName, compactButtonClassName } from '../styles/ui'
import type { Robot } from '../types/robot'
import type { ImportantUpdate } from '../types/update'

type RobotCardProps = {
  robot: Robot
}

export function RobotCard({ robot }: RobotCardProps) {
  const { t } = useLanguage()
  const { getBlockingRobotUpdates, getRobotUpdates } = useImportantUpdates()
  const { isConfirmed } = useUpdateConfirmations()
  const robotUpdates = getRobotUpdates(robot.id)
  const blockingUpdates = getBlockingRobotUpdates(robot.id)
  const unreadUpdates = robotUpdates.filter((update) => update.requiresConfirmation && !isConfirmed(update))
  const unreadBlockingUpdates = blockingUpdates.filter((update) => !isConfirmed(update))
  const priorityUpdate = getPriorityUpdate(unreadBlockingUpdates, unreadUpdates, robotUpdates)
  const updateBadge = getUpdateBadge(priorityUpdate, unreadUpdates.length, robotUpdates.length)

  return (
    <article className={`${cardClassName} group flex min-h-[360px] flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200`}>
      <div className="relative h-40 overflow-hidden bg-slate-100">
        {robot.imageUrl ? (
          <img
            src={robot.imageUrl}
            alt={`${robot.name} robot`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center bg-slate-100 text-slate-400">
            <Bot className="h-12 w-12" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/55 to-transparent" />
        <div className="absolute left-4 top-4 rounded-xl bg-white/95 px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-blue-700 shadow-sm">
          {robot.assetId}
        </div>
        <div className="absolute right-4 top-4">
          <StatusBadge status={robot.status} />
        </div>
        {priorityUpdate && updateBadge && (
          <Link
            to={`/robots/${robot.id}/updates`}
            className={`absolute bottom-4 left-4 inline-flex h-8 items-center gap-2 rounded-xl px-3 text-xs font-black shadow-sm ${updateBadge.className}`}
          >
            <BellRing className="h-4 w-4" aria-hidden="true" />
            {updateBadge.label}
          </Link>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="mt-1 text-2xl font-black tracking-normal text-slate-950">{robot.name}</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">{robot.location}</p>
          </div>
        </div>

        <div className="mt-3 inline-flex w-fit rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
          {robot.type}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {robot.optics.map((optic) => (
            <span className="rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700" key={optic}>
              {optic}
            </span>
          ))}
        </div>

        {priorityUpdate && (
          <Link
            to={`/robots/${robot.id}/updates`}
            className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3 text-left transition hover:border-amber-200 hover:bg-amber-100"
          >
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-amber-700">
              <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
              {priorityUpdate.severity === 'stop_work' ? 'Stop work notice' : 'Update notice'}
            </p>
            <p className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-slate-800">{priorityUpdate.title}</p>
          </Link>
        )}

        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span>{t('common.lastInspection')}: {robot.lastInspection}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span>
              {robot.openIssues} {robot.openIssues === 1 ? t('robotCard.openIssue') : t('robotCard.openIssues')}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-2 font-bold text-slate-700">
              <Gauge className="h-4 w-4 text-slate-400" aria-hidden="true" />
              {t('common.healthScore')}
            </span>
            <span className="font-black text-slate-950">{robot.healthScore}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-700" style={{ width: `${robot.healthScore}%` }} />
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Link to={`/robots/${robot.id}`} className={compactButtonClassName}>
            {t('action.openRobot')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function getPriorityUpdate(
  unreadBlockingUpdates: ImportantUpdate[],
  unreadUpdates: ImportantUpdate[],
  robotUpdates: ImportantUpdate[],
) {
  return (
    unreadBlockingUpdates.find((update) => update.severity === 'stop_work') ??
    unreadBlockingUpdates[0] ??
    unreadUpdates[0] ??
    robotUpdates.find((update) => update.severity === 'stop_work') ??
    robotUpdates.find((update) => update.severity === 'critical') ??
    robotUpdates[0]
  )
}

function getUpdateBadge(update: ImportantUpdate | undefined, unreadCount: number, updateCount: number) {
  if (!update) {
    return undefined
  }

  if (update.severity === 'stop_work') {
    return {
      className: 'bg-slate-950 text-white',
      label: 'Stop work',
    }
  }

  if (update.severity === 'critical') {
    return {
      className: 'bg-red-600 text-white',
      label: unreadCount > 0 ? `${unreadCount} critical` : 'Critical',
    }
  }

  if (unreadCount > 0) {
    return {
      className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
      label: `${unreadCount} unread`,
    }
  }

  return {
    className: 'bg-white/95 text-slate-700 ring-1 ring-slate-100',
    label: `${updateCount} updates`,
  }
}
