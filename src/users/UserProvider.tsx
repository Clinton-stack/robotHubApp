import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { defaultDemoUser, demoUsers } from '../data/currentUser'
import type { DemoUser } from '../data/currentUser'

const storageKey = 'robot-check-demo-user-id'

type UserContextValue = {
  currentUser: DemoUser
  setCurrentUserId: (userId: string) => void
  users: DemoUser[]
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserIdState] = useState(() => readStoredUserId())
  const currentUser = demoUsers.find((user) => user.id === currentUserId) ?? defaultDemoUser

  const setCurrentUserId = useCallback((userId: string) => {
    const nextUser = demoUsers.find((user) => user.id === userId)

    if (!nextUser) {
      return
    }

    localStorage.setItem(storageKey, nextUser.id)
    setCurrentUserIdState(nextUser.id)
  }, [])

  const value = useMemo<UserContextValue>(
    () => ({
      currentUser,
      setCurrentUserId,
      users: demoUsers,
    }),
    [currentUser, setCurrentUserId],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useCurrentUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useCurrentUser must be used inside UserProvider')
  }

  return context
}

function readStoredUserId() {
  try {
    const storedUserId = localStorage.getItem(storageKey)

    return demoUsers.some((user) => user.id === storedUserId) ? storedUserId : defaultDemoUser.id
  } catch {
    return defaultDemoUser.id
  }
}
