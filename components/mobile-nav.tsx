'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet" // Added SheetTitle import
import { Menu, CheckSquare, Calendar, PlusCircle, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
// SheetTitle is required for accessibility in newer shadcn/radix versions, we should include it if needed or just SR only.
// Actually standard shadcn sheet has SheetHeader -> SheetTitle.

export function MobileNav({ appTitle }: { appTitle: string }) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const links = [
        { href: "/todos", label: "Today", icon: CheckSquare },
        { href: "/week", label: "Weekly View", icon: Calendar },
        { href: "/month", label: "Monthly View", icon: Calendar },
        { href: "/add", label: "Add Todo", icon: PlusCircle },
        { href: "/settings", label: "Settings", icon: Settings },
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                 {/* Visual title for mobile menu */}
                 <div className="mb-6 px-2">
                    <SheetTitle>{appTitle}</SheetTitle>
                 </div>
                 
                <div className="flex flex-col gap-2">
                    {links.map((link) => (
                        <Link 
                            key={link.href} 
                            href={link.href}
                            onClick={() => setOpen(false)}
                        >
                            <Button 
                                variant={pathname === link.href ? "secondary" : "ghost"} 
                                className="w-full justify-start"
                            >
                                <link.icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </Button>
                        </Link>
                    ))}
                    <div className="mt-4 pt-4 border-t">
                        <form action="/auth/signout" method="post">
                             <Button variant="ghost" className="w-full justify-start text-red-500" type="submit">
                                 <LogOut className="mr-2 h-4 w-4" />
                                 Sign Out
                             </Button>
                         </form>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
