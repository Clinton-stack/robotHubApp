import { CheckCircle2, MessageSquareText, Send } from 'lucide-react'
import { robots } from '../data/robots'
import type { Conversation } from '../types/conversation'

type ConversationCardProps = {
  conversation: Conversation
  onReply: (conversationId: string, message: string) => void
  onResolve: (conversationId: string) => void
}

const topicLabels: Record<Conversation['topic'], string> = {
  handover: 'Handover',
  maintenance: 'Maintenance',
  quality: 'Quality',
  robot_status: 'Robot status',
  update_question: 'Update question',
}

export function ConversationCard({ conversation, onReply, onResolve }: ConversationCardProps) {
  const robot = robots.find((item) => item.id === conversation.robotId)
  const isOpen = conversation.status === 'open'

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-xl px-2.5 py-1 text-xs font-black ${isOpen ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {isOpen ? 'Open' : 'Resolved'}
            </span>
            <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
              {topicLabels[conversation.topic]}
            </span>
            {conversation.unreadCount > 0 && (
              <span className="rounded-xl bg-red-50 px-2.5 py-1 text-xs font-black text-red-700">
                {conversation.unreadCount} unread
              </span>
            )}
          </div>
          <h2 className="mt-3 text-lg font-black text-slate-950">{conversation.subject}</h2>
          <p className="mt-1 text-xs font-bold text-blue-700">
            {robot?.name} / {robot?.assetId}
          </p>
        </div>

        {isOpen && (
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3.5 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
            onClick={() => onResolve(conversation.id)}
            type="button"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Resolve
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-slate-400">
          <MessageSquareText className="h-4 w-4" aria-hidden="true" />
          Group chat
        </p>
        {conversation.messages.slice(-3).map((message) => (
          <div className="rounded-xl bg-white p-3 shadow-sm" key={message.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-black text-slate-950">{message.sender}</p>
              <p className="text-xs font-bold text-slate-400">{message.time}</p>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-700">{message.message}</p>
          </div>
        ))}
      </div>

      {isOpen && (
        <form
          className="mt-3 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const message = String(formData.get('reply') ?? '')

            onReply(conversation.id, message)
            event.currentTarget.reset()
          }}
        >
          <input
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            name="reply"
            placeholder="Write a comment"
          />
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3.5 text-sm font-black text-white shadow-md shadow-blue-700/15 transition hover:bg-blue-800"
            type="submit"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Send
          </button>
        </form>
      )}

      <p className="mt-3 text-xs font-bold text-slate-400">
        Started by {conversation.createdBy} / {conversation.createdAt}
      </p>
    </article>
  )
}
