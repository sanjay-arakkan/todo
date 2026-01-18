'use client'

import { useState } from 'react'
import { getTodayDateString, getWeekRange, getDayName, getShortDate, addDays } from '@/utils/date-helpers'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DayData {
    date: string
    dayName: string
    total: number
    completed: number
}

export function WeeklyViewClient({ initialWeekData, initialStartDate }: { 
    initialWeekData: DayData[],
    initialStartDate: string 
}) {
    const [weekOffset, setWeekOffset] = useState(0)
    const [weekData, setWeekData] = useState(initialWeekData)
    const [isLoading, setIsLoading] = useState(false)
    
    const today = getTodayDateString()
    
    const loadWeek = async (offset: number) => {
        setIsLoading(true)
        setWeekOffset(offset)
        
        // Calculate new start date
        const newStartDate = addDays(initialStartDate, offset * 7)
        const weekDates = getWeekRange(newStartDate)
        
        // Fetch data for the week
        const response = await fetch(`/api/week-data?dates=${weekDates.join(',')}`)
        const data = await response.json()
        
        setWeekData(data)
        setIsLoading(false)
    }
    
    const currentWeekStart = weekData[0]?.date
    const currentWeekEnd = weekData[6]?.date

    return (
        <div className="container max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Weekly View</h1>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => loadWeek(weekOffset - 1)}
                        disabled={isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground min-w-[140px] text-center">
                        {currentWeekStart && currentWeekEnd && 
                            `${getShortDate(currentWeekStart)} - ${getShortDate(currentWeekEnd)}`
                        }
                    </span>
                    <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => loadWeek(weekOffset + 1)}
                        disabled={isLoading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    {weekOffset !== 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => loadWeek(0)}
                            disabled={isLoading}
                        >
                            Today
                        </Button>
                    )}
                </div>
            </div>

            <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity",
                isLoading && "opacity-50"
            )}>
                {weekData.map((day) => {
                    const isToday = day.date === today
                    const progress = day.total ? (day.completed / day.total) * 100 : 0
                    
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
                                            {getShortDate(day.date)}
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
