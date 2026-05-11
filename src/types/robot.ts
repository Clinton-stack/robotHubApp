export type RobotStatus = 'ok' | 'warning' | 'critical'

export type RobotType = 'Laser Welding' | 'Laser Cutting'

export type RobotOptic = 'ALO' | 'BEO'

export type Robot = {
  id: string
  assetId: string
  name: string
  imageUrl?: string
  type: RobotType
  optics: RobotOptic[]
  location: string
  status: RobotStatus
  lastInspection: string
  healthScore: number
  openIssues: number
}
