'use client'

import { deleteTodo, toggleTodo } from './actions'
import { useTransition } from 'react'

interface Todo {
  id: string
  title: string
  is_complete: boolean
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        className="checkbox"
        checked={todo.is_complete}
        onChange={(e) => startTransition(() => toggleTodo(todo.id, e.target.checked))}
        disabled={isPending}
      />
      <span className={`todo-text ${todo.is_complete ? 'completed' : ''}`}>
        {todo.title}
      </span>
      <button
        className="delete-btn"
        onClick={() => startTransition(() => deleteTodo(todo.id))}
        disabled={isPending}
      >
        🗑️
      </button>
    </div>
  )
}
