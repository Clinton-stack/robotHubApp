import { CalendarDays, Search, ShieldCheck } from 'lucide-react'
import { AppNavbar } from '../components/AppNavbar'
import { RobotCard } from '../components/RobotCard'
import { robots } from '../data/robots'
import { useLanguage } from '../i18n/LanguageProvider'
import { cardClassName, inputClassName } from '../styles/ui'

const statusCounts = {
  ok: robots.filter((robot) => robot.status === 'ok').length,
  warning: robots.filter((robot) => robot.status === 'warning').length,
  critical: robots.filter((robot) => robot.status === 'critical').length,
}

export function RobotGridPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-svh bg-[#f7f9fc] text-slate-950">
      <AppNavbar />

      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-6">
        <div className={`${cardClassName} p-5 lg:p-6`}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">{t('common.robotGrid')}</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950">{t('robotGrid.title')}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {t('robotGrid.description')}
              </p>
            </div>

            <label className="relative w-full max-w-md">
              <span className="sr-only">Search robots</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input className={`${inputClassName} w-full pl-12`} placeholder={t('common.searchRobots')} />
            </label>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-white">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-700">{t('common.currentShift')}</p>
                <p className="mt-1 text-base font-black text-slate-950">{t('robotGrid.currentShiftValue')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-600">{t('common.routineChecks')}</p>
                <p className="mt-1 text-base font-black text-slate-950">
                  {robots.length} {t('robotGrid.robotsAssigned')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">{t('common.statusGreen')}</p>
            <p className="mt-1 text-2xl font-black text-emerald-900">{statusCounts.ok}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-amber-700">{t('common.statusYellow')}</p>
            <p className="mt-1 text-2xl font-black text-amber-900">{statusCounts.warning}</p>
          </div>
          <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-red-700">{t('common.statusRed')}</p>
            <p className="mt-1 text-2xl font-black text-red-900">{statusCounts.critical}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {robots.map((robot) => (
            <RobotCard robot={robot} key={robot.id} />
          ))}
        </div>
      </section>
    </main>
  )
}
