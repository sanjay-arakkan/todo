'use client'

import { addTodo } from '@/app/todos/actions'
import { getTodayDateString } from '@/utils/date-helpers'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, CalendarIcon } from "lucide-react"

// Helper functions for date formatting and validation
function formatDate(date: Date | undefined) {
    if (!date) {
      return ""
    }
  
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
}
  
function isValidDate(date: Date | undefined) {
    if (!date) {
      return false
    }
    return !isNaN(date.getTime())
}

export default function AddTodoPage() {
    const [recurrence, setRecurrence] = useState('once');
    // Initialize date state (defaulting to today)
    const [date, setDate] = useState<Date | undefined>(new Date())
    // Initialize open state for popover
    const [open, setOpen] = useState(false)
    // Initialize month view
    const [month, setMonth] = useState<Date | undefined>(date)
    // Initialize input value
    const [inputValue, setInputValue] = useState(formatDate(date))
    
    // Helper to format date for hidden input (YYYY-MM-DD local time)
    const getHiddenDateValue = (d: Date | undefined) => {
        if (!d) return getTodayDateString();
        const year = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${m}-${day}`;
    }

    return (
        <div className="container max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/todos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Add New Todo</h1>
            </div>

            <Card>
                <CardHeader>
                     <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={addTodo} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">What needs to be done?</Label>
                            <Input 
                                id="title"
                                name="title" 
                                type="text" 
                                placeholder="e.g., Read for 30 mins" 
                                required 
                                autoComplete="off"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>How often?</Label>
                            {/* Hidden input to pass value to server action */}
                            <input type="hidden" name="recurrence" value={recurrence} />
                            
                            <Select value={recurrence} onValueChange={setRecurrence}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="once">Just Once</SelectItem>
                                    <SelectItem value="daily">Every Day</SelectItem>
                                    <SelectItem value="weekdays">Weekdays (Mon-Fri)</SelectItem>
                                    <SelectItem value="weekends">Weekends (Sat-Sun)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {recurrence === 'once' && (
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="date-input" className="px-1">
                                    When?
                                </Label>
                                <input type="hidden" name="date" value={getHiddenDateValue(date)} />
                                <div className="relative flex gap-2">
                                    <Input
                                        id="date-input"
                                        value={inputValue}
                                        placeholder="June 01, 2025"
                                        className="bg-background pr-10"
                                        onChange={(e) => {
                                            const newVal = e.target.value
                                            setInputValue(newVal)
                                            const newDate = new Date(newVal)
                                            if (isValidDate(newDate)) {
                                                setDate(newDate)
                                                setMonth(newDate)
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowDown") {
                                                e.preventDefault()
                                                setOpen(true)
                                            }
                                        }}
                                        autoComplete="off"
                                    />
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date-picker"
                                                variant="ghost"
                                                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                                type="button" // Important to prevent form submission
                                            >
                                                <CalendarIcon className="size-3.5" />
                                                <span className="sr-only">Select date</span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto overflow-hidden p-0"
                                            align="end"
                                            alignOffset={-8}
                                            sideOffset={10}
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                // captionLayout="dropdown" // Using default caption layout if not available in current shadcn version
                                                month={month}
                                                onMonthChange={setMonth}
                                                onSelect={(newDate) => {
                                                    setDate(newDate)
                                                    setInputValue(formatDate(newDate))
                                                    setOpen(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        )}
                        
                        {recurrence !== 'once' && (
                             <p className="text-sm text-muted-foreground italic">
                                 Recurring todos added today will start appearing from tomorrow.
                             </p>
                        )}

                        <Button type="submit" className="w-full">Create Todo</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
