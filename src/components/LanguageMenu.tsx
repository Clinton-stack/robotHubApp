import { Languages } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageProvider'
import { languages, type Language } from '../i18n/translations'

export function LanguageMenu() {
  const { language, setLanguage } = useLanguage()

  return (
    <label className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 shadow-sm">
      <Languages className="h-4 w-4 text-blue-700" aria-hidden="true" />
      <span className="sr-only">Language</span>
      <select
        className="bg-transparent text-sm font-black text-slate-700 outline-none"
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
      >
        {languages.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  )
}
