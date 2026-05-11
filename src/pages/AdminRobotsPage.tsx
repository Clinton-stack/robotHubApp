import { Bot, Plus, Search, Settings2 } from 'lucide-react'
import { AppNavbar } from '../components/AppNavbar'
import { PageNav } from '../components/PageNav'
import { StatusBadge } from '../components/StatusBadge'
import { robots } from '../data/robots'
import { cardClassName, inputClassName, primaryButtonClassName } from '../styles/ui'

export function AdminRobotsPage() {
  return (
    <main className="min-h-svh bg-[#f7f9fc] text-slate-950">
      <AppNavbar />
      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-6">
        <PageNav label="Robot Grid" to="/robots" />

        <section className={`${cardClassName} mt-5 p-5 lg:p-6`}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Admin</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">Robot management</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Manage AP IDs, robot names, optics, type, location, and operating status.
              </p>
            </div>
            <button type="button" className={`inline-flex items-center justify-center gap-2 ${primaryButtonClassName}`}>
              <Plus className="h-5 w-5" aria-hidden="true" />
              Add robot
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_180px_180px]">
            <label className="relative">
              <span className="sr-only">Search robots</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input className={`${inputClassName} w-full pl-12`} placeholder="Search Freya, AP2345, Halle 1" />
            </label>
            <select className={inputClassName} defaultValue="all">
              <option value="all">All types</option>
              <option value="welding">Laser Welding</option>
              <option value="cutting">Laser Cutting</option>
            </select>
            <select className={inputClassName} defaultValue="all">
              <option value="all">All halls</option>
              <option value="halle-1">Halle 1</option>
              <option value="halle-2">Halle 2</option>
              <option value="halle-3">Halle 3</option>
            </select>
          </div>
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
          <section className={`${cardClassName} overflow-hidden`}>
            <div className="border-b border-slate-100 bg-white px-5 py-4">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Configured robots</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.1em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Robot</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Optics</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Health</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {robots.map((robot) => (
                    <tr className="hover:bg-blue-50/40" key={robot.id}>
                      <td className="px-5 py-4">
                        <p className="font-black text-slate-950">{robot.name}</p>
                        <p className="mt-1 text-xs font-bold text-blue-700">{robot.assetId}</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-600">{robot.type}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {robot.optics.map((optic) => (
                            <span className="rounded-2xl bg-blue-50 px-3 py-1 text-xs font-black text-blue-700" key={optic}>
                              {optic}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-600">{robot.location}</td>
                      <td className="px-5 py-4"><StatusBadge status={robot.status} /></td>
                      <td className="px-5 py-4 font-black text-slate-950">{robot.healthScore}%</td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                          <Settings2 className="h-4 w-4" aria-hidden="true" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className={`${cardClassName} p-6`}>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <Bot className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Configuration</p>
                <h2 className="text-2xl font-black text-slate-950">Robot setup</h2>
              </div>
            </div>

            <form className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                AP ID
                <input className={inputClassName} placeholder="AP2345" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Robot name
                <input className={inputClassName} placeholder="Freya" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Type
                <select className={inputClassName} defaultValue="Laser Welding">
                  <option>Laser Welding</option>
                  <option>Laser Cutting</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Location
                <select className={inputClassName} defaultValue="Halle 1">
                  <option>Halle 1</option>
                  <option>Halle 2</option>
                  <option>Halle 3</option>
                </select>
              </label>

              <div className="grid gap-3 rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-700">Optics</p>
                <label className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700">
                  ALO
                  <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-slate-300 text-blue-700" />
                </label>
                <label className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700">
                  BEO
                  <input type="checkbox" className="h-5 w-5 rounded border-slate-300 text-blue-700" />
                </label>
              </div>

              <button type="button" className={`mt-2 ${primaryButtonClassName}`}>
                Save configuration
              </button>
            </form>
          </aside>
        </div>
      </section>
    </main>
  )
}
