import { CheckCircle2, MessageSquarePlus, MessageSquareText, Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppNavbar } from '../components/AppNavbar'
import { PageNav } from '../components/PageNav'
import { useConversations } from '../conversations/ConversationsProvider'
import { shiftMessages } from '../data/robotDashboard'
import { robots } from '../data/robots'
import { cardClassName, inputClassName, primaryButtonClassName } from '../styles/ui'
import type { Conversation, ConversationTopic } from '../types/conversation'
import { useCurrentUser } from '../users/UserProvider'

const topicLabels: Record<ConversationTopic, string> = {
  handover: 'Handover',
  maintenance: 'Maintenance',
  quality: 'Quality',
  robot_status: 'Robot status',
  update_question: 'Update question',
}

export function ShiftMessagesPage() {
  const { robotId } = useParams()
  const { addReply, conversations, createConversation, resolveConversation } = useConversations()
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>()
  const selectedRobot = robots.find((robot) => robot.id === robotId)
  const visibleMessages = selectedRobot
    ? shiftMessages.filter((message) => message.robotId === selectedRobot.id)
    : shiftMessages
  const visibleConversations = useMemo(
    () =>
      selectedRobot
        ? conversations.filter((conversation) => conversation.robotId === selectedRobot.id)
        : conversations,
    [conversations, selectedRobot],
  )
  const selectedConversation =
    visibleConversations.find((conversation) => conversation.id === selectedConversationId) ?? visibleConversations[0]
  const openConversationCount = visibleConversations.filter((conversation) => conversation.status === 'open').length

  return (
    <main className="min-h-svh bg-[#f7f9fc] text-slate-950">
      <AppNavbar />
      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-6">
        <PageNav label={selectedRobot ? 'Robot Dashboard' : 'Robot Grid'} to={selectedRobot ? `/robots/${selectedRobot.id}` : '/robots'} />

        <section className={`${cardClassName} mt-5 p-5 lg:p-6`}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Communication</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
                {selectedRobot ? `${selectedRobot.name} conversations` : 'Operator conversations'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Group-chat style conversations for robot status, update questions, maintenance follow-up, quality, and handover topics.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:w-[320px]">
              <SummaryTile label="Open" value={openConversationCount} />
              <SummaryTile label="Total" value={visibleConversations.length} />
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[340px_1fr]">
          <section className={`${cardClassName} overflow-hidden`}>
            <div className="border-b border-slate-100 p-4">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Conversations</p>
            </div>
            <div className="max-h-[620px] overflow-y-auto p-3">
              {visibleConversations.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">No conversations yet.</p>
              ) : (
                visibleConversations.map((conversation) => (
                  <ConversationListItem
                    conversation={conversation}
                    isSelected={conversation.id === selectedConversation?.id}
                    key={conversation.id}
                    onSelect={() => setSelectedConversationId(conversation.id)}
                  />
                ))
              )}
            </div>
          </section>

          <section className={`${cardClassName} overflow-hidden`}>
            {selectedConversation ? (
              <ConversationThread
                conversation={selectedConversation}
                onReply={addReply}
                onResolve={resolveConversation}
              />
            ) : (
              <div className="grid min-h-[420px] place-items-center p-6 text-center">
                <div>
                  <MessageSquareText className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold text-slate-500">Select or start a conversation.</p>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <CreateConversationPanel
            defaultRobotId={selectedRobot?.id}
            onCreate={(input) => {
              createConversation(input)
            }}
          />
          <ShiftHandoverFeed messages={visibleMessages} />
        </div>
      </section>
    </main>
  )
}

function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: Conversation
  isSelected: boolean
  onSelect: () => void
}) {
  const robot = robots.find((item) => item.id === conversation.robotId)

  return (
    <button
      className={`mb-2 w-full rounded-xl p-3 text-left transition ${
        isSelected ? 'bg-blue-50 ring-1 ring-blue-100' : 'bg-slate-50 hover:bg-slate-100'
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black text-slate-950">{conversation.subject}</p>
          <p className="mt-1 text-xs font-bold text-blue-700">
            {robot?.name} / {robot?.assetId}
          </p>
        </div>
        {conversation.unreadCount > 0 && (
          <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-black text-white">{conversation.unreadCount}</span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`rounded-xl px-2.5 py-1 text-xs font-black ${
          conversation.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-50 text-emerald-700'
        }`}>
          {conversation.status === 'open' ? 'Open' : 'Resolved'}
        </span>
        <span className="rounded-xl bg-white px-2.5 py-1 text-xs font-black text-slate-500">
          {topicLabels[conversation.topic]}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{conversation.lastMessage}</p>
    </button>
  )
}

function ConversationThread({
  conversation,
  onReply,
  onResolve,
}: {
  conversation: Conversation
  onReply: (conversationId: string, message: string) => void
  onResolve: (conversationId: string) => void
}) {
  const robot = robots.find((item) => item.id === conversation.robotId)
  const isOpen = conversation.status === 'open'
  const { currentUser } = useCurrentUser()

  return (
    <div className="flex min-h-[620px] flex-col">
      <div className="border-b border-slate-100 p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-xl px-2.5 py-1 text-xs font-black ${
                isOpen ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {isOpen ? 'Open' : 'Resolved'}
              </span>
              <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                {topicLabels[conversation.topic]}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{conversation.subject}</h2>
            <p className="mt-1 text-sm font-bold text-blue-700">
              {robot?.name} / {robot?.assetId} / Started by {conversation.createdBy}
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
      </div>

      <div className="grid flex-1 content-start gap-3 overflow-y-auto bg-slate-50 p-5">
        {conversation.messages.map((message) => {
          const isCurrentUser = message.sender === currentUser.name

          return (
            <article className={`max-w-[760px] rounded-2xl p-4 shadow-sm ${
              isCurrentUser ? 'ml-auto bg-blue-700 text-white' : 'bg-white text-slate-950'
            }`} key={message.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-black">{message.sender}</p>
                <p className={`text-xs font-bold ${isCurrentUser ? 'text-blue-100' : 'text-slate-400'}`}>{message.time}</p>
              </div>
              <p className={`mt-2 text-sm leading-6 ${isCurrentUser ? 'text-white' : 'text-slate-700'}`}>{message.message}</p>
            </article>
          )
        })}
      </div>

      {isOpen && (
        <form
          className="flex flex-col gap-3 border-t border-slate-100 bg-white p-4 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const message = String(formData.get('reply') ?? '')

            onReply(conversation.id, message)
            event.currentTarget.reset()
          }}
        >
          <input
            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            name="reply"
            placeholder="Write a comment"
          />
          <button className={`inline-flex items-center justify-center gap-2 ${primaryButtonClassName}`} type="submit">
            <Send className="h-4 w-4" aria-hidden="true" />
            Send
          </button>
        </form>
      )}
    </div>
  )
}

function CreateConversationPanel({
  defaultRobotId,
  onCreate,
}: {
  defaultRobotId?: string
  onCreate: (input: { lastMessage: string; robotId: string; subject: string; topic: ConversationTopic }) => void
}) {
  const { currentUser } = useCurrentUser()

  return (
    <section className={`${cardClassName} p-5 lg:p-6`}>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-white">
          <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">New conversation</p>
          <h2 className="text-xl font-black tracking-normal text-slate-950">Start a group chat</h2>
        </div>
      </div>

      <form
        className="mt-5 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const robot = String(formData.get('robot_id') ?? defaultRobotId ?? '')
          const subject = String(formData.get('subject') ?? '').trim()
          const message = String(formData.get('message') ?? '').trim()

          if (!robot || !subject || !message) {
            return
          }

          onCreate({
            lastMessage: message,
            robotId: robot,
            subject,
            topic: String(formData.get('topic')) as ConversationTopic,
          })
          event.currentTarget.reset()
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Topic
            <select className={inputClassName} name="topic" defaultValue="robot_status">
              <option value="robot_status">Robot status</option>
              <option value="update_question">Update question</option>
              <option value="maintenance">Maintenance</option>
              <option value="handover">Handover</option>
              <option value="quality">Quality</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Operator
            <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700 shadow-sm">
              {currentUser.name}
            </div>
          </label>
        </div>

        {!defaultRobotId && (
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Robot
            <select className={inputClassName} name="robot_id" defaultValue={robots[0]?.id}>
              {robots.map((robot) => (
                <option value={robot.id} key={robot.id}>
                  {robot.name} / {robot.assetId}
                </option>
              ))}
            </select>
          </label>
        )}

        {defaultRobotId && <input type="hidden" name="robot_id" value={defaultRobotId} />}

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Subject
          <input className={inputClassName} name="subject" placeholder="Example: Confirm BEO program before shift start" />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Message
          <textarea
            rows={5}
            name="message"
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            placeholder="Write the question, instruction, or shop-floor status."
          />
        </label>

        <button type="submit" className={`inline-flex items-center justify-center gap-2 ${primaryButtonClassName}`}>
          <Send className="h-5 w-5" aria-hidden="true" />
          Start conversation
        </button>
      </form>
    </section>
  )
}

function ShiftHandoverFeed({ messages }: { messages: typeof shiftMessages }) {
  return (
    <section className={`${cardClassName} p-5 lg:p-6`}>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Shift handover feed</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">{messages.length} handover messages</h2>
      </div>

      <div className="mt-4 grid gap-3">
        {messages.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">No shift messages yet.</p>
        ) : (
          messages.map((message) => {
            const robot = robots.find((item) => item.id === message.robotId)

            return (
              <article className="rounded-xl border border-slate-100 bg-slate-50 p-4" key={message.id}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-black text-slate-950">{robot?.name}</p>
                    <p className="mt-1 text-xs font-bold text-blue-700">{robot?.assetId}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-2xl bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                      {message.shift}
                    </span>
                    <span className="rounded-2xl bg-white px-3 py-1 text-xs font-black text-slate-500">
                      {message.time}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm font-bold text-slate-500">{message.operator}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{message.message}</p>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-blue-50 p-4 text-blue-700">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-black">{label}</p>
    </div>
  )
}
