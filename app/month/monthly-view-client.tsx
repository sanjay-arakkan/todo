'use client'

import { useState } from 'react'
import { getTodayDateString, getMonthCalendarGrid, getMonthName, getShortDate } from '@/utils/date-helpers'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface DayData {
    date: string
    total: number
    completed: number
}

export function MonthlyViewClient({ initialMonthData }: { 
    initialMonthData: Record<string, DayData>
}) {
    const today = getTodayDateString()
    const todayDate = new Date(today)
    
    const [currentYear, setCurrentYear] = useState(todayDate.getFullYear())
    const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth())
    const [monthData, setMonthData] = useState(initialMonthData)
    const [isLoading, setIsLoading] = useState(false)
    
    const calendarGrid = getMonthCalendarGrid(currentYear, currentMonth)
    
    const loadMonth = async (year: number, month: number) => {
        setIsLoading(true)
        setCurrentYear(year)
        setCurrentMonth(month)
        
        const response = await fetch(`/api/month-data?year=${year}&month=${month}`)
        const data = await response.json()
        
        setMonthData(data)
        setIsLoading(false)
    }
    
    const goToPrevMonth = () => {
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear
        loadMonth(newYear, newMonth)
    }
    
    const goToNextMonth = () => {
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear
        loadMonth(newYear, newMonth)
    }
    
    const goToToday = () => {
        loadMonth(todayDate.getFullYear(), todayDate.getMonth())
    }
    
    const isCurrentMonth = currentYear === todayDate.getFullYear() && currentMonth === todayDate.getMonth()

    return (
        <div className="container max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Monthly View</h1>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="icon"
                        onClick={goToPrevMonth}
                        disabled={isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[120px] text-center">
                        {getMonthName(currentMonth)} {currentYear}
                    </span>
                    <Button 
                        variant="outline" 
                        size="icon"
                        onClick={goToNextMonth}
                        disabled={isLoading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    {!isCurrentMonth && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={goToToday}
                            disabled={isLoading}
                        >
                            Today
                        </Button>
                    )}
                </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className={cn(
                "grid grid-cols-7 gap-2 transition-opacity",
                isLoading && "opacity-50"
            )}>
                {calendarGrid.map((dateStr, index) => {
                    if (!dateStr) {
                        return <div key={`empty-${index}`} className="aspect-square" />
                    }
                    
                    const dayData = monthData[dateStr]
                    const isToday = dateStr === today
                    const dayNum = new Date(dateStr).getDate()
                    const hasData = dayData && dayData.total > 0
                    const progress = hasData ? (dayData.completed / dayData.total) * 100 : 0
                    
                    return (
                        <Link href={`/week/${dateStr}`} key={dateStr}>
                            <Card className={cn(
                                "aspect-square flex flex-col items-center justify-center p-2 cursor-pointer transition-all hover:border-primary hover:shadow-md",
                                isToday && "border-primary bg-primary/5 dark:bg-primary/10",
                                !hasData && "opacity-60"
                            )}>
                                <CardContent className="p-0 flex flex-col items-center gap-1">
                                    <span className={cn(
                                        "text-lg font-semibold",
                                        isToday && "text-primary"
                                    )}>
                                        {dayNum}
                                    </span>
                                    {hasData && (
                                        <div className="text-xs text-muted-foreground">
                                            <span className={cn(
                                                progress === 100 && "text-green-500"
                                            )}>
                                                {dayData.completed}/{dayData.total}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
