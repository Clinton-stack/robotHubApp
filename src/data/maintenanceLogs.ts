import type { MaintenanceLog } from '../types/maintenance'

export const maintenanceLogs: MaintenanceLog[] = [
  {
    id: 'ML-2041',
    robotId: 'ap2670',
    date: '2026-05-06',
    issue: 'TCP deviation above tolerance',
    actionTaken: 'Fixture checked, TCP calibration scheduled before release.',
    technician: 'R. Hoffmann',
    status: 'in_progress',
  },
  {
    id: 'ML-2042',
    robotId: 'ap2418',
    date: '2026-05-07',
    issue: 'Laser power below report threshold',
    actionTaken: 'Lens cleaned and ALO/BEO power verified after warm-up.',
    technician: 'K. Schulz',
    status: 'completed',
  },
  {
    id: 'ML-2043',
    robotId: 'ap3421',
    date: '2026-05-07',
    issue: 'Drahtlage corrected during night shift',
    actionTaken: 'Wire guide inspected. Monitor next production run.',
    technician: 'J. Roth',
    status: 'open',
  },
  {
    id: 'ML-2044',
    robotId: 'ap3159',
    date: '2026-05-07',
    issue: 'Gas check marked not OK',
    actionTaken: 'Gas line checked, bottle connection replaced.',
    technician: 'L. Fischer',
    status: 'completed',
  },
]
