'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { RecurrenceType, getTodayDateString, addDays } from '@/utils/date-helpers'

export async function addTodo(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const recurrence = formData.get('recurrence') as RecurrenceType
  // If user selected a specific date for 'once', or we default to today
  // For recurring, we start from tomorrow typically, OR today. 
  // Requirement: "If a recurring todo series... is added today, it should apply to all future days starting from tomorrow"
  let startDate = formData.get('date') as string;
  
  if (!title) return

  // Recurrence logic per requirement
  if (recurrence !== 'once') {
     // If recurring, start tomorrow
     const today = getTodayDateString();
     startDate = addDays(today, 1);
  } else {
     // If not provided, default to today
     if (!startDate) startDate = getTodayDateString();
  }

  const { error } = await supabase.from('todos').insert({
    title,
    recurrence,
    start_date: startDate
  })

  if (error) {
    console.error('Error adding todo:', error)
    return
  }

  // Revalidate everything
  revalidatePath('/', 'layout')
}

export async function toggleTodo(todoId: string, date: string, isComplete: boolean) {
  const supabase = await createClient()

  // We need to upsert into todo_status
  const { error } = await supabase.from('todo_status').upsert({
      todo_id: todoId,
      date: date,
      is_complete: isComplete
  }, { onConflict: 'todo_id, date' })

  if (error) {
    console.error('Error toggling todo:', error)
    return
  }

  revalidatePath('/', 'layout')
}

// "Delete" for a specific day means marking it as deleted in todo_status
// "Delete" for the whole series means deleting the row in `todos`
export async function deleteTodoInstance(todoId: string, date: string) {
    const supabase = await createClient()
  
    const { error } = await supabase.from('todo_status').upsert({
        todo_id: todoId,
        date: date,
        is_deleted: true
    }, { onConflict: 'todo_id, date' })
  
    if (error) {
      console.error('Error deleting todo instance:', error)
      return
    }
  
    revalidatePath('/', 'layout')
}

export async function deleteTodoSeries(todoId: string) {
    const supabase = await createClient()
    
    // This cascades to todo_status thanks to FK setup
    const { error } = await supabase.from('todos').delete().eq('id', todoId)

    if (error) {
        console.error('Error deleting todo series:', error)
        return
    }

    revalidatePath('/', 'layout')
}
