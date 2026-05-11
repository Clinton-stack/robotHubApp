import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { blockingSeverities, importantUpdates as seededUpdates } from '../data/importantUpdates'
import type { ImportantUpdate, UpdateSeverity } from '../types/update'
import { useCurrentUser } from '../users/UserProvider'

const storageKey = 'robot-check-created-updates'

export type CreateImportantUpdateInput = {
  bauteil?: string
  customer?: string
  message: string
  optic?: ImportantUpdate['optic']
  project?: string
  requiresConfirmation: boolean
  robotIds: string[]
  severity: UpdateSeverity
  targetLabel?: string
  targetType?: ImportantUpdate['targetType']
  title: string
}

type ImportantUpdatesContextValue = {
  createUpdate: (input: CreateImportantUpdateInput) => void
  getBlockingRobotUpdates: (robotId: string) => ImportantUpdate[]
  getRobotUpdates: (robotId: string) => ImportantUpdate[]
  updates: ImportantUpdate[]
}

const ImportantUpdatesContext = createContext<ImportantUpdatesContextValue | undefined>(undefined)

export function ImportantUpdatesProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useCurrentUser()
  const [createdUpdates, setCreatedUpdates] = useState<ImportantUpdate[]>(() => readCreatedUpdates())
  const updates = useMemo(() => [...createdUpdates, ...seededUpdates], [createdUpdates])

  const createUpdate = useCallback((input: CreateImportantUpdateInput) => {
    setCreatedUpdates((currentUpdates) => {
      const update: ImportantUpdate = {
        ...input,
        confirmedBy: [],
        createdAt: formatDateTime(new Date()),
        createdBy: currentUser.name,
        id: `UPD-${Date.now()}`,
      }
      const nextUpdates = [update, ...currentUpdates]
      localStorage.setItem(storageKey, JSON.stringify(nextUpdates))

      return nextUpdates
    })
  }, [currentUser.name])

  const value = useMemo<ImportantUpdatesContextValue>(
    () => ({
      createUpdate,
      getBlockingRobotUpdates: (robotId) =>
        updates.filter((update) => update.robotIds.includes(robotId) && blockingSeverities.includes(update.severity)),
      getRobotUpdates: (robotId) => updates.filter((update) => update.robotIds.includes(robotId)),
      updates,
    }),
    [createUpdate, updates],
  )

  return <ImportantUpdatesContext.Provider value={value}>{children}</ImportantUpdatesContext.Provider>
}

export function useImportantUpdates() {
  const context = useContext(ImportantUpdatesContext)

  if (!context) {
    throw new Error('useImportantUpdates must be used inside ImportantUpdatesProvider')
  }

  return context
}

function readCreatedUpdates() {
  try {
    const storedValue = localStorage.getItem(storageKey)

    if (!storedValue) {
      return []
    }

    const parsedValue = JSON.parse(storedValue)

    return Array.isArray(parsedValue) ? parsedValue.filter(isImportantUpdate) : []
  } catch {
    return []
  }
}

function isImportantUpdate(value: unknown): value is ImportantUpdate {
  if (!value || typeof value !== 'object') {
    return false
  }

  const update = value as ImportantUpdate

  return typeof update.id === 'string' && typeof update.title === 'string' && Array.isArray(update.robotIds)
}

function formatDateTime(date: Date) {
  const datePart = date.toISOString().slice(0, 10)
  const timePart = date.toTimeString().slice(0, 5)

  return `${datePart} ${timePart}`
}
