import { useEffect, useState } from 'react'
import type { Task, TaskRequest } from './types/task'
import { taskApi } from './api/tasks'
import { TaskCard } from './components/TaskCard'
import { TaskForm } from './components/TaskForm'

// App is the "smart" root component — it owns all state and talks to the API.
// Child components (TaskCard, TaskForm) are "dumb" — they receive data via props
// and call callback functions to trigger changes.

export default function App() {
  const [tasks, setTasks]           = useState<Task[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [showForm, setShowForm]     = useState(false)
  const [filter, setFilter]         = useState<'all' | 'active' | 'done'>('all')

  // useEffect with [] runs once when the component first mounts — like "on page load"
  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      setLoading(true)
      const data = await taskApi.getAll()
      setTasks(data)
      setError(null)
    } catch (e) {
      setError('Failed to load tasks. Is the API running?')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(data: TaskRequest) {
    const created = await taskApi.create(data)
    setTasks(prev => [created, ...prev])  // add to top of list without re-fetching
    setShowForm(false)
  }

  async function handleUpdate(id: number, data: TaskRequest) {
    const updated = await taskApi.update(id, data)
    setTasks(prev => prev.map(t => t.id === id ? updated : t))  // replace in list
  }

  async function handleToggle(id: number) {
    const updated = await taskApi.toggle(id)
    setTasks(prev => prev.map(t => t.id === id ? updated : t))
  }

  async function handleDelete(id: number) {
    await taskApi.delete(id)
    setTasks(prev => prev.filter(t => t.id !== id))  // remove from list
  }

  // Filter tasks based on selected tab — no extra API call needed
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

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <p className="text-sm text-gray-400 mt-1">Powered by Spring Boot + Kong</p>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {/* New task form */}
        {showForm && (
          <div className="mb-6">
            <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
          {(['all', 'active', 'done'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${
                filter === f ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f} <span className="text-xs">({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* States: loading / error / empty / list */}
        {loading && (
          <p className="text-center text-gray-400 py-12">Loading tasks...</p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            {filter === 'all' ? 'No tasks yet — create one above!' : `No ${filter} tasks.`}
          </p>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-3">
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
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
