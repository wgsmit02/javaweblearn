// These types mirror the Java entity and DTO exactly.
// TypeScript will warn you if you try to use a field that doesn't exist.

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

// What the API returns
export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  priority: Priority
  createdAt: string
  updatedAt: string
}

// What we send when creating or updating a task
export interface TaskRequest {
  title: string
  description?: string
  completed?: boolean
  priority?: Priority
}
