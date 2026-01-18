import { login } from './actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to manage your shared todos
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
                    <Button formAction={login} className="w-full">Log in</Button>
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
