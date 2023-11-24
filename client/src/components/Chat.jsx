import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Avatar from "./Avatar"

export default function Chat(){

    const [ws, setWs] = useState(null)
    const [peopleOnline, setPeopleOnline] = useState({})

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000')
        setWs(ws)
        ws.addEventListener("message", handleMessage)
    }, [])

    function showOnlinePeople(messageData){
        const people = {}
        messageData.forEach(({userId, username}) => {
            people[userId] = username
        })
        setPeopleOnline(people)
    }

    function handleMessage(e){
        const messageData = JSON.parse(e.data)
        if ("online" in messageData){
            showOnlinePeople(messageData.online)
        }
    }

    return(
        <div className="flex h-screen">
            <div className="w-1/5 border-r-2">
                <div className="head text-5xl text-center py-10 text-primary">
                    Atchat
                </div>
                <div className="flex flex-col gap-4 w-full">                    
                    {Object.keys(peopleOnline).map(userId => (
                        <div className="flex gap-4 p-2 mr-16 ml-16 pl-2   items-center text-center border-2 rounded-md cursor-pointer hover:scale-125 duration-100">
                            <Avatar username={peopleOnline[userId]} />
                            {peopleOnline[userId]}
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-3/4 flex flex-col">
                <div className="flex-grow">
                    
                </div>
                <div className="flex p-10 gap-4">
                    <Input 
                        className="h-12"
                        type="text" 
                        placeholder="Type a message..."                  
                    />
                    <Button className="w-13 h-12 bg-muted hover:bg-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                    </Button>
                    <Button className="w-13 h-12">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    )
}