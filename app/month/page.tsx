import { getTodayDateString, getMonthRange } from '@/utils/date-helpers'
import { getTodosForDate } from '@/app/todos/fetchers'
import { MonthlyViewClient } from './monthly-view-client'

export default async function MonthlyPage() {
    const today = getTodayDateString()
    const todayDate = new Date(today)
    const year = todayDate.getFullYear()
    const month = todayDate.getMonth()
    
    const dates = getMonthRange(year, month)
    
    const monthData: Record<string, { date: string; total: number; completed: number }> = {}
    
    await Promise.all(
        dates.map(async (date) => {
            const todos = await getTodosForDate(date)
            const total = todos.length
            const completed = todos.filter(t => t.is_complete).length
            monthData[date] = { date, total, completed }
        })
    )

    return <MonthlyViewClient initialMonthData={monthData} />
}
