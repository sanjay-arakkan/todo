'use client'

import { login } from './actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isRegister 
              ? 'Register to start managing your todos' 
              : 'Sign in to manage your todos'}
          </CardDescription>
        </CardHeader>
        <CardContent>
             <form className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                    <Button formAction={login} className="w-full">
                      {isRegister ? 'Register' : 'Log in'}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="ghost" 
                      className="w-full"
                      onClick={() => setIsRegister(!isRegister)}
                    >
                      {isRegister 
                        ? 'Already have an account? Sign in' 
                        : "Don't have an account? Register"}
                    </Button>
                </div>

                {error && (
                    <p className="text-sm text-red-500 font-medium text-center">{error}</p>
                )}
                {message && (
                     <p className="text-sm text-green-500 font-medium text-center">{message}</p>
                )}
            </form>
        </CardContent>
      </Card>
    </div>
  )
}
