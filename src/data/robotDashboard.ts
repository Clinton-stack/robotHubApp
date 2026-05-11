export type DashboardIssue = {
  id: string
  robotId: string
  severity: 'warning' | 'critical'
  title: string
  detail: string
  time: string
}

export type ShiftMessage = {
  id: string
  robotId: string
  shift: 'Morning' | 'Afternoon' | 'Night'
  operator: string
  message: string
  time: string
}

export type TrendPoint = {
  label: string
  value: number
}

export const dashboardIssues: DashboardIssue[] = [
  {
    id: 'issue-1',
    robotId: 'ap2418',
    severity: 'warning',
    title: 'Laser power drift',
    detail: 'Power dropped below target twice during warm-up.',
    time: 'Today, 05:54',
  },
  {
    id: 'issue-2',
    robotId: 'ap2670',
    severity: 'critical',
    title: 'TCP check failed',
    detail: 'TCP deviation above tolerance. Supervisor review needed.',
    time: 'Yesterday, 22:10',
  },
  {
    id: 'issue-3',
    robotId: 'ap2670',
    severity: 'warning',
    title: 'Cooling flow unstable',
    detail: 'Cooling OK after restart, monitor during next shift.',
    time: 'Yesterday, 21:46',
  },
  {
    id: 'issue-4',
    robotId: 'ap3159',
    severity: 'warning',
    title: 'Gas pressure low',
    detail: 'Pressure recovered after bottle change.',
    time: 'Today, 04:42',
  },
  {
    id: 'issue-5',
    robotId: 'ap3421',
    severity: 'warning',
    title: 'Drahtlage needs attention',
    detail: 'Wire position slightly offset after first sample.',
    time: 'Today, 03:58',
  },
]

export const shiftMessages: ShiftMessage[] = [
  {
    id: 'message-1',
    robotId: 'ap2345',
    shift: 'Morning',
    operator: 'M. Weber',
    message: 'Freya checked cleanly. No follow-up needed.',
    time: 'Today, 06:20',
  },
  {
    id: 'message-2',
    robotId: 'ap2418',
    shift: 'Morning',
    operator: 'A. Klein',
    message: 'Donna had slight laser power movement. Please watch first production run.',
    time: 'Today, 06:02',
  },
  {
    id: 'message-3',
    robotId: 'ap2670',
    shift: 'Night',
    operator: 'S. Brandt',
    message: 'Jana TCP failed at handover. Do not release before supervisor check.',
    time: 'Yesterday, 22:15',
  },
  {
    id: 'message-4',
    robotId: 'ap3159',
    shift: 'Morning',
    operator: 'L. Fischer',
    message: 'Kabine B gas check marked OK after follow-up. Recheck after one hour.',
    time: 'Today, 04:46',
  },
  {
    id: 'message-5',
    robotId: 'ap3421',
    shift: 'Night',
    operator: 'J. Roth',
    message: 'Kabine V Drahtlage corrected on ALO. BEO was not available for gas check.',
    time: 'Today, 03:59',
  },
  {
    id: 'message-6',
    robotId: 'ap3562',
    shift: 'Morning',
    operator: 'N. Braun',
    message: 'Gina ALO and BEO checks completed. Both optics ready.',
    time: 'Today, 06:48',
  },
]

export const laserPowerTrend: TrendPoint[] = [
  { label: 'Mon', value: 82 },
  { label: 'Tue', value: 86 },
  { label: 'Wed', value: 79 },
  { label: 'Thu', value: 88 },
  { label: 'Fri', value: 91 },
]

export const tcpStabilityTrend: TrendPoint[] = [
  { label: 'Mon', value: 92 },
  { label: 'Tue', value: 89 },
  { label: 'Wed', value: 84 },
  { label: 'Thu', value: 87 },
  { label: 'Fri', value: 90 },
]

export const failureFrequencyTrend: TrendPoint[] = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 20 },
  { label: 'Wed', value: 34 },
  { label: 'Thu', value: 18 },
  { label: 'Fri', value: 9 },
]
