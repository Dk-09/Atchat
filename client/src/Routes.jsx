import { useContext } from "react";
import LoginAndRegister from "@/components/LoginAndRegister";
import { UserContext } from "@/components/UserContext";
import Chat from "@/components/Chat"

export default function Routes(){

    const {username, id} = useContext(UserContext)

    if (username){
        return ( <Chat /> ) 
    }

    return(
        <LoginAndRegister />
    )
    
}