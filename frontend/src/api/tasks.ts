import type { Task, TaskRequest } from '../types/task'

const BASE = '/api/tasks'

// Read token from localStorage — same place AuthContext stores it
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: getAuthHeaders(),
    ...options,
  })
  // 401 = token expired or invalid — force a page reload to trigger logout
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    window.location.reload()
    throw new Error('Session expired')
  }
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const taskApi = {
  getAll: ()                              => http<Task[]>(BASE),
  getById: (id: number)                  => http<Task>(`${BASE}/${id}`),
  create: (data: TaskRequest)            => http<Task>(BASE, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: TaskRequest) => http<Task>(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggle: (id: number)                   => http<Task>(`${BASE}/${id}/toggle`, { method: 'PATCH' }),
  delete: (id: number)                   => http<void>(`${BASE}/${id}`, { method: 'DELETE' }),
}
