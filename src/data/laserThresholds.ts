import type { RobotOptic } from '../types/robot'

export type LaserThreshold = {
  reportBelow: number
  stopBelow: number
}

export const laserThresholds: Record<RobotOptic, LaserThreshold> = {
  ALO: {
    reportBelow: 3200,
    stopBelow: 2800,
  },
  BEO: {
    reportBelow: 3600,
    stopBelow: 3200,
  },
}
