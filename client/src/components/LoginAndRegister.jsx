import { useContext, useState } from "react"
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
import { UserContext } from "./UserContext"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toast } from "@radix-ui/react-toast"
import { Toaster } from "@/components/ui/toaster"

export default function LoginAndRegister() {

    const [creds, setCreds] = useState({ username: "", password: "" })
    const [isRegisterOrLogin, setisRegisterOrLogin] = useState('Register')
    const {setUsername, setId} = useContext(UserContext)
    const { toast } = useToast()

    function updateCreds(event) {
        const { name, value } = event.target;
        setCreds(prevValues => ({ ...prevValues, [name]: value }))
    }

    async function formSubmit(event) {
        event.preventDefault()
        const url = "/" + isRegisterOrLogin.toLowerCase()        
        const {username, password} = creds
        await axios.post(url, {username, password})
        .then((res) => {
            setUsername(username)
            setId(res.response.data.id)
        })
        .catch((res) => {
            if(res.response.status == 406) { handleError(res) }                
        })
    }

    async function handleError(res){
        if(res.response.data === "DUP USR"){
            toast({
                variant: "destructive",
                description: "The usename is already taken"
            })
        }
        else if(res.response.data === "INVALID"){
            toast({
                variant: "destructive",
                description: "Username or Password is wrong"
            })
        }

    }

    return (
        <div className="bg-background h-screen flex items-center justify-center">
            <Card className="w-80">
                <form onSubmit={formSubmit}>
                    <CardHeader className="mt-2 mb-2">
                    {isRegisterOrLogin === "Register" ?
                        <CardTitle className="text-lg lg:text-2xl">Create an <span className="text-primary">Account</span></CardTitle>
                        : 
                        <CardTitle className="text-lg lg:text-2xl">Login to your <span className="text-primary">Account</span></CardTitle>
                    }
                        
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
                            <Button className="w-full">
                                {isRegisterOrLogin}
                            </Button>
                        </div>                        
                    </CardContent>
                    <CardFooter className="flex text-center">                        
                    {isRegisterOrLogin === "Register" ?
                        <Label className="text-muted-foreground w-full">Already an user?                    
                            <a className="text-white cursor-pointer" onClick={() => {setisRegisterOrLogin('Login')}}> Login!!</a>
                        </Label>
                        : 
                        <Label className="text-muted-foreground w-full">New here?                       
                            <a className="text-white cursor-pointer" onClick={() => {setisRegisterOrLogin('Register')}}> Register!!</a>
                        </Label>
                    }
                    </CardFooter>
                </form>
            </Card>
            <Toaster />
        </div>
    )
}