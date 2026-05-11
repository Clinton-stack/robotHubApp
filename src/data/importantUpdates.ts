import type { ImportantUpdate, UpdateSeverity } from '../types/update'

export const importantUpdates: ImportantUpdate[] = [
  {
    id: 'UPD-1001',
    title: 'BEO program change for Bauteil P-4471',
    message:
      'BEO program version V18 is active for the afternoon shift. Operators must confirm the fixture position before production starts.',
    severity: 'critical',
    robotIds: ['ap2345', 'ap2418'],
    optic: 'BEO',
    customer: 'Meyer Automotive',
    project: 'Door rail weld cell',
    bauteil: 'P-4471',
    createdBy: 'S. Neumann',
    createdAt: '2026-05-11 06:20',
    requiresConfirmation: true,
    confirmedBy: ['A. Klein'],
  },
  {
    id: 'UPD-1002',
    title: 'ALO optic cleaning required before first run',
    message:
      'ALO lens inspection showed light residue during maintenance. Clean and document before starting the next routine check.',
    severity: 'important',
    robotIds: ['ap2670'],
    optic: 'ALO',
    customer: 'Internal',
    project: 'Optic stability review',
    createdBy: 'M. Weber',
    createdAt: '2026-05-10 21:45',
    requiresConfirmation: false,
    confirmedBy: [],
  },
  {
    id: 'UPD-1003',
    title: 'Stop work on Kabine B until release',
    message:
      'Cooling check failed twice on night shift. Kabine B must remain stopped until maintenance releases the robot.',
    severity: 'stop_work',
    robotIds: ['ap3159'],
    customer: 'Schmidt Systems',
    project: 'Frame cut batch',
    createdBy: 'L. Fischer',
    createdAt: '2026-05-10 23:10',
    requiresConfirmation: true,
    confirmedBy: [],
  },
  {
    id: 'UPD-1004',
    title: 'New documentation added for Kabine V',
    message:
      'Updated setup photos and clamping notes are available for the current customer project. Review before changing fixtures.',
    severity: 'info',
    robotIds: ['ap3421'],
    customer: 'Bauer Components',
    project: 'Carrier bracket weld',
    bauteil: 'BV-901',
    createdBy: 'T. Hoffmann',
    createdAt: '2026-05-09 14:30',
    requiresConfirmation: false,
    confirmedBy: [],
  },
]

export const blockingSeverities: UpdateSeverity[] = ['critical', 'stop_work']

export function getRobotUpdates(robotId: string) {
  return importantUpdates.filter((update) => update.robotIds.includes(robotId))
}

export function getUnreadUpdates() {
  return importantUpdates.filter((update) => update.requiresConfirmation && update.confirmedBy.length === 0)
}

export function getBlockingRobotUpdates(robotId: string) {
  return getRobotUpdates(robotId).filter((update) => blockingSeverities.includes(update.severity))
}
