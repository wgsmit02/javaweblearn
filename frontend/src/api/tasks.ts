import type { Task, TaskRequest } from '../types/task'

// All requests go to /api/tasks — Vite proxies this to Kong (port 8000) in dev.
const BASE = '/api/tasks'

// Helper: fetch + throw on non-OK HTTP status
async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || `HTTP ${res.status}`)
  }
  // 204 No Content (DELETE) has no body
  if (res.status === 204) return undefined as T
  return res.json()
}

export const taskApi = {
  getAll: ()                        => http<Task[]>(BASE),
  getById: (id: number)             => http<Task>(`${BASE}/${id}`),
  create: (data: TaskRequest)       => http<Task>(BASE, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: TaskRequest) => http<Task>(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggle: (id: number)              => http<Task>(`${BASE}/${id}/toggle`, { method: 'PATCH' }),
  delete: (id: number)              => http<void>(`${BASE}/${id}`, { method: 'DELETE' }),
}
