import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { robotDocuments as seededDocuments } from '../data/robotDocuments'
import type { DocumentType, RobotDocument } from '../types/documentation'
import type { RobotOptic } from '../types/robot'
import { useCurrentUser } from '../users/UserProvider'

const storageKey = 'robot-check-created-documents'

export type CreateRobotDocumentInput = {
  bauteil?: string
  customer: string
  description: string
  fileLabel: string
  optic?: RobotOptic
  programNumber?: string
  project: string
  robotIds: string[]
  title: string
  type: DocumentType
  version: string
}

type RobotDocumentsContextValue = {
  createDocument: (input: CreateRobotDocumentInput) => void
  documents: RobotDocument[]
  getRobotDocuments: (robotId: string) => RobotDocument[]
}

const RobotDocumentsContext = createContext<RobotDocumentsContextValue | undefined>(undefined)

export function RobotDocumentsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useCurrentUser()
  const [createdDocuments, setCreatedDocuments] = useState<RobotDocument[]>(() => readCreatedDocuments())
  const documents = useMemo(() => [...createdDocuments, ...seededDocuments], [createdDocuments])

  const createDocument = useCallback((input: CreateRobotDocumentInput) => {
    setCreatedDocuments((currentDocuments) => {
      const document: RobotDocument = {
        ...input,
        id: `DOC-${Date.now()}`,
        updatedAt: new Date().toISOString().slice(0, 10),
        updatedBy: currentUser.name,
      }
      const nextDocuments = [document, ...currentDocuments]
      localStorage.setItem(storageKey, JSON.stringify(nextDocuments))

      return nextDocuments
    })
  }, [currentUser.name])

  const value = useMemo<RobotDocumentsContextValue>(
    () => ({
      createDocument,
      documents,
      getRobotDocuments: (robotId) => documents.filter((document) => document.robotIds.includes(robotId)),
    }),
    [createDocument, documents],
  )

  return <RobotDocumentsContext.Provider value={value}>{children}</RobotDocumentsContext.Provider>
}

export function useRobotDocuments() {
  const context = useContext(RobotDocumentsContext)

  if (!context) {
    throw new Error('useRobotDocuments must be used inside RobotDocumentsProvider')
  }

  return context
}

function readCreatedDocuments() {
  try {
    const storedValue = localStorage.getItem(storageKey)

    if (!storedValue) {
      return []
    }

    const parsedValue = JSON.parse(storedValue)

    return Array.isArray(parsedValue) ? parsedValue.filter(isRobotDocument) : []
  } catch {
    return []
  }
}

function isRobotDocument(value: unknown): value is RobotDocument {
  if (!value || typeof value !== 'object') {
    return false
  }

  const document = value as RobotDocument

  return typeof document.id === 'string' && typeof document.title === 'string' && Array.isArray(document.robotIds)
}
