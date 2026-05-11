import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { importantUpdates } from '../data/importantUpdates'
import type { ImportantUpdate } from '../types/update'
import { useCurrentUser } from '../users/UserProvider'

const storageKey = 'robot-check-confirmed-updates'

type UpdateConfirmationsContextValue = {
  confirmUpdate: (updateId: string) => void
  getUnreadCount: (updates?: ImportantUpdate[]) => number
  isConfirmed: (update: ImportantUpdate) => boolean
}

const UpdateConfirmationsContext = createContext<UpdateConfirmationsContextValue | undefined>(undefined)

export function UpdateConfirmationsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useCurrentUser()
  const [confirmedIds, setConfirmedIds] = useState<string[]>(() => readConfirmedIds())

  const confirmUpdate = useCallback((updateId: string) => {
    setConfirmedIds((currentIds) => {
      if (currentIds.includes(updateId)) {
        return currentIds
      }

      const nextIds = [...currentIds, updateId]
      localStorage.setItem(storageKey, JSON.stringify(nextIds))

      return nextIds
    })
  }, [])

  const value = useMemo<UpdateConfirmationsContextValue>(() => {
    const isConfirmed = (update: ImportantUpdate) =>
      update.confirmedBy.includes(currentUser.name) || confirmedIds.includes(update.id)

    return {
      confirmUpdate,
      getUnreadCount: (updates = importantUpdates) =>
        updates.filter((update) => update.requiresConfirmation && !isConfirmed(update)).length,
      isConfirmed,
    }
  }, [confirmUpdate, confirmedIds, currentUser.name])

  return <UpdateConfirmationsContext.Provider value={value}>{children}</UpdateConfirmationsContext.Provider>
}

export function useUpdateConfirmations() {
  const context = useContext(UpdateConfirmationsContext)

  if (!context) {
    throw new Error('useUpdateConfirmations must be used inside UpdateConfirmationsProvider')
  }

  return context
}

function readConfirmedIds() {
  try {
    const storedValue = localStorage.getItem(storageKey)

    if (!storedValue) {
      return []
    }

    const parsedValue = JSON.parse(storedValue)

    return Array.isArray(parsedValue) ? parsedValue.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}
