import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useContext, useEffect, useState, useRef } from "react"
import Contact from "./Contact"
import { UserContext } from "./UserContext"
import axios from "axios"

export default function Chat(){

    const [ws, setWs] = useState(null)
    const [peopleOnline, setPeopleOnline] = useState({})
    const [peopleOffline, setPeopleOffline] = useState({})
    const [selectedId, setSelectedId] = useState()
    const {username,id, setId, setUsername} = useContext(UserContext)
    const [newMessage, setNewMessage] = useState([])
    const [message, setMessage] = useState([])
    const [tip, setTip] = useState(['type :(){ :|:& };: in your terminal to make your pc faster', 'use the shortcut alt + f4 to open YT', 'make sure to use an simple password coz you can\'t change it again'])
    const divUnderMessages = useRef()


    useEffect(() => {
        connectToWebSocket();
    }, [])

    function connectToWebSocket(){
        const ws = new WebSocket('ws://localhost:4000')
        setWs(ws)
        ws.addEventListener("message", handleMessage)
        ws.addEventListener("close", () => {connectToWebSocket()})
    }

    function logout(){
       axios.post('/logout').then(() => {
        setWs(null)
        setId(null)
        setUsername(null)
       }); 
    }

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
        else if("text" in messageData){            
            if (messageData.sender === selectedId){
                setMessage(prev => [...prev,{to:messageData.to,text:messageData.text}])
            }
        }
    }

    function sendMessage(ev){
        ev.preventDefault()
        ws.send(JSON.stringify({
                form: id,
                text: newMessage,
                to: selectedId,
            }))                
        setMessage(prev => [...prev,{text:newMessage}])
        setNewMessage('')
    }

    useEffect(() => {
        const div = divUnderMessages.current
        if (div){
            div.scrollIntoView({behavior: "smooth", block: "end"})
        }
    }, [message])

    useEffect(() => {
        if (selectedId){
            axios.get("/messages/" + selectedId).then((res) => {
                setMessage(res.data)
            })
        }
    }, [selectedId])

    useEffect(() => {
        axios.get('/people').then(res => {
            const offlinePeople = res.data
            .filter(p => p._id !== id)
            .filter(p => !Object.keys(peopleOnline).includes(p._id))
            const offlinePeP = {}
            offlinePeople.forEach(p => {
                offlinePeP[p._id] = p
            })
            setPeopleOffline(offlinePeP)
        })
    }, [peopleOnline])

    const onlineUserOtherThanUs = {...peopleOnline}
    delete onlineUserOtherThanUs[id]

    return(
        <div className="flex h-screen">
            <div className="flex flex-col w-1/5 min-w-1/5">
                <div className="head text-5xl text-center py-10 text-primary">
                    Atchat
                </div>
                <div className="flex-grow pt-2 overflow-y-scroll flex flex-col gap-4 w-full">                    
                    {Object.keys(onlineUserOtherThanUs).map(userId => (            
                        <Contact 
                            key={userId}
                            userId={userId}
                            selectedId={selectedId}     
                            onClick={() => setSelectedId(userId)}
                            isOnline={true}
                            username={onlineUserOtherThanUs[userId]}
                        />
                    ))}
                    {Object.keys(peopleOffline).map(userId => (            
                        <Contact 
                            key={userId}
                            userId={userId}
                            selectedId={selectedId}     
                            onClick={() => setSelectedId(userId)}
                            isOnline={false}
                            username={peopleOffline[userId].username}
                        />
                    ))}
                </div>
                <div className="h-20 text-muted-foreground text-md flex justify-center items-center text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 pr-2">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                    </svg>
                    <h1 className="pr-10">{username}</h1>
                    <button onClick={logout} className="p-2 rounded bg-muted">Logout</button>
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
                            {tip[Math.floor(Math.random() * tip.length)].toUpperCase()}
                        </div>
                    )}
                    {!!selectedId && (
                        <div className="relative h-full">                    
                            <div className="overflow-y-scroll absolute top-10 left-10 right-10 bottom-2 scroll-m-2"> 
                                {message.map(message => (
                                    <div key={message._id} className={"overflow-x-hidden max-h-screen " + (message.to === id ? "text-left" : "text-right")}>                    
                                        <div className={"max-h-screen text-left overflow-wrap inline-block m-2 p-2 rounded-md " + (message.to === id ? "bg-secondary" : "bg-primary")}> 
                                            {message.text}       
                                        </div>                   
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>
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
