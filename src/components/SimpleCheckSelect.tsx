import { inputClassName } from '../styles/ui'

type SimpleCheckSelectProps = {
  label: string
  name: string
}

export function SimpleCheckSelect({ label, name }: SimpleCheckSelectProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      <select name={name} className={inputClassName} defaultValue="ok">
        <option value="ok">OK</option>
        <option value="not_ok">Not OK</option>
        <option value="not_available">Not available</option>
      </select>
    </label>
  )
}
