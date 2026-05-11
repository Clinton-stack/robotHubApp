export type UserRole = 'Operator' | 'Supervisor' | 'Admin'

export type DemoUser = {
  id: string
  name: string
  role: UserRole
}

export const demoUsers = [
  {
    id: 'user-operator-01',
    name: 'M. Weber',
    role: 'Operator',
  },
  {
    id: 'user-supervisor-01',
    name: 'S. Keller',
    role: 'Supervisor',
  },
  {
    id: 'user-admin-01',
    name: 'A. Fischer',
    role: 'Admin',
  },
] satisfies DemoUser[]

export const defaultDemoUser = demoUsers[0]
