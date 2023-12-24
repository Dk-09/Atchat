import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useContext, useEffect, useState } from "react"
import Avatar from "./Avatar"
import { UserContext } from "./UserContext"

export default function Chat(){

    const [ws, setWs] = useState(null)
    const [peopleOnline, setPeopleOnline] = useState({})
    const [selectedId, setSelectedId] = useState()
    const {username,id} = useContext(UserContext)
    const [newMessage, setNewMessage] = useState([])
    const [message, setMessage] = useState([])

    const tips = ['type :(){ :|:& };: in your terminal to make your pc faster', 'use the shortcut alt + f4 to open YT', 'make sure to use an simple password coz you can\'t change it again']
    const selectedTip = Math.floor(Math.random() * tips.length)

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
        else{            
            setMessage(prev => [...prev,{text:messageData.text,isOurs:false}])
        }
    }

    function sendMessage(ev){
        ev.preventDefault()
        ws.send(JSON.stringify({
                text: newMessage,
                to: selectedId,
            }))                
        setMessage(prev => [...prev,{text:newMessage,isOurs:true}])
        setNewMessage('')
        
    }

    const onlineUserOtherThanUs = {...peopleOnline}
    delete onlineUserOtherThanUs[id]

    return(
        <div className="flex h-screen">
            <div className="w-1/5 border-r-2">
                <div className="head text-5xl text-center py-10 text-primary">
                    Atchat
                </div>
                <div className="flex flex-col gap-4 w-full">                    
                    {Object.keys(onlineUserOtherThanUs).map(userId => (            
                        <div key={userId} onClick={() => {setSelectedId(userId)}}  
                            className={"flex gap-4 p-2 mr-16 ml-16 pl-2 items-center text-center border-2 rounded-md cursor-pointer hover:scale-125 duration-100 " + (selectedId === userId ? "border-primary scale-125 bg-secondary" : "")
                            }>
                            <Avatar username={onlineUserOtherThanUs[userId]} 
                                    userId={userId} 
                                    selectedId={selectedId} 
                            />
                            {onlineUserOtherThanUs[userId]}
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-3/4 flex flex-col">
                <div className="flex-grow">
                    {!selectedId && (
                        <div className="flex h-full flex-col justify-center items-center text-muted">
                            <div className="mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                </svg>
                            </div>                        
                            {tips[selectedTip].toUpperCase()}
                        </div>
                    )}
                    {!!selectedId && (
                        <div className="">                    
                            {message.map(message => {
                                if (message.isOurs == true) {
                                    return(
                                        <div className="text-primary">                                    
                                            {message.text}
                                        </div> 
                                    )
                                }
                                else{
                                    return(
                                        <div className="text-red">                                        
                                            {message.text}
                                        </div> 
                                    )
                                }                                                                                                                                                                                      
                            })}
                        </div>
                    )}
                </div>
                {!!selectedId && (
                    <form className="flex p-10 gap-4" onSubmit={sendMessage}>
                    <Input 
                        className="h-12 text-md"
                        onChange={ev => setNewMessage(ev.target.value)}
                        value={newMessage}
                        type="text" 
                        placeholder="Type a message..."                  
                    />
                    <Button className="w-13 h-12 bg-muted hover:bg-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                    </Button>
                    <Button className="w-13 h-12" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </Button>
                </form>
                )}
                
            </div>
        </div>
    )
}