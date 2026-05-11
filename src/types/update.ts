import type { RobotOptic } from './robot'

export type UpdateSeverity = 'info' | 'important' | 'critical' | 'stop_work'

export type UpdateTargetType = 'robots' | 'hall'

export type ImportantUpdate = {
  id: string
  title: string
  message: string
  severity: UpdateSeverity
  robotIds: string[]
  targetLabel?: string
  targetType?: UpdateTargetType
  optic?: RobotOptic
  customer?: string
  project?: string
  bauteil?: string
  createdBy: string
  createdAt: string
  expiresAt?: string
  requiresConfirmation: boolean
  confirmedBy: string[]
}
