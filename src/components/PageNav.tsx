import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

type PageNavProps = {
  label: string
  to: string
}

export function PageNav({ label, to }: PageNavProps) {
  return (
    <Link
      to={to}
      className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  )
}
