import { NextRequest, NextResponse } from 'next/server'
import { getTodosForDate } from '@/app/todos/fetchers'
import { getDayName } from '@/utils/date-helpers'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const datesParam = searchParams.get('dates')
    
    if (!datesParam) {
        return NextResponse.json({ error: 'Missing dates parameter' }, { status: 400 })
    }
    
    const dates = datesParam.split(',')
    
    const weekData = await Promise.all(
        dates.map(async (date) => {
            const todos = await getTodosForDate(date)
            const total = todos.length
            const completed = todos.filter(t => t.is_complete).length
            return { date, dayName: getDayName(date), total, completed }
        })
    )
    
    return NextResponse.json(weekData)
}
