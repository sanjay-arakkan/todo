'use client'

import { TodoWithStatus } from './fetchers'
import { toggleTodo, deleteTodoInstance } from './actions'
import { useTransition } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { DeleteTodoDialog } from "@/components/delete-todo-dialog"
import { cn } from "@/lib/utils"

export default function DayTodoList({ 
    todos, 
    date,
    readOnly = false 
}: { 
    todos: TodoWithStatus[], 
    date: string,
    readOnly?: boolean
}) {
    const [isPending, startTransition] = useTransition()

    return (
        <div className="space-y-3">
            {!todos.length && (
                <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg bg-card">
                    No todos for this day.
                </div>
            )}
            
            {todos.map(todo => (
                <div key={todo.id} className="flex items-center p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                    <Checkbox
                        checked={todo.is_complete}
                        disabled={isPending || readOnly}
                        onCheckedChange={(checked) => startTransition(() => toggleTodo(todo.id, date, checked as boolean))}
                        className="mr-4 h-5 w-5"
                    />
                    <div className="flex-1 flex flex-col gap-1">
                        <span className={cn(
                            "font-medium transition-all",
                            todo.is_complete && "line-through text-muted-foreground"
                        )}>
                            {todo.title}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                            {todo.recurrence === 'once' ? 'One-time' : todo.recurrence}
                        </span>
                    </div>

                    {!readOnly && (
                        <DeleteTodoDialog
                            todoTitle={todo.title}
                            onConfirm={() => startTransition(() => deleteTodoInstance(todo.id, date))}
                            disabled={isPending}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
