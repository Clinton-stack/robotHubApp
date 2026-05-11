import type { RobotOptic } from './robot'

export type Shift = 'Morning' | 'Afternoon' | 'Night'

export type CheckResult = 'ok' | 'corrected' | 'not_ok' | 'not_done'

export type SimpleCheckResult = 'ok' | 'not_ok' | 'not_available'

export type InspectionRecord = {
  id: string
  robotId: string
  date: string
  shift: Shift
  operator: string
  optic: RobotOptic
  tcpResult: CheckResult
  laserPower: number
  schussOk: boolean
  drahtlageResult: CheckResult
  coolingOk: boolean
  gasResult: SimpleCheckResult
  comments: string
}
