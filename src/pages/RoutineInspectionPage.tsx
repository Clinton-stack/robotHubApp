import { ClipboardCheck, Save } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { AppNavbar } from '../components/AppNavbar'
import { CheckResultSelect } from '../components/CheckResultSelect'
import { PageNav } from '../components/PageNav'
import { RoutineUpdateWarning } from '../components/RoutineUpdateWarning'
import { SimpleCheckSelect } from '../components/SimpleCheckSelect'
import { StatusBadge } from '../components/StatusBadge'
import { laserThresholds } from '../data/laserThresholds'
import { robots } from '../data/robots'
import { cardClassName, inputClassName, primaryButtonClassName } from '../styles/ui'
import type { RobotOptic } from '../types/robot'
import { useImportantUpdates } from '../updates/ImportantUpdatesProvider'
import { useUpdateConfirmations } from '../updates/UpdateConfirmationsProvider'
import { useCurrentUser } from '../users/UserProvider'

export function RoutineInspectionPage() {
  const { robotId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const { getBlockingRobotUpdates } = useImportantUpdates()
  const { isConfirmed } = useUpdateConfirmations()
  const robot = robots.find((item) => item.id === robotId)
  const [activeOptic, setActiveOptic] = useState<RobotOptic | undefined>(robot?.optics[0])

  if (!robot) {
    return <Navigate to="/robots" replace />
  }

  const selectedOptic = activeOptic && robot.optics.includes(activeOptic) ? activeOptic : robot.optics[0]
  const blockingUpdates = getBlockingRobotUpdates(robot.id).filter((update) => !isConfirmed(update))

  return (
    <main className="min-h-svh bg-[#f7f9fc] text-slate-950">
      <AppNavbar />
      <section className="mx-auto max-w-5xl px-5 py-6 lg:px-6">
        <PageNav label="Robot Dashboard" to={`/robots/${robot.id}`} />

        <div className={`${cardClassName} mt-5 overflow-hidden`}>
          <div className="h-2 bg-blue-700" />
          <div className="p-5 lg:p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">{robot.assetId}</p>
                <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">Routine check</h1>
                <p className="mt-2 text-sm font-bold text-slate-500">
                  {robot.name} / {robot.type} / {robot.location}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {robot.optics.map((optic) => (
                    <span className="rounded-2xl bg-blue-50 px-3 py-1 text-xs font-black text-blue-700" key={optic}>
                      {optic} optic
                    </span>
                  ))}
                </div>
              </div>
              <StatusBadge status={robot.status} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Date
                <input type="date" name="date" className={inputClassName} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Shift
                <select name="shift" className={inputClassName} defaultValue="morning">
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="night">Night</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Operator
                <input type="hidden" name="operator" value={currentUser.name} />
                <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700 shadow-sm">
                  {currentUser.name}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <RoutineUpdateWarning robotId={robot.id} updates={blockingUpdates} />
        </div>

        <form
          className="mt-5 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            navigate(`/robots/${robot.id}`)
          }}
        >
          <section className={`${cardClassName} p-2`}>
            <div className="grid gap-3 sm:grid-cols-2">
              {robot.optics.map((optic) => (
                <button
                  type="button"
                  className={`h-11 rounded-xl px-4 text-sm font-black transition ${
                    optic === selectedOptic
                      ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => setActiveOptic(optic)}
                  key={optic}
                >
                  {optic} optic
                </button>
              ))}
            </div>
          </section>

          <OpticInspectionSection optic={selectedOptic} />

          <section className={`${cardClassName} p-5 lg:p-6`}>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Comments
              <textarea
                name="comments"
                rows={5}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                placeholder="Add notes for maintenance or next shift"
              />
            </label>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className={`inline-flex items-center justify-center gap-2 ${primaryButtonClassName}`}>
                <Save className="h-5 w-5" aria-hidden="true" />
                Submit inspection
              </button>
              <Link
                to={`/robots/${robot.id}`}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </section>
        </form>
      </section>
    </main>
  )
}

function OpticInspectionSection({ optic }: { optic: RobotOptic }) {
  const threshold = laserThresholds[optic]
  const prefix = optic.toLowerCase()

  return (
    <section className={`${cardClassName} p-5 lg:p-6`}>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-white">
          <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Mandatory checks</p>
          <h2 className="text-xl font-black text-slate-950">{optic} optic inspection</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-2 rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-900 md:grid-cols-2">
        <p>Report if laser is below {threshold.reportBelow}</p>
        <p>Stop work if laser is below {threshold.stopBelow}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <CheckResultSelect label="TCP Kontrolle" name={`${prefix}_tcp_result`} />
        <CheckResultSelect label="Drahtlage" name={`${prefix}_drahtlage_result`} />
        <SimpleCheckSelect label="Gas check" name={`${prefix}_gas_result`} />
        <SimpleCheckSelect label="Schuss" name={`${prefix}_schuss_result`} />
        <SimpleCheckSelect label="Cooling" name={`${prefix}_cooling_result`} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Laser Leistung
          <input
            type="number"
            min="0"
            max="4000"
            name={`${prefix}_laser_power`}
            className={inputClassName}
            placeholder="e.g. 3650"
          />
        </label>
      </div>
    </section>
  )
}
