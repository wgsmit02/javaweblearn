import { useEffect, useState } from 'react'
import type { Task, TaskRequest } from './types/task'
import { taskApi } from './api/tasks'
import { TaskCard } from './components/TaskCard'
import { TaskForm } from './components/TaskForm'
import { useToast } from './context/ToastContext'
import { useAuth } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'

export default function App() {
  const { showToast } = useToast()
  const { token, username, logout } = useAuth()

  // Show login page if not authenticated
  if (!token) return <LoginPage />

  const [tasks, setTasks]       = useState<Task[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter]     = useState<'all' | 'active' | 'done'>('all')

  useEffect(() => { loadTasks() }, [])

  async function loadTasks() {
    try {
      setLoading(true)
      setTasks(await taskApi.getAll())
    } catch {
      showToast('Failed to load tasks. Is the API running?', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(data: TaskRequest) {
    try {
      const created = await taskApi.create(data)
      setTasks(prev => [created, ...prev])
      setShowForm(false)
      showToast('Task created!', 'success')
    } catch {
      showToast('Failed to create task.', 'error')
    }
  }

  async function handleUpdate(id: number, data: TaskRequest) {
    try {
      const updated = await taskApi.update(id, data)
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
      showToast('Task updated.', 'success')
    } catch {
      showToast('Failed to update task.', 'error')
    }
  }

  async function handleToggle(id: number) {
    try {
      const updated = await taskApi.toggle(id)
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
    } catch {
      showToast('Failed to update task.', 'error')
    }
  }

  async function handleDelete(id: number) {
    try {
      await taskApi.delete(id)
      setTasks(prev => prev.filter(t => t.id !== id))
      showToast('Task deleted.', 'info')
    } catch {
      showToast('Failed to delete task.', 'error')
    }
  }

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done')   return t.completed
    return true
  })

  const counts = {
    all:    tasks.length,
    active: tasks.filter(t => !t.completed).length,
    done:   tasks.filter(t =>  t.completed).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <p className="text-sm text-gray-400 mt-1">Hi, {username} · Powered by Spring Boot + Kong</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(v => !v)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showForm ? 'Cancel' : '+ New Task'}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6">
            <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
          {(['all', 'active', 'done'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${
                filter === f ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f} <span className="text-xs">({counts[f]})</span>
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-gray-400 py-12">Loading tasks...</p>}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            {filter === 'all' ? 'No tasks yet — create one above!' : `No ${filter} tasks.`}
          </p>
        )}

        {!loading && (
          <div className="flex flex-col gap-3">
            {filtered.map(task => (
              <TaskCard key={task.id} task={task}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
