import { ArrowRight, CheckCircle2, MessageSquareText } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Conversation } from '../types/conversation'

type RobotConversationsPanelProps = {
  conversations: Conversation[]
  robotId: string
  onResolve: (conversationId: string) => void
}

const topicLabels: Record<Conversation['topic'], string> = {
  handover: 'Handover',
  maintenance: 'Maintenance',
  quality: 'Quality',
  robot_status: 'Robot status',
  update_question: 'Update question',
}

export function RobotConversationsPanel({ conversations, onResolve, robotId }: RobotConversationsPanelProps) {
  const openConversations = conversations.filter((conversation) => conversation.status === 'open')
  const latestConversations = conversations.slice(0, 3)
  const unreadCount = conversations.reduce((sum, conversation) => sum + conversation.unreadCount, 0)

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
            <MessageSquareText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Communication</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              {openConversations.length} open / {conversations.length} total
            </h2>
          </div>
        </div>

        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3.5 text-sm font-black text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800"
          to={`/robots/${robotId}/messages`}
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          <p className="text-xl font-black">{openConversations.length}</p>
          <p className="text-xs font-black">Open topics</p>
        </div>
        <div className="rounded-xl bg-red-50 p-3 text-red-700">
          <p className="text-xl font-black">{unreadCount}</p>
          <p className="text-xs font-black">Unread</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {latestConversations.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
            No conversations are linked to this robot yet.
          </p>
        ) : (
          latestConversations.map((conversation) => {
            const isOpen = conversation.status === 'open'

            return (
              <article className="rounded-xl bg-slate-50 p-4" key={conversation.id}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-xl px-2.5 py-1 text-xs font-black ${isOpen ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {isOpen ? 'Open' : 'Resolved'}
                      </span>
                      <span className="rounded-xl bg-white px-2.5 py-1 text-xs font-black text-slate-600">
                        {topicLabels[conversation.topic]}
                      </span>
                    </div>
                    <h3 className="mt-2 font-black text-slate-950">{conversation.subject}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{conversation.lastMessage}</p>
                  </div>
                  {isOpen && (
                    <button
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-2.5 py-1 text-xs font-black text-emerald-700"
                      onClick={() => onResolve(conversation.id)}
                      type="button"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Resolve
                    </button>
                  )}
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
