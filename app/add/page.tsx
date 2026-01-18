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
import { ArrowLeft } from "lucide-react"

export default function AddTodoPage() {
    // Note: Select in Shadcn is a controlled/uncontrolled hybrid. 
    // Ideally we use a hidden input or controlled state for form submission if using server actions directly on form.
    
    // Since Shadcn Select doesn't naturally work with native FormData easily without a hidden input,
    // we'll control the value and put it in a hidden input.
    const [recurrence, setRecurrence] = useState('once');
    
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
                            <div className="space-y-2">
                                <Label htmlFor="date">When?</Label>
                                <Input 
                                    id="date"
                                    name="date" 
                                    type="date" 
                                    defaultValue={getTodayDateString()} 
                                    required
                                />
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
