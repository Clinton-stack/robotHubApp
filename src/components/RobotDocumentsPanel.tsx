import { ArrowRight, FileText, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { RobotDocument } from '../types/documentation'

type RobotDocumentsPanelProps = {
  documents: RobotDocument[]
  robotId: string
}

export function RobotDocumentsPanel({ documents, robotId }: RobotDocumentsPanelProps) {
  const latestDocuments = documents.slice(0, 3)
  const projectCount = new Set(documents.map((document) => document.project)).size

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Documentation</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              {documents.length === 0 ? 'No documents linked' : `${documents.length} document${documents.length === 1 ? '' : 's'}`}
            </h2>
          </div>
        </div>

        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3.5 text-sm font-black text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800"
          to={`/robots/${robotId}/docs`}
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          <p className="text-xl font-black">{projectCount}</p>
          <p className="text-xs font-black">Projects</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-slate-700">
          <p className="text-xl font-black">{documents.filter((document) => document.bauteil).length}</p>
          <p className="text-xs font-black">Bauteil docs</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {latestDocuments.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
            No documentation is linked to this robot yet.
          </p>
        ) : (
          latestDocuments.map((document) => (
            <article className="rounded-xl bg-slate-50 p-4" key={document.id}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-xl bg-white px-2.5 py-1 text-xs font-black text-blue-700">
                      {document.type}
                    </span>
                    {document.optic && (
                      <span className="rounded-xl bg-white px-2.5 py-1 text-xs font-black text-slate-600">
                        {document.optic}
                      </span>
                    )}
                    {document.bauteil && (
                      <span className="rounded-xl bg-white px-2.5 py-1 text-xs font-black text-slate-600">
                        {document.bauteil}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-black text-slate-950">{document.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{document.description}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-2.5 py-1 text-xs font-black text-slate-500">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                  v{document.version}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
