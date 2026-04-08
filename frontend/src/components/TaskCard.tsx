import { useState } from 'react'
import type { Task, TaskRequest } from '../types/task'
import { TaskForm } from './TaskForm'

interface Props {
  task: Task
  onToggle: (id: number) => void
  onUpdate: (id: number, data: TaskRequest) => void
  onDelete: (id: number) => void
}

const priorityStyles = {
  HIGH:   'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW:    'bg-green-100 text-green-700',
}

export function TaskCard({ task, onToggle, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <TaskForm
        initial={task}
        onSubmit={data => { onUpdate(task.id, data); setEditing(false) }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className={`flex items-start gap-3 p-4 bg-white rounded-xl border shadow-sm transition-opacity ${task.completed ? 'opacity-60' : ''}`}>

      {/* Checkbox to toggle completion */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mt-1 h-4 w-4 cursor-pointer accent-blue-600"
      />

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-gray-800 ${task.completed ? 'line-through' : ''}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 shrink-0">
        <button onClick={() => setEditing(true)}
          className="text-xs px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-100">
          Edit
        </button>
        <button onClick={() => onDelete(task.id)}
          className="text-xs px-2 py-1 rounded-lg text-red-500 hover:bg-red-50">
          Delete
        </button>
      </div>
    </div>
  )
}
