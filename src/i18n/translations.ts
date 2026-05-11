export const languages = ['GE', 'EN', 'PL'] as const

export type Language = (typeof languages)[number]

export type TranslationKey =
  | 'action.cancel'
  | 'action.export'
  | 'action.logout'
  | 'action.openRobot'
  | 'action.startRoutineCheck'
  | 'action.newRoutineCheck'
  | 'action.viewHistory'
  | 'app.title'
  | 'brand.company'
  | 'common.admin'
  | 'common.analytics'
  | 'common.history'
  | 'common.updates'
  | 'common.importantUpdates'
  | 'common.documentation'
  | 'common.maintenance'
  | 'common.messages'
  | 'common.robotGrid'
  | 'common.robots'
  | 'common.searchRobots'
  | 'common.statusGreen'
  | 'common.statusRed'
  | 'common.statusYellow'
  | 'status.green'
  | 'status.red'
  | 'status.yellow'
  | 'common.routineChecks'
  | 'common.currentShift'
  | 'common.lastInspection'
  | 'common.healthScore'
  | 'common.openIssues'
  | 'robotGrid.title'
  | 'robotGrid.description'
  | 'robotGrid.currentShiftValue'
  | 'robotGrid.robotsAssigned'
  | 'robotCard.openIssue'
  | 'robotCard.openIssues'
  | 'dashboard.quickActions'
  | 'dashboard.recentIssues'
  | 'dashboard.reportedProblems'
  | 'dashboard.noRecentIssues'
  | 'dashboard.shiftHandover'
  | 'dashboard.latestMessages'
  | 'dashboard.noShiftMessages'
  | 'dashboard.optic'
  | 'dashboard.laserPower'
  | 'dashboard.opticTrend'
  | 'dashboard.laserTrendHelp'
  | 'dashboard.both'
  | 'dashboard.byShift'
  | 'dashboard.daily'
  | 'dashboard.weekly'
  | 'dashboard.monthly'
  | 'dashboard.report'
  | 'dashboard.stop'
  | 'dashboard.latestReading'
  | 'dashboard.reportBelow'
  | 'dashboard.stopBelow'
  | 'dashboard.stable'
  | 'dashboard.noData'
  | 'dashboard.routineQuality'
  | 'dashboard.qualitySummary'
  | 'dashboard.correctedDuringRoutine'
  | 'dashboard.failedNotOk'
  | 'dashboard.correctedNa'
  | 'dashboard.failed'
  | 'dashboard.thresholdEvents'
  | 'dashboard.reportStopReadings'
  | 'dashboard.reportEvents'
  | 'dashboard.hardStops'
  | 'dashboard.noThresholdEvents'

export const translations: Record<Language, Record<TranslationKey, string>> = {
  EN: {
    'action.cancel': 'Cancel',
    'action.export': 'Export',
    'action.logout': 'Logout',
    'action.openRobot': 'Open Robot',
    'action.startRoutineCheck': 'Start Routine Check',
    'action.newRoutineCheck': 'New Routine Check',
    'action.viewHistory': 'View History',
    'app.title': 'Photon Robot Hub',
    'brand.company': 'Photon Laser Manufacturing Company',
    'common.admin': 'Admin',
    'common.analytics': 'Analytics',
    'common.currentShift': 'Current shift',
    'common.healthScore': 'Health score',
    'common.history': 'History',
    'common.updates': 'Updates',
    'common.importantUpdates': 'Important Updates',
    'common.documentation': 'Documentation',
    'common.lastInspection': 'Last inspection',
    'common.maintenance': 'Maintenance',
    'common.messages': 'Messages',
    'common.openIssues': 'Open issues',
    'common.robotGrid': 'Robot Grid',
    'common.robots': 'Robots',
    'common.routineChecks': 'Routine checks',
    'common.searchRobots': 'Search Freya, AP2345, Halle 2',
    'common.statusGreen': 'Green status',
    'common.statusRed': 'Red status',
    'common.statusYellow': 'Yellow status',
    'status.green': 'Green',
    'status.red': 'Red',
    'status.yellow': 'Yellow',
    'robotCard.openIssue': 'open issue',
    'robotCard.openIssues': 'open issues',
    'robotGrid.currentShiftValue': 'Morning shift / 06:00 - 14:00',
    'robotGrid.description': 'Review AP asset IDs, cabin location, current health, and open issues before starting a routine check.',
    'robotGrid.robotsAssigned': 'robots assigned',
    'robotGrid.title': 'Select a robot',
    'dashboard.both': 'Both',
    'dashboard.byShift': 'By shift',
    'dashboard.correctedDuringRoutine': 'Corrected during routine',
    'dashboard.correctedNa': 'Corrected / N/A',
    'dashboard.daily': 'Daily',
    'dashboard.failed': 'Failed',
    'dashboard.failedNotOk': 'Failed / not OK',
    'dashboard.hardStops': 'Hard stops',
    'dashboard.laserPower': 'Laser power',
    'dashboard.laserTrendHelp': 'Use shift view for routine detail, then switch to daily, weekly, or monthly to see whether the optic is drifting.',
    'dashboard.latestMessages': 'Latest messages',
    'dashboard.latestReading': 'Latest reading',
    'dashboard.monthly': 'Monthly',
    'dashboard.noData': 'No data',
    'dashboard.noRecentIssues': 'No recent issues reported for this robot.',
    'dashboard.noShiftMessages': 'No shift messages for this robot yet.',
    'dashboard.noThresholdEvents': 'No laser threshold events for this robot.',
    'dashboard.optic': 'optic',
    'dashboard.opticTrend': 'Optic trend and thresholds',
    'dashboard.qualitySummary': 'OK, corrected, failed',
    'dashboard.quickActions': 'Quick actions',
    'dashboard.recentIssues': 'Recent issues',
    'dashboard.report': 'Report',
    'dashboard.reportBelow': 'Report below',
    'dashboard.reportEvents': 'Report events',
    'dashboard.reportStopReadings': 'Report and stop readings',
    'dashboard.reportedProblems': 'Reported problems',
    'dashboard.routineQuality': 'Routine quality',
    'dashboard.shiftHandover': 'Shift handover',
    'dashboard.stable': 'Stable',
    'dashboard.stop': 'Stop',
    'dashboard.stopBelow': 'Stop below',
    'dashboard.thresholdEvents': 'Threshold events',
    'dashboard.weekly': 'Weekly',
  },
  GE: {
    'action.cancel': 'Abbrechen',
    'action.export': 'Exportieren',
    'action.logout': 'Abmelden',
    'action.openRobot': 'Roboter öffnen',
    'action.startRoutineCheck': 'Routineprüfung starten',
    'action.newRoutineCheck': 'Neue Routineprüfung',
    'action.viewHistory': 'Historie anzeigen',
    'app.title': 'Photon Robot Hub',
    'brand.company': 'Photon Laser Manufacturing Company',
    'common.admin': 'Admin',
    'common.analytics': 'Analyse',
    'common.currentShift': 'Aktuelle Schicht',
    'common.healthScore': 'Gesundheitswert',
    'common.history': 'Historie',
    'common.updates': 'Updates',
    'common.importantUpdates': 'Wichtige Updates',
    'common.documentation': 'Dokumentation',
    'common.lastInspection': 'Letzte Prüfung',
    'common.maintenance': 'Wartung',
    'common.messages': 'Nachrichten',
    'common.openIssues': 'Offene Probleme',
    'common.robotGrid': 'Roboterübersicht',
    'common.robots': 'Roboter',
    'common.routineChecks': 'Routineprüfungen',
    'common.searchRobots': 'Suche Freya, AP2345, Halle 2',
    'common.statusGreen': 'Grüner Status',
    'common.statusRed': 'Roter Status',
    'common.statusYellow': 'Gelber Status',
    'status.green': 'Grün',
    'status.red': 'Rot',
    'status.yellow': 'Gelb',
    'robotCard.openIssue': 'offenes Problem',
    'robotCard.openIssues': 'offene Probleme',
    'robotGrid.currentShiftValue': 'Frühschicht / 06:00 - 14:00',
    'robotGrid.description': 'AP-Anlagen-IDs, Kabinenstandort, aktuellen Zustand und offene Probleme vor der Routineprüfung prüfen.',
    'robotGrid.robotsAssigned': 'Roboter zugewiesen',
    'robotGrid.title': 'Roboter auswählen',
    'dashboard.both': 'Beide',
    'dashboard.byShift': 'Nach Schicht',
    'dashboard.correctedDuringRoutine': 'Während der Routine korrigiert',
    'dashboard.correctedNa': 'Korrigiert / n. v.',
    'dashboard.daily': 'Täglich',
    'dashboard.failed': 'Fehlgeschlagen',
    'dashboard.failedNotOk': 'Fehler / nicht OK',
    'dashboard.hardStops': 'Arbeitsstopps',
    'dashboard.laserPower': 'Laserleistung',
    'dashboard.laserTrendHelp': 'Schichtansicht für Routinedetails nutzen; täglich, wöchentlich oder monatlich zeigt, ob die Optik driftet.',
    'dashboard.latestMessages': 'Neueste Nachrichten',
    'dashboard.latestReading': 'Letzter Messwert',
    'dashboard.monthly': 'Monatlich',
    'dashboard.noData': 'Keine Daten',
    'dashboard.noRecentIssues': 'Keine aktuellen Probleme für diesen Roboter gemeldet.',
    'dashboard.noShiftMessages': 'Noch keine Schichtnachrichten für diesen Roboter.',
    'dashboard.noThresholdEvents': 'Keine Laser-Grenzwertmeldungen für diesen Roboter.',
    'dashboard.optic': 'Optik',
    'dashboard.opticTrend': 'Optiktrend und Grenzwerte',
    'dashboard.qualitySummary': 'OK, korrigiert, fehlerhaft',
    'dashboard.quickActions': 'Schnellaktionen',
    'dashboard.recentIssues': 'Aktuelle Probleme',
    'dashboard.report': 'Melden',
    'dashboard.reportBelow': 'Melden unter',
    'dashboard.reportEvents': 'Meldungen',
    'dashboard.reportStopReadings': 'Melde- und Stoppwerte',
    'dashboard.reportedProblems': 'Gemeldete Probleme',
    'dashboard.routineQuality': 'Routinequalität',
    'dashboard.shiftHandover': 'Schichtübergabe',
    'dashboard.stable': 'Stabil',
    'dashboard.stop': 'Stopp',
    'dashboard.stopBelow': 'Stopp unter',
    'dashboard.thresholdEvents': 'Grenzwertmeldungen',
    'dashboard.weekly': 'Wöchentlich',
  },
  PL: {
    'action.cancel': 'Cancel',
    'action.export': 'Export',
    'action.logout': 'Logout',
    'action.openRobot': 'Open Robot',
    'action.startRoutineCheck': 'Start Routine Check',
    'action.newRoutineCheck': 'New Routine Check',
    'action.viewHistory': 'View History',
    'app.title': 'Photon Robot Hub',
    'brand.company': 'Photon Laser Manufacturing Company',
    'common.admin': 'Admin',
    'common.analytics': 'Analytics',
    'common.currentShift': 'Current shift',
    'common.healthScore': 'Health score',
    'common.history': 'History',
    'common.updates': 'Updates',
    'common.importantUpdates': 'Important Updates',
    'common.documentation': 'Documentation',
    'common.lastInspection': 'Last inspection',
    'common.maintenance': 'Maintenance',
    'common.messages': 'Messages',
    'common.openIssues': 'Open issues',
    'common.robotGrid': 'Robot Grid',
    'common.robots': 'Robots',
    'common.routineChecks': 'Routine checks',
    'common.searchRobots': 'Search Freya, AP2345, Halle 2',
    'common.statusGreen': 'Green status',
    'common.statusRed': 'Red status',
    'common.statusYellow': 'Yellow status',
    'status.green': 'Green',
    'status.red': 'Red',
    'status.yellow': 'Yellow',
    'robotCard.openIssue': 'open issue',
    'robotCard.openIssues': 'open issues',
    'robotGrid.currentShiftValue': 'Morning shift / 06:00 - 14:00',
    'robotGrid.description': 'Review AP asset IDs, cabin location, current health, and open issues before starting a routine check.',
    'robotGrid.robotsAssigned': 'robots assigned',
    'robotGrid.title': 'Select a robot',
    'dashboard.both': 'Both',
    'dashboard.byShift': 'By shift',
    'dashboard.correctedDuringRoutine': 'Corrected during routine',
    'dashboard.correctedNa': 'Corrected / N/A',
    'dashboard.daily': 'Daily',
    'dashboard.failed': 'Failed',
    'dashboard.failedNotOk': 'Failed / not OK',
    'dashboard.hardStops': 'Hard stops',
    'dashboard.laserPower': 'Laser power',
    'dashboard.laserTrendHelp': 'Use shift view for routine detail, then switch to daily, weekly, or monthly to see whether the optic is drifting.',
    'dashboard.latestMessages': 'Latest messages',
    'dashboard.latestReading': 'Latest reading',
    'dashboard.monthly': 'Monthly',
    'dashboard.noData': 'No data',
    'dashboard.noRecentIssues': 'No recent issues reported for this robot.',
    'dashboard.noShiftMessages': 'No shift messages for this robot yet.',
    'dashboard.noThresholdEvents': 'No laser threshold events for this robot.',
    'dashboard.optic': 'optic',
    'dashboard.opticTrend': 'Optic trend and thresholds',
    'dashboard.qualitySummary': 'OK, corrected, failed',
    'dashboard.quickActions': 'Quick actions',
    'dashboard.recentIssues': 'Recent issues',
    'dashboard.report': 'Report',
    'dashboard.reportBelow': 'Report below',
    'dashboard.reportEvents': 'Report events',
    'dashboard.reportStopReadings': 'Report and stop readings',
    'dashboard.reportedProblems': 'Reported problems',
    'dashboard.routineQuality': 'Routine quality',
    'dashboard.shiftHandover': 'Shift handover',
    'dashboard.stable': 'Stable',
    'dashboard.stop': 'Stop',
    'dashboard.stopBelow': 'Stop below',
    'dashboard.thresholdEvents': 'Threshold events',
    'dashboard.weekly': 'Weekly',
  },
}
