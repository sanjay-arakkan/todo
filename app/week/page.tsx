import { getTodayDateString, getWeekRange, getDayName } from '@/utils/date-helpers'
import { getTodosForDate } from '@/app/todos/fetchers'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default async function WeeklyPage() {
    const today = getTodayDateString();
    const weekDates = getWeekRange(today);
    
    // Fetch data for all days in parallel
    const weekData = await Promise.all(
        weekDates.map(async (date) => {
            const todos = await getTodosForDate(date);
            const total = todos.length;
            const completed = todos.filter(t => t.is_complete).length;
            return { date, dayName: getDayName(date), total, completed };
        })
    );

    return (
        <div className="container max-w-5xl mx-auto space-y-6">
             <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">This Week</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {weekData.map((day) => {
                    const isToday = day.date === today;
                    const progress = day.total ? (day.completed / day.total) * 100 : 0;
                    
                    return (
                        <Link href={`/week/${day.date}`} key={day.date} className="block group">
                            <Card className={cn(
                                "transition-all duration-200 hover:border-primary hover:shadow-md",
                                isToday && "border-primary bg-primary/5 dark:bg-primary/10"
                            )}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex justify-between items-baseline">
                                        <span>{day.dayName}</span>
                                        <span className="text-xs font-normal text-muted-foreground">
                                            {day.date.split('-').slice(1).join('/')}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Progress</span>
                                            <span>{day.completed}/{day.total}</span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
