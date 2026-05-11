import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { seededConversations } from '../data/conversations'
import type { Conversation, ConversationTopic } from '../types/conversation'
import { useCurrentUser } from '../users/UserProvider'

const storageKey = 'robot-check-created-conversations'

type CreateConversationInput = {
  lastMessage: string
  robotId: string
  subject: string
  topic: ConversationTopic
}

type ConversationsContextValue = {
  addReply: (conversationId: string, message: string) => void
  conversations: Conversation[]
  createConversation: (input: CreateConversationInput) => void
  getOpenCount: (conversations?: Conversation[]) => number
  getUnreadCount: (conversations?: Conversation[]) => number
  getRobotConversations: (robotId: string) => Conversation[]
  resolveConversation: (conversationId: string) => void
}

const ConversationsContext = createContext<ConversationsContextValue | undefined>(undefined)

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useCurrentUser()
  const [createdConversations, setCreatedConversations] = useState<Conversation[]>(() => readCreatedConversations())
  const [conversationReplies, setConversationReplies] = useState<Record<string, Conversation['messages']>>({})
  const [resolvedIds, setResolvedIds] = useState<string[]>([])
  const conversations = useMemo(
    () =>
      [...createdConversations, ...seededConversations].map((conversation) => {
        const messages = [...(conversation.messages ?? []), ...(conversationReplies[conversation.id] ?? [])]
        const latestMessage = messages[messages.length - 1]
        const nextConversation = {
          ...conversation,
          lastMessage: latestMessage?.message ?? conversation.lastMessage,
          lastMessageBy: latestMessage?.sender ?? conversation.lastMessageBy,
          messages,
        }

        return resolvedIds.includes(conversation.id)
          ? { ...nextConversation, status: 'resolved' as const, unreadCount: 0 }
          : nextConversation
      }),
    [conversationReplies, createdConversations, resolvedIds],
  )

  const addReply = useCallback((conversationId: string, message: string) => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      return
    }

    setConversationReplies((currentReplies) => ({
      ...currentReplies,
      [conversationId]: [
        ...(currentReplies[conversationId] ?? []),
        {
          id: `MSG-${Date.now()}`,
          message: trimmedMessage,
          sender: currentUser.name,
          time: formatDateTime(new Date()),
        },
      ],
    }))
  }, [currentUser.name])

  const createConversation = useCallback((input: CreateConversationInput) => {
    setCreatedConversations((currentConversations) => {
      const conversation: Conversation = {
        ...input,
        createdAt: formatDateTime(new Date()),
        createdBy: currentUser.name,
        id: `CON-${Date.now()}`,
        lastMessageBy: currentUser.name,
        messages: [
          {
            id: `MSG-${Date.now()}`,
            message: input.lastMessage,
            sender: currentUser.name,
            time: formatDateTime(new Date()),
          },
        ],
        status: 'open',
        unreadCount: 0,
      }
      const nextConversations = [conversation, ...currentConversations]
      localStorage.setItem(storageKey, JSON.stringify(nextConversations))

      return nextConversations
    })
  }, [currentUser.name])

  const resolveConversation = useCallback((conversationId: string) => {
    setResolvedIds((currentIds) => (currentIds.includes(conversationId) ? currentIds : [...currentIds, conversationId]))
  }, [])

  const value = useMemo<ConversationsContextValue>(
    () => ({
      addReply,
      conversations,
      createConversation,
      getOpenCount: (items = conversations) => items.filter((conversation) => conversation.status === 'open').length,
      getUnreadCount: (items = conversations) =>
        items.reduce((sum, conversation) => sum + (conversation.status === 'open' ? conversation.unreadCount : 0), 0),
      getRobotConversations: (robotId) => conversations.filter((conversation) => conversation.robotId === robotId),
      resolveConversation,
    }),
    [addReply, conversations, createConversation, resolveConversation],
  )

  return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>
}

export function useConversations() {
  const context = useContext(ConversationsContext)

  if (!context) {
    throw new Error('useConversations must be used inside ConversationsProvider')
  }

  return context
}

function readCreatedConversations() {
  try {
    const storedValue = localStorage.getItem(storageKey)

    if (!storedValue) {
      return []
    }

    const parsedValue = JSON.parse(storedValue)

    return Array.isArray(parsedValue) ? parsedValue.filter(isConversation) : []
  } catch {
    return []
  }
}

function isConversation(value: unknown): value is Conversation {
  if (!value || typeof value !== 'object') {
    return false
  }

  const conversation = value as Conversation

  return typeof conversation.id === 'string' && typeof conversation.subject === 'string'
}

function formatDateTime(date: Date) {
  return `${date.toISOString().slice(0, 10)} ${date.toTimeString().slice(0, 5)}`
}
