import { Send } from 'lucide-react'
import { useState } from 'react'
import { robots } from '../data/robots'
import { inputClassName, primaryButtonClassName } from '../styles/ui'
import type { RobotOptic } from '../types/robot'
import type { UpdateSeverity } from '../types/update'
import { useImportantUpdates } from '../updates/ImportantUpdatesProvider'

type CreateImportantUpdateFormProps = {
  defaultRobotId?: string
  onCreated?: () => void
}

type TargetMode = 'single' | 'hall' | 'custom'

const halls = Array.from(new Set(robots.map((robot) => robot.location)))

export function CreateImportantUpdateForm({ defaultRobotId, onCreated }: CreateImportantUpdateFormProps) {
  const { createUpdate } = useImportantUpdates()
  const [targetMode, setTargetMode] = useState<TargetMode>(defaultRobotId ? 'single' : 'hall')

  return (
    <form
      className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const title = String(formData.get('title') ?? '').trim()
        const message = String(formData.get('message') ?? '').trim()
        const target = getTargetRobotIds(formData, targetMode)

        if (target.robotIds.length === 0 || !title || !message) {
          return
        }

        createUpdate({
          bauteil: getOptionalValue(formData, 'bauteil'),
          customer: getOptionalValue(formData, 'customer'),
          message,
          optic: getOptionalValue(formData, 'optic') as RobotOptic | undefined,
          project: getOptionalValue(formData, 'project'),
          requiresConfirmation: formData.get('requires_confirmation') === 'on',
          robotIds: target.robotIds,
          severity: String(formData.get('severity')) as UpdateSeverity,
          targetLabel: target.label,
          targetType: targetMode === 'hall' ? 'hall' : 'robots',
          title,
        })
        event.currentTarget.reset()
        onCreated?.()
      }}
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Create update</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">Notify operators</h2>
      </div>

      <section className="rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">Target</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {([
            ['single', 'One robot'],
            ['hall', 'Whole hall'],
            ['custom', 'Custom robots'],
          ] as const).map(([value, label]) => (
            <button
              className={`h-9 rounded-xl px-3 text-xs font-black transition ${
                targetMode === value ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
              key={value}
              onClick={() => setTargetMode(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {targetMode === 'single' && (
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Robot
              <select className={inputClassName} name="robot_id" defaultValue={defaultRobotId ?? robots[0]?.id}>
                {robots.map((robot) => (
                  <option value={robot.id} key={robot.id}>
                    {robot.name} / {robot.assetId} / {robot.location}
                  </option>
                ))}
              </select>
            </label>
          )}

          {targetMode === 'hall' && (
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Hall
              <select className={inputClassName} name="hall" defaultValue={halls[0]}>
                {halls.map((hall) => (
                  <option value={hall} key={hall}>
                    {hall} / {robots.filter((robot) => robot.location === hall).length} robots
                  </option>
                ))}
              </select>
            </label>
          )}

          {targetMode === 'custom' && (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {robots.map((robot) => (
                <label
                  className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm"
                  key={robot.id}
                >
                  <input
                    className="h-5 w-5 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                    defaultChecked={robot.id === defaultRobotId}
                    name="robot_ids"
                    type="checkbox"
                    value={robot.id}
                  />
                  <span>{robot.name} / {robot.assetId}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Severity
          <select className={inputClassName} name="severity" defaultValue="important">
            <option value="info">Info</option>
            <option value="important">Important</option>
            <option value="critical">Critical</option>
            <option value="stop_work">Stop Work</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Optic
          <select className={inputClassName} name="optic" defaultValue="">
            <option value="">Not optic-specific</option>
            <option value="ALO">ALO</option>
            <option value="BEO">BEO</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Title
        <input className={inputClassName} name="title" placeholder="Example: BEO program change for Bauteil P-4471" />
      </label>

      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Message
        <textarea
          className="min-h-28 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
          name="message"
          placeholder="Write what changed, what the operator should do, and whether production can continue."
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <input className={inputClassName} name="customer" placeholder="Customer" />
        <input className={inputClassName} name="project" placeholder="Project" />
        <input className={inputClassName} name="bauteil" placeholder="Bauteil" />
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
        <label className="inline-flex items-center gap-3 text-sm font-bold text-slate-700">
          <input
            className="h-5 w-5 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
            name="requires_confirmation"
            type="checkbox"
            defaultChecked
          />
          Operator must confirm
        </label>

        <button className={`inline-flex items-center justify-center gap-2 ${primaryButtonClassName}`} type="submit">
          <Send className="h-4 w-4" aria-hidden="true" />
          Publish update
        </button>
      </div>
    </form>
  )
}

function getOptionalValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? '').trim()

  return value || undefined
}

function getTargetRobotIds(formData: FormData, targetMode: TargetMode) {
  if (targetMode === 'hall') {
    const hall = String(formData.get('hall') ?? '')
    const robotIds = robots.filter((robot) => robot.location === hall).map((robot) => robot.id)

    return {
      label: hall,
      robotIds,
    }
  }

  if (targetMode === 'custom') {
    const robotIds = formData.getAll('robot_ids').map(String)

    return {
      label: `${robotIds.length} selected robots`,
      robotIds,
    }
  }

  const robotId = String(formData.get('robot_id') ?? '')
  const robot = robots.find((item) => item.id === robotId)

  return {
    label: robot ? `${robot.name} / ${robot.assetId}` : undefined,
    robotIds: robotId ? [robotId] : [],
  }
}
