import { FileText, Layers, Plus, Search, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppNavbar } from '../components/AppNavbar'
import { CreateRobotDocumentForm } from '../components/CreateRobotDocumentForm'
import { PageNav } from '../components/PageNav'
import { RobotDocumentCard } from '../components/RobotDocumentCard'
import { useRobotDocuments } from '../documents/RobotDocumentsProvider'
import { robots } from '../data/robots'
import { cardClassName, inputClassName } from '../styles/ui'
import type { RobotOptic } from '../types/robot'

type OpticFilter = 'all' | RobotOptic

export function RobotDocumentsPage() {
  const { robotId } = useParams()
  const { documents } = useRobotDocuments()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [opticFilter, setOpticFilter] = useState<OpticFilter>('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const selectedRobot = robots.find((robot) => robot.id === robotId)
  const scopedDocuments = selectedRobot
    ? documents.filter((document) => document.robotIds.includes(selectedRobot.id))
    : documents
  const visibleDocuments = scopedDocuments.filter((document) => {
    const opticMatches = opticFilter === 'all' || document.optic === opticFilter
    const typeMatches = typeFilter === 'all' || document.type === typeFilter

    return opticMatches && typeMatches
  })
  const customerCount = new Set(scopedDocuments.map((document) => document.customer)).size
  const projectCount = new Set(scopedDocuments.map((document) => document.project)).size

  return (
    <main className="min-h-svh bg-[#f7f9fc] text-slate-950">
      <AppNavbar />
      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-6">
        <PageNav
          label={selectedRobot ? 'Robot Dashboard' : 'Robot Grid'}
          to={selectedRobot ? `/robots/${selectedRobot.id}` : '/robots'}
        />

        <section className={`${cardClassName} mt-5 p-5 lg:p-6`}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Documentation</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
                {selectedRobot ? `${selectedRobot.name} documents` : 'Robot knowledge base'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Project notes, Bauteil instructions, program versions, optic information, and troubleshooting documents.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
              <label className="relative flex-1">
                <span className="sr-only">Search documents</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input className={`${inputClassName} w-full pl-12`} placeholder="Search customer, project, Bauteil" />
              </label>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-black text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800"
                onClick={() => setShowCreateForm((isVisible) => !isVisible)}
                type="button"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add document
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <SummaryTile icon={FileText} label="Documents" value={scopedDocuments.length} tone="blue" />
            <SummaryTile icon={UsersRound} label="Customers" value={customerCount} tone="slate" />
            <SummaryTile icon={Layers} label="Projects" value={projectCount} tone="emerald" />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[180px_220px_1fr]">
            <select className={inputClassName} value={opticFilter} onChange={(event) => setOpticFilter(event.target.value as OpticFilter)}>
              <option value="all">All optics</option>
              <option value="ALO">ALO</option>
              <option value="BEO">BEO</option>
            </select>
            <select className={inputClassName} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">All document types</option>
              <option value="setup">Setup</option>
              <option value="program">Program</option>
              <option value="bauteil">Bauteil</option>
              <option value="optic">Optic</option>
              <option value="quality">Quality</option>
              <option value="maintenance">Maintenance</option>
              <option value="troubleshooting">Troubleshooting</option>
            </select>
          </div>
        </section>

        {showCreateForm && (
          <section className="mt-5">
            <CreateRobotDocumentForm defaultRobotId={selectedRobot?.id} onCreated={() => setShowCreateForm(false)} />
          </section>
        )}

        <section className="mt-5 grid gap-4">
          {visibleDocuments.length === 0 ? (
            <div className={`${cardClassName} p-5`}>
              <p className="text-sm font-bold text-slate-600">No documents match this filter.</p>
            </div>
          ) : (
            visibleDocuments.map((document) => <RobotDocumentCard document={document} key={document.id} />)
          )}
        </section>
      </section>
    </main>
  )
}

function SummaryTile({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: typeof FileText
  label: string
  tone: 'blue' | 'emerald' | 'slate'
  value: number
}) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    slate: 'bg-slate-100 text-slate-700',
  }

  return (
    <div className={`flex items-center gap-3 rounded-xl p-4 ${tones[tone]}`}>
      <Icon className="h-5 w-5" aria-hidden="true" />
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-xs font-black">{label}</p>
      </div>
    </div>
  )
}
