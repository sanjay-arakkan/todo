import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/utils/supabase/server'
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shared Todo App',
  description: 'Manage your tasks efficiently',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let appTitle = "Todo App";
  if (user) {
      const { data: allowedUser } = await supabase
        .from('allowed_users')
        .select('display_name')
        .eq('email', user.email)
        .single()

      if (allowedUser?.display_name) {
          appTitle = `${allowedUser.display_name}'s Todo`;
      } else {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'My';
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        appTitle = `${capitalized}'s Todo`;
      }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {user ? (
                <div className="flex min-h-screen">
                    {/* Desktop Sidebar */}
                    <AppSidebar appTitle={appTitle} />

                    {/* Main Content Area */}
                    <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                         {/* Mobile Header */}
                        <div className="md:hidden flex items-center p-4 border-b bg-background sticky top-0 z-50">
                             <MobileNav appTitle={appTitle} />
                             <span className="font-semibold ml-4">{appTitle}</span>
                        </div>
                        
                        {/* Page Content */}
                        <main className="flex-1 p-4 md:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            ) : (
                <main className="min-h-screen flex items-center justify-center">
                    {children}
                </main>
            )}
        </ThemeProvider>
      </body>
    </html>
  )
}
