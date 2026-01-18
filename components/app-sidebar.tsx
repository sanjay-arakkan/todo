'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, List, PlusCircle, Settings, LogOut, CheckSquare } from "lucide-react"

export function AppSidebar({ appTitle }: { appTitle: string }) {
    const pathname = usePathname()

    const links = [
        { href: "/todos", label: "Today", icon: CheckSquare },
        { href: "/week", label: "Weekly View", icon: Calendar },
        { href: "/add", label: "Add Todo", icon: PlusCircle },
        { href: "/settings", label: "Settings", icon: Settings },
    ]

    return (
        <div className="pb-12 h-screen border-r bg-background w-64 flex-col hidden md:flex fixed left-0 top-0">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        {appTitle}
                    </h2>
                    <div className="space-y-1">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <Button 
                                    variant={pathname === link.href ? "secondary" : "ghost"} 
                                    className="w-full justify-start"
                                >
                                    <link.icon className="mr-2 h-4 w-4" />
                                    {link.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-auto p-4">
                 <form action="/auth/signout" method="post">
                    <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20" type="submit">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    )
}
