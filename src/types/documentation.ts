import type { RobotOptic } from './robot'

export type DocumentType =
  | 'setup'
  | 'program'
  | 'bauteil'
  | 'optic'
  | 'quality'
  | 'maintenance'
  | 'troubleshooting'

export type RobotDocument = {
  id: string
  title: string
  description: string
  type: DocumentType
  robotIds: string[]
  customer: string
  project: string
  bauteil?: string
  optic?: RobotOptic
  programNumber?: string
  version: string
  updatedBy: string
  updatedAt: string
  fileLabel: string
}
