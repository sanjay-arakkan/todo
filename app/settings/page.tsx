import { ModeToggle } from "@/components/mode-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
    return (
        <div className="container max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize how the app looks on your device.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label>Theme</Label>
                        <p className="text-sm text-muted-foreground">
                            Switch between light and dark themes.
                        </p>
                    </div>
                    <ModeToggle />
                </CardContent>
            </Card>
        </div>
    )
}
