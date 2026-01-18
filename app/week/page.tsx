import { getTodayDateString, getWeekRange, getDayName } from '@/utils/date-helpers'
import { getTodosForDate } from '@/app/todos/fetchers'
import { WeeklyViewClient } from './weekly-view-client'

export default async function WeeklyPage() {
    const today = getTodayDateString()
    const weekDates = getWeekRange(today)
    
    // Fetch data for all days in parallel
    const weekData = await Promise.all(
        weekDates.map(async (date) => {
            const todos = await getTodosForDate(date)
            const total = todos.length
            const completed = todos.filter(t => t.is_complete).length
            return { date, dayName: getDayName(date), total, completed }
        })
    )

    return <WeeklyViewClient initialWeekData={weekData} initialStartDate={today} />
}
