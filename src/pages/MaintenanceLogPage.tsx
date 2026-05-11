import { Filter, Plus, Wrench } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { AppNavbar } from '../components/AppNavbar'
import { PageNav } from '../components/PageNav'
import { maintenanceLogs } from '../data/maintenanceLogs'
import { robots } from '../data/robots'
import { cardClassName, compactButtonClassName, inputClassName } from '../styles/ui'
import type { MaintenanceStatus } from '../types/maintenance'

const statusStyles: Record<MaintenanceStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-red-50 text-red-700' },
  in_progress: { label: 'In progress', className: 'bg-amber-50 text-amber-700' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700' },
}

export function MaintenanceLogPage() {
  const { robotId } = useParams()
  const selectedRobot = robots.find((robot) => robot.id === robotId)
  const visibleLogs = selectedRobot ? maintenanceLogs.filter((log) => log.robotId === selectedRobot.id) : maintenanceLogs

  return (
    <main className="min-h-svh bg-[#f7f9fc] text-slate-950">
      <AppNavbar />
      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-6">
        <PageNav label={selectedRobot ? 'Robot Dashboard' : 'Robot Grid'} to={selectedRobot ? `/robots/${selectedRobot.id}` : '/robots'} />

        <section className={`${cardClassName} mt-5 p-5 lg:p-6`}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Maintenance</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
                {selectedRobot ? `${selectedRobot.name} maintenance log` : 'Maintenance log'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Track reported issues, corrective actions, responsible technicians, and repair status.
              </p>
            </div>
            <button type="button" className={compactButtonClassName}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              New log
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_180px_160px]">
            <input className={inputClassName} placeholder="Search issue, action, technician" />
            <select className={inputClassName} defaultValue="all">
              <option value="all">All status</option>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filter
            </button>
          </div>
        </section>

        <div className="mt-5 grid gap-4">
          {visibleLogs.length === 0 ? (
            <section className={`${cardClassName} p-6`}>
              <p className="text-sm font-bold text-slate-600">No maintenance logs for this robot yet.</p>
            </section>
          ) : (
            visibleLogs.map((log) => {
              const robot = robots.find((item) => item.id === log.robotId)
              const status = statusStyles[log.status]

              return (
                <article className={`${cardClassName} overflow-hidden`} key={log.id}>
                  <div className="grid gap-0 lg:grid-cols-[240px_1fr_260px]">
                    <div className="border-b border-slate-100 bg-slate-50 p-6 lg:border-b-0 lg:border-r">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                        <Wrench className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="mt-5 text-sm font-black text-slate-950">{log.id}</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">{log.date}</p>
                      <span className={`mt-4 inline-flex rounded-2xl px-3 py-1 text-xs font-black ${status.className}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="p-6">
                      <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">
                        {robot?.name} / {robot?.assetId}
                      </p>
                      <h2 className="mt-3 text-2xl font-black text-slate-950">{log.issue}</h2>
                      <p className="mt-4 text-base leading-7 text-slate-600">{log.actionTaken}</p>
                    </div>

                    <div className="border-t border-slate-100 p-6 lg:border-l lg:border-t-0">
                      <p className="text-sm font-bold text-slate-500">Technician</p>
                      <p className="mt-2 text-xl font-black text-slate-950">{log.technician}</p>
                      <p className="mt-5 text-sm font-bold text-slate-500">Location</p>
                      <p className="mt-2 text-base font-black text-slate-950">{robot?.location}</p>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>
    </main>
  )
}
