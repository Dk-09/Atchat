import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import axios from "axios"

export default function Register() {

    const [creds, setCreds] = useState({ username: "", password: "" })

    function updateCreds(event) {
        const { name, value } = event.target;
        setCreds(prevValues => ({ ...prevValues, [name]: value }))
    }

    async function registerUser(event) {
        event.preventDefault()
        const {username, password} = creds
        await axios.post('/register', {username, password})
    }

    return (
        <div className="bg-background h-screen flex items-center justify-center">
            <Card>
                <form onSubmit={registerUser}>
                    <CardHeader className="mt-4 mr-4 mb-4">
                        <CardTitle className="text-lg lg:text-2xl">Create an <span className="text-primary">Account</span></CardTitle>
                        <CardDescription>Connect to people accross the world.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label className="text-muted-foreground">Username</Label>
                                <Input
                                    onChange={updateCreds}
                                    name="username"
                                    value={creds.username}
                                    type="text"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label className="text-muted-foreground">Password</Label>
                                <Input
                                    onChange={updateCreds}
                                    name="password"
                                    value={creds.password}
                                    type="password"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex">
                        <Button className="mb-4 w-full">submit</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}