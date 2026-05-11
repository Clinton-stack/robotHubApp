import {
  Activity,
  BarChart3,
  BellRing,
  ClipboardList,
  FileText,
  History,
  MessageSquareText,
  Wrench,
} from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AppNavbar } from '../components/AppNavbar'
import { PageNav } from '../components/PageNav'
import { RobotDashboardCharts } from '../components/RobotDashboardCharts'
import { RobotUpdatesPanel } from '../components/RobotUpdatesPanel'
import { StatusBadge } from '../components/StatusBadge'
import { inspections } from '../data/inspections'
import { dashboardIssues } from '../data/robotDashboard'
import { robots } from '../data/robots'
import { useLanguage } from '../i18n/LanguageProvider'
import { cardClassName, compactButtonClassName } from '../styles/ui'
import type { TranslationKey } from '../i18n/translations'
import { useImportantUpdates } from '../updates/ImportantUpdatesProvider'
import { useCurrentUser } from '../users/UserProvider'

const quickActions = [
  { labelKey: 'action.newRoutineCheck', icon: ClipboardList, path: 'check', roles: ['Operator', 'Supervisor', 'Admin'] },
  { labelKey: 'common.importantUpdates', icon: BellRing, path: 'updates', roles: ['Operator', 'Supervisor', 'Admin'] },
  { labelKey: 'common.messages', icon: MessageSquareText, path: 'messages', roles: ['Operator', 'Supervisor', 'Admin'] },
  { labelKey: 'common.documentation', icon: FileText, path: 'docs', roles: ['Operator', 'Supervisor', 'Admin'] },
  { labelKey: 'action.viewHistory', icon: History, path: 'history', roles: ['Supervisor', 'Admin'] },
  { labelKey: 'common.maintenance', icon: Wrench, path: 'maintenance', roles: ['Supervisor', 'Admin'] },
  { labelKey: 'common.analytics', icon: BarChart3, path: 'analytics', roles: ['Supervisor', 'Admin'] },
] satisfies { labelKey: TranslationKey; icon: typeof ClipboardList; path: string; roles: string[] }[]

export function RobotDashboardPage() {
  const { robotId } = useParams()
  const { t } = useLanguage()
  const { currentUser } = useCurrentUser()
  const { getRobotUpdates } = useImportantUpdates()
  const robot = robots.find((item) => item.id === robotId)

  if (!robot) {
    return <Navigate to="/robots" replace />
  }

  const robotIssues = dashboardIssues.filter((issue) => issue.robotId === robot.id)
  const robotInspections = inspections.filter((inspection) => inspection.robotId === robot.id)
  const robotUpdates = getRobotUpdates(robot.id)
  const visibleQuickActions = quickActions.filter((action) => action.roles.includes(currentUser.role))

  return (
    <main className="min-h-svh bg-[#f7f9fc] text-slate-950">
      <AppNavbar />
      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-6">
        <PageNav label={t('common.robotGrid')} to="/robots" />

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className={`${cardClassName} overflow-hidden`}>
            <div className="h-2 bg-blue-700" />
            <div className="p-5 lg:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">{robot.assetId}</p>
                  <h1 className="mt-1 text-3xl font-black tracking-normal text-slate-950">{robot.name}</h1>
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    {robot.type} / {robot.location}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {robot.optics.map((optic) => (
                      <span className="rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700" key={optic}>
                        {optic} {t('dashboard.optic')}
                      </span>
                    ))}
                  </div>
                </div>
                <StatusBadge status={robot.status} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">{t('common.lastInspection')}</p>
                  <p className="mt-1 text-base font-black text-slate-950">{robot.lastInspection}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">{t('common.healthScore')}</p>
                  <p className="mt-1 text-base font-black text-slate-950">{robot.healthScore}%</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">{t('common.openIssues')}</p>
                  <p className="mt-1 text-base font-black text-slate-950">{robot.openIssues}</p>
                </div>
              </div>
            </div>
          </section>

          <section className={`${cardClassName} p-5`}>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{t('dashboard.quickActions')}</p>
            <div className="mt-4 grid gap-2.5">
              {visibleQuickActions.map((action) => {
                const Icon = action.icon

                return (
                  <Link
                    className="flex h-11 items-center justify-between rounded-xl border border-slate-100 bg-white px-3.5 text-left text-sm font-black text-slate-800 shadow-sm transition hover:border-blue-100 hover:bg-blue-50"
                    to={action.path ? `/robots/${robot.id}/${action.path}` : `/robots/${robot.id}`}
                    key={action.labelKey}
                  >
                    <span className="inline-flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-700" aria-hidden="true" />
                      {t(action.labelKey)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>

        <div className="mt-5">
          <RobotUpdatesPanel robotId={robot.id} updates={robotUpdates} />
        </div>

        <div className="mt-5">
          <RobotDashboardCharts inspections={robotInspections} robot={robot} />
        </div>

        <div className="mt-5">
          <section className={`${cardClassName} p-5`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{t('dashboard.recentIssues')}</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">{t('dashboard.reportedProblems')}</h2>
              </div>
              <Activity className="h-6 w-6 text-blue-700" aria-hidden="true" />
            </div>

            <div className="mt-4 grid gap-3">
              {robotIssues.length === 0 ? (
                <p className="rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                  {t('dashboard.noRecentIssues')}
                </p>
              ) : (
                robotIssues.map((issue) => (
                  <article className="rounded-xl border border-slate-100 bg-slate-50 p-4" key={issue.id}>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-black text-slate-950">{issue.title}</h3>
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-slate-500">{issue.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{issue.detail}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="mt-5">
          <Link to={`/robots/${robot.id}/check`} className={compactButtonClassName}>
            {t('action.startRoutineCheck')}
          </Link>
        </div>
      </section>
    </main>
  )
}
