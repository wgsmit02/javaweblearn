import { useState } from 'react'
import type { Task, TaskRequest, Priority } from '../types/task'

interface Props {
  initial?: Task          // if provided, we're editing; otherwise creating
  onSubmit: (data: TaskRequest) => void
  onCancel: () => void
}

// A controlled form component — React owns all the input values via state.
export function TaskForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle]             = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [priority, setPriority]       = useState<Priority>(initial?.priority ?? 'MEDIUM')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()  // prevent browser page reload
    onSubmit({ title, description, priority })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">
        {initial ? 'Edit Task' : 'New Task'}
      </h2>

      <input
        type="text"
        placeholder="Task title *"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={3}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      <select
        value={priority}
        onChange={e => setPriority(e.target.value as Priority)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="LOW">Low priority</option>
        <option value="MEDIUM">Medium priority</option>
        <option value="HIGH">High priority</option>
      </select>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit"
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          {initial ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  )
}
