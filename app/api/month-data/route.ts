import { NextRequest, NextResponse } from 'next/server'
import { getTodosForDate } from '@/app/todos/fetchers'
import { getMonthRange } from '@/utils/date-helpers'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')
    
    if (!yearParam || !monthParam) {
        return NextResponse.json({ error: 'Missing year or month parameter' }, { status: 400 })
    }
    
    const year = parseInt(yearParam)
    const month = parseInt(monthParam)
    
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
    
    return NextResponse.json(monthData)
}
