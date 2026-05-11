export type ConversationStatus = 'open' | 'resolved'

export type ConversationTopic = 'robot_status' | 'update_question' | 'maintenance' | 'handover' | 'quality'

export type ConversationMessage = {
  id: string
  sender: string
  message: string
  time: string
}

export type Conversation = {
  id: string
  robotId: string
  subject: string
  topic: ConversationTopic
  status: ConversationStatus
  createdBy: string
  createdAt: string
  lastMessage: string
  lastMessageBy: string
  messages: ConversationMessage[]
  unreadCount: number
}
