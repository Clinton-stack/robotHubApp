import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRobotsPage } from './pages/AdminRobotsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ImportantUpdatesPage } from './pages/ImportantUpdatesPage'
import { InspectionHistoryPage } from './pages/InspectionHistoryPage'
import { LoginPage } from './pages/LoginPage'
import { MaintenanceLogPage } from './pages/MaintenanceLogPage'
import { RobotDashboardPage } from './pages/RobotDashboardPage'
import { RobotDocumentsPage } from './pages/RobotDocumentsPage'
import { RobotGridPage } from './pages/RobotGridPage'
import { RoutineInspectionPage } from './pages/RoutineInspectionPage'
import { ShiftMessagesPage } from './pages/ShiftMessagesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/robots" element={<RobotGridPage />} />
      <Route path="/admin/robots" element={<AdminRobotsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/history" element={<InspectionHistoryPage />} />
      <Route path="/updates" element={<ImportantUpdatesPage />} />
      <Route path="/docs" element={<RobotDocumentsPage />} />
      <Route path="/maintenance" element={<MaintenanceLogPage />} />
      <Route path="/messages" element={<ShiftMessagesPage />} />
      <Route path="/robots/:robotId" element={<RobotDashboardPage />} />
      <Route path="/robots/:robotId/check" element={<RoutineInspectionPage />} />
      <Route path="/robots/:robotId/history" element={<InspectionHistoryPage />} />
      <Route path="/robots/:robotId/updates" element={<ImportantUpdatesPage />} />
      <Route path="/robots/:robotId/docs" element={<RobotDocumentsPage />} />
      <Route path="/robots/:robotId/analytics" element={<AnalyticsPage />} />
      <Route path="/robots/:robotId/maintenance" element={<MaintenanceLogPage />} />
      <Route path="/robots/:robotId/messages" element={<ShiftMessagesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
