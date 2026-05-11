export type MaintenanceStatus = 'open' | 'in_progress' | 'completed'

export type MaintenanceLog = {
  id: string
  robotId: string
  date: string
  issue: string
  actionTaken: string
  technician: string
  status: MaintenanceStatus
}
