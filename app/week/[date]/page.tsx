import { getTodosForDate } from '@/app/todos/fetchers'
import { getFormattedDate, getDayName } from '@/utils/date-helpers'
import DayTodoList from '@/app/todos/day-list'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function DayDetailPage({ params }: { params: Promise<{ date: string }> }) {
    const { date } = await params;
    const todos = await getTodosForDate(date);

    return (
        <div className="container max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/week">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                     <h1 className="text-3xl font-bold tracking-tight">{getDayName(date)}</h1>
                     <p className="text-muted-foreground">{getFormattedDate(date)}</p>
                </div>
            </div>

            <DayTodoList todos={todos} date={date} />
        </div>
    )
}
