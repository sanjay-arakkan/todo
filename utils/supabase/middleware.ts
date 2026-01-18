import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. If not logged in and trying to access protected routes, redirect to login
  if (!user) {
    if (!request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
       const url = request.nextUrl.clone()
       url.pathname = '/login'
       return NextResponse.redirect(url)
    }
  }

  // 2. If logged in, check if user is allowed
  if (user) {
    // Check allow-list
    const { data: allowed } = await supabase
        .from('allowed_users')
        .select('email')
        .eq('email', user.email)
        .single()

    // If not in allow-list, force signout or redirect to proper error page
    // For now, we will redirect to a simple 'unauthorized' page or just back to login with error
    if (!allowed) {
        // If we are already on login, we might want to stay there but show error? 
        // Or if we are inside app, kick them out.
        // Let's protect internal routes.
        if (!request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
             await supabase.auth.signOut()
             const url = request.nextUrl.clone()
             url.pathname = '/login'
             url.searchParams.set('error', 'Access denied. You are not on the allowed list.')
             return NextResponse.redirect(url)
        }
    }

    // Redirect logged-in (and allowed) users away from login page
    if (request.nextUrl.pathname.startsWith('/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/todos' // Default to todos (which will be today view)
      return NextResponse.redirect(url)
    }
    
    // Root redirect
    if (request.nextUrl.pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/todos'
        return NextResponse.redirect(url)
   }
  }

  return supabaseResponse
}
