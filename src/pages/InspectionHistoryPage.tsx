import { ChevronLeft, ChevronRight, Download, Filter, Search } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppNavbar } from '../components/AppNavbar'
import { PageNav } from '../components/PageNav'
import { ResultPill } from '../components/ResultPill'
import { inspections } from '../data/inspections'
import { laserThresholds } from '../data/laserThresholds'
import { robots } from '../data/robots'
import { cardClassName, compactButtonClassName, inputClassName } from '../styles/ui'
import type { RobotOptic } from '../types/robot'

export function InspectionHistoryPage() {
  const { robotId } = useParams()
  const [opticFilter, setOpticFilter] = useState<'all' | RobotOptic>('all')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const selectedRobot = robots.find((robot) => robot.id === robotId)
  const robotInspections = selectedRobot
    ? inspections.filter((inspection) => inspection.robotId === selectedRobot.id)
    : inspections
  const visibleInspections =
    opticFilter === 'all'
      ? robotInspections
      : robotInspections.filter((inspection) => inspection.optic === opticFilter)
  const pageCount = Math.max(Math.ceil(visibleInspections.length / rowsPerPage), 1)
  const currentPage = Math.min(page, pageCount)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedInspections = visibleInspections.slice(startIndex, startIndex + rowsPerPage)
  const firstVisibleRow = visibleInspections.length === 0 ? 0 : startIndex + 1
  const lastVisibleRow = Math.min(startIndex + rowsPerPage, visibleInspections.length)

  return (
    <main className="min-h-svh bg-[#f7f9fc] text-slate-950">
      <AppNavbar />
      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-6">
        <PageNav label={selectedRobot ? 'Robot Dashboard' : 'Robot Grid'} to={selectedRobot ? `/robots/${selectedRobot.id}` : '/robots'} />

        <div className={`${cardClassName} mt-5 p-5 lg:p-6`}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Inspection history</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
                {selectedRobot ? `${selectedRobot.name} records` : 'All inspection records'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review completed routine checks by robot, optic, shift, operator, and failed checks.
              </p>
            </div>
            <button type="button" className={compactButtonClassName}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_150px_150px_150px_160px]">
            <label className="relative">
              <span className="sr-only">Search inspection history</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input className={`${inputClassName} w-full pl-12`} placeholder="Search AP ID, robot, operator" />
            </label>
            <select className={inputClassName} defaultValue="weekly">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select className={inputClassName} defaultValue="all">
              <option value="all">All shifts</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="night">Night</option>
            </select>
            <select
              className={inputClassName}
              value={opticFilter}
              onChange={(event) => {
                setOpticFilter(event.target.value as 'all' | RobotOptic)
                setPage(1)
              }}
            >
              <option value="all">All optics</option>
              <option value="ALO">ALO</option>
              <option value="BEO">BEO</option>
            </select>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Only failures
            </button>
          </div>
        </div>

        <section className={`${cardClassName} mt-5 overflow-hidden`}>
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-sm font-bold text-slate-500">
              Showing {firstVisibleRow}-{lastVisibleRow} of {visibleInspections.length} records
            </p>
            <label className="flex items-center gap-3 text-sm font-bold text-slate-600">
              Rows per page
              <select
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 shadow-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(Number(event.target.value))
                  setPage(1)
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.1em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Robot</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Shift</th>
                  <th className="px-5 py-4">Operator</th>
                  <th className="px-5 py-4">Optic</th>
                  <th className="px-5 py-4">TCP</th>
                  <th className="px-5 py-4">Laser</th>
                  <th className="px-5 py-4">Schuss</th>
                  <th className="px-5 py-4">Drahtlage</th>
                  <th className="px-5 py-4">Cooling</th>
                  <th className="px-5 py-4">Gas</th>
                  <th className="px-5 py-4">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm">
                {paginatedInspections.map((inspection) => {
                  const robot = robots.find((item) => item.id === inspection.robotId)

                  return (
                    <tr className="align-top hover:bg-blue-50/40" key={inspection.id}>
                      <td className="px-5 py-4 font-black text-slate-950">{inspection.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-black text-slate-950">{robot?.name}</p>
                        <p className="mt-1 text-xs font-bold text-blue-700">{robot?.assetId}</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-600">{inspection.date}</td>
                      <td className="px-5 py-4 font-bold text-slate-600">{inspection.shift}</td>
                      <td className="px-5 py-4 font-bold text-slate-600">{inspection.operator}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-2xl bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                          {inspection.optic}
                        </span>
                      </td>
                      <td className="px-5 py-4"><ResultPill result={inspection.tcpResult} /></td>
                      <td className="px-5 py-4">
                        <LaserResult value={inspection.laserPower} optic={inspection.optic} />
                      </td>
                      <td className="px-5 py-4"><ResultPill ok={inspection.schussOk} /></td>
                      <td className="px-5 py-4"><ResultPill result={inspection.drahtlageResult} /></td>
                      <td className="px-5 py-4"><ResultPill ok={inspection.coolingOk} /></td>
                      <td className="px-5 py-4"><ResultPill simpleResult={inspection.gasResult} /></td>
                      <td className="max-w-xs px-5 py-4 leading-6 text-slate-600">{inspection.comments}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-4 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-sm font-bold text-slate-500">
              Page {currentPage} of {pageCount}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(value - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === pageCount}
                onClick={() => setPage((value) => Math.min(value + 1, pageCount))}
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

function LaserResult({ value, optic }: { value: number; optic: RobotOptic }) {
  const threshold = laserThresholds[optic]
  const status =
    value < threshold.stopBelow
      ? { label: 'Stop', className: 'bg-red-50 text-red-700' }
      : value < threshold.reportBelow
        ? { label: 'Report', className: 'bg-amber-50 text-amber-700' }
        : { label: 'OK', className: 'bg-emerald-50 text-emerald-700' }

  return (
    <div className="grid gap-2">
      <span className="font-black text-slate-950">{value}</span>
      <span className={`inline-flex h-7 w-fit items-center rounded-2xl px-3 text-xs font-black ${status.className}`}>
        {status.label}
      </span>
    </div>
  )
}
