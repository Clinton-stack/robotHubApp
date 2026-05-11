import type { Conversation } from '../types/conversation'

export const seededConversations: Conversation[] = [
  {
    id: 'CON-1001',
    robotId: 'ap2345',
    subject: 'Confirm BEO program V18 before afternoon production',
    topic: 'update_question',
    status: 'open',
    createdBy: 'S. Neumann',
    createdAt: '2026-05-11 06:34',
    lastMessage: 'Please confirm the fixture position after the first sample and reply here if the operator needs support.',
    lastMessageBy: 'S. Neumann',
    messages: [
      {
        id: 'CON-1001-M1',
        sender: 'S. Neumann',
        message: 'Please confirm the fixture position after the first sample and reply here if the operator needs support.',
        time: '2026-05-11 06:34',
      },
      {
        id: 'CON-1001-M2',
        sender: 'A. Klein',
        message: 'I will check BEO after warm-up and send feedback before production.',
        time: '2026-05-11 06:48',
      },
    ],
    unreadCount: 2,
  },
  {
    id: 'CON-1002',
    robotId: 'ap2670',
    subject: 'Jana TCP correction follow-up',
    topic: 'maintenance',
    status: 'open',
    createdBy: 'S. Brandt',
    createdAt: '2026-05-10 22:18',
    lastMessage: 'TCP was corrected during night shift, but I want maintenance to verify the first run.',
    lastMessageBy: 'S. Brandt',
    messages: [
      {
        id: 'CON-1002-M1',
        sender: 'S. Brandt',
        message: 'TCP was corrected during night shift, but I want maintenance to verify the first run.',
        time: '2026-05-10 22:18',
      },
    ],
    unreadCount: 1,
  },
  {
    id: 'CON-1003',
    robotId: 'ap3421',
    subject: 'Kabine V clamping photos reviewed',
    topic: 'handover',
    status: 'resolved',
    createdBy: 'J. Roth',
    createdAt: '2026-05-10 04:05',
    lastMessage: 'New clamping photos are clear. No open questions for next shift.',
    lastMessageBy: 'T. Hoffmann',
    messages: [
      {
        id: 'CON-1003-M1',
        sender: 'J. Roth',
        message: 'Please check whether the new clamping photos are enough for the next shift.',
        time: '2026-05-10 04:05',
      },
      {
        id: 'CON-1003-M2',
        sender: 'T. Hoffmann',
        message: 'New clamping photos are clear. No open questions for next shift.',
        time: '2026-05-10 04:20',
      },
    ],
    unreadCount: 0,
  },
]
