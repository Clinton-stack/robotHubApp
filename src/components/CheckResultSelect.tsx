import { inputClassName } from '../styles/ui'

type CheckResultSelectProps = {
  label: string
  name: string
}

export function CheckResultSelect({ label, name }: CheckResultSelectProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      <select name={name} className={inputClassName} defaultValue="ok">
        <option value="ok">OK</option>
        <option value="corrected">Not OK, corrected</option>
        <option value="not_ok">Not OK, report</option>
        <option value="not_done">Not done / unavailable</option>
      </select>
    </label>
  )
}
