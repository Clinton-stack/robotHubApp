import type { TrendPoint } from '../data/robotDashboard'

type TrendPreviewProps = {
  title: string
  value: string
  points: TrendPoint[]
}

export function TrendPreview({ title, value, points }: TrendPreviewProps) {
  const maxValue = Math.max(...points.map((point) => point.value))

  return (
    <section className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
      </div>

      <div className="mt-6 flex h-28 items-end gap-3">
        {points.map((point) => (
          <div className="flex flex-1 flex-col items-center gap-2" key={point.label}>
            <div className="flex h-20 w-full items-end rounded-full bg-slate-100">
              <div
                className="w-full rounded-full bg-blue-700"
                style={{ height: `${Math.max((point.value / maxValue) * 100, 8)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-400">{point.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
