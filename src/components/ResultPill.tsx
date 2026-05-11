import type { CheckResult, SimpleCheckResult } from '../types/inspection'

type ResultPillProps = {
  ok?: boolean
  result?: CheckResult
  simpleResult?: SimpleCheckResult
}

const resultStyles: Record<CheckResult, { label: string; className: string }> = {
  ok: { label: 'OK', className: 'bg-emerald-50 text-emerald-700' },
  corrected: { label: 'Corrected', className: 'bg-blue-50 text-blue-700' },
  not_ok: { label: 'Not OK', className: 'bg-red-50 text-red-700' },
  not_done: { label: 'Not done', className: 'bg-slate-100 text-slate-600' },
}

const simpleResultStyles: Record<SimpleCheckResult, { label: string; className: string }> = {
  ok: { label: 'OK', className: 'bg-emerald-50 text-emerald-700' },
  not_ok: { label: 'Not OK', className: 'bg-red-50 text-red-700' },
  not_available: { label: 'N/A', className: 'bg-slate-100 text-slate-600' },
}

export function ResultPill({ ok, result, simpleResult }: ResultPillProps) {
  const style = simpleResult
    ? simpleResultStyles[simpleResult]
    : result
      ? resultStyles[result]
      : ok
        ? resultStyles.ok
        : resultStyles.not_ok

  return (
    <span className={`inline-flex h-8 items-center rounded-2xl px-3 text-xs font-black ${style.className}`}>
      {style.label}
    </span>
  )
}
