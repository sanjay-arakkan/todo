import { createClient } from '@/utils/supabase/server'
import { isDateMatchingRecurrence, RecurrenceType } from '@/utils/date-helpers'

export type TodoWithStatus = {
    id: string;
    title: string;
    recurrence: RecurrenceType;
    is_complete: boolean;
    // Helper to know if we can delete the series vs just the instance
    is_recurrence_instance: boolean; 
}

export async function getTodosForDate(date: string): Promise<TodoWithStatus[]> {
    const supabase = await createClient()
    
    // 1. Fetch all potential todos that started before or on this date
    const { data: definitions, error: defError } = await supabase
        .from('todos')
        .select('*')
        .lte('start_date', date)

    if (defError || !definitions) {
        console.error('Error fetching definitions', defError);
        return [];
    }

    // 2. Fetch specific statuses for this date
    // We only care about statuses that exist for these todos on this date
    const { data: statuses, error: statusError } = await supabase
        .from('todo_status')
        .select('*')
        .eq('date', date)
        .in('todo_id', definitions.map(d => d.id))

    if (statusError) {
        console.error('Error fetching statuses', statusError);
        return [];
    }

    // 3. Merge and Filter
    const results: TodoWithStatus[] = [];

    const statusMap = new Map();
    statuses?.forEach(s => {
        statusMap.set(s.todo_id, s);
    });

    for (const todo of definitions) {
        // Check if deleted for this day
        const status = statusMap.get(todo.id);
        if (status?.is_deleted) continue;

        // Check recurrence mismatch
        const matchesRequest = isDateMatchingRecurrence(date, todo.start_date, todo.recurrence as RecurrenceType);
        if (!matchesRequest) continue;

        results.push({
            id: todo.id,
            title: todo.title,
            recurrence: todo.recurrence,
            is_complete: status?.is_complete || false,
            is_recurrence_instance: todo.recurrence !== 'once'
        });
    }

    // Sort by complete status (optional) or creation
    return results.sort((a,b) => (a.is_complete === b.is_complete ? 0 : a.is_complete ? 1 : -1));
}
