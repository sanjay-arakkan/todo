import { createClient } from '@/utils/supabase/server'
import { getTodosForDate } from './fetchers'
import { getTodayDateString, getFormattedDate } from '@/utils/date-helpers'
import DayTodoList from './day-list'

export default async function TodosPage() {
  const supabase = await createClient()
  const today = getTodayDateString();
  const todos = await getTodosForDate(today);

  return (
    <div className="container max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Today</h1>
            <p className="text-xl text-muted-foreground">{getFormattedDate(today)}</p>
      </div>

      <DayTodoList todos={todos} date={today} />
    </div>
  )
}
