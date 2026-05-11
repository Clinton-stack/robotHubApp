type CheckToggleProps = {
  label: string
  name: string
  defaultChecked?: boolean
}

export function CheckToggle({ label, name, defaultChecked = true }: CheckToggleProps) {
  return (
    <label className="flex min-h-16 items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white px-5 shadow-sm">
      <span className="text-base font-black text-slate-800">{label}</span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-7 w-7 rounded-lg border-slate-300 text-blue-700 focus:ring-blue-600"
      />
    </label>
  )
}
