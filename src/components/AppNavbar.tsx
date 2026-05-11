import { LogOut } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useConversations } from '../conversations/ConversationsProvider'
import { useLanguage } from '../i18n/LanguageProvider'
import type { TranslationKey } from '../i18n/translations'
import { useImportantUpdates } from '../updates/ImportantUpdatesProvider'
import { useUpdateConfirmations } from '../updates/UpdateConfirmationsProvider'
import { useCurrentUser } from '../users/UserProvider'
import { LanguageMenu } from './LanguageMenu'
import { LogoMark } from './LogoMark'

const navItems = [
  { labelKey: 'common.robots', roles: ['Operator', 'Supervisor', 'Admin'], to: '/robots' },
  { labelKey: 'common.updates', roles: ['Operator', 'Supervisor', 'Admin'], showBadge: true, to: '/updates' },
  { labelKey: 'common.messages', roles: ['Operator', 'Supervisor', 'Admin'], showMessageBadge: true, to: '/messages' },
  { labelKey: 'common.analytics', roles: ['Supervisor', 'Admin'], to: '/analytics' },
  { labelKey: 'common.history', roles: ['Supervisor', 'Admin'], to: '/history' },
  { labelKey: 'common.maintenance', roles: ['Supervisor', 'Admin'], to: '/maintenance' },
  { labelKey: 'common.documentation', roles: ['Supervisor', 'Admin'], to: '/docs' },
  { labelKey: 'common.admin', roles: ['Admin'], to: '/admin/robots' },
] satisfies {
  labelKey: TranslationKey
  roles: string[]
  showBadge?: boolean
  showMessageBadge?: boolean
  to: string
}[]

export function AppNavbar() {
  const { t } = useLanguage()
  const { currentUser } = useCurrentUser()
  const { getUnreadCount } = useConversations()
  const { updates } = useImportantUpdates()
  const { getUnreadCount: getUnreadUpdateCount } = useUpdateConfirmations()
  const unreadUpdateCount = getUnreadUpdateCount(updates)
  const unreadMessageCount = getUnreadCount()
  const visibleNavItems = navItems.filter((item) => item.roles.includes(currentUser.role))

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/robots" className="flex items-center gap-3">
            <LogoMark size="sm" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                {t('brand.company')}
              </p>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-normal text-slate-950">{t('app.title')}</h1>
                <span className="rounded-xl bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-600">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {visibleNavItems.map((item) => (
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `inline-flex h-9 items-center rounded-xl px-3 text-sm font-black transition ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`
              }
              key={item.to}
            >
              {t(item.labelKey)}
              {item.showBadge && unreadUpdateCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-black text-white">
                  {unreadUpdateCount}
                </span>
              )}
              {item.showMessageBadge && unreadMessageCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-700 px-1.5 text-[11px] font-black text-white">
                  {unreadMessageCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageMenu />
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {t('action.logout')}
          </Link>
        </div>
      </div>
    </header>
  )
}
