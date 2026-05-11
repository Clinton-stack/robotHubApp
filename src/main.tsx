import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ConversationsProvider } from './conversations/ConversationsProvider.tsx'
import { RobotDocumentsProvider } from './documents/RobotDocumentsProvider.tsx'
import { LanguageProvider } from './i18n/LanguageProvider.tsx'
import { ImportantUpdatesProvider } from './updates/ImportantUpdatesProvider.tsx'
import { UpdateConfirmationsProvider } from './updates/UpdateConfirmationsProvider.tsx'
import { UserProvider } from './users/UserProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <LanguageProvider>
        <RobotDocumentsProvider>
          <ConversationsProvider>
            <ImportantUpdatesProvider>
              <UpdateConfirmationsProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </UpdateConfirmationsProvider>
            </ImportantUpdatesProvider>
          </ConversationsProvider>
        </RobotDocumentsProvider>
      </LanguageProvider>
    </UserProvider>
  </StrictMode>,
)
