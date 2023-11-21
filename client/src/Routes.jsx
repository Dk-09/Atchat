import { useContext } from "react";
import LoginAndRegister from "@/components/LoginAndRegister";
import { UserContext } from "@/components/UserContext";

export default function Routes(){

    const {username, id} = useContext(UserContext)

    if (username){
        return "Logged in!"
    }

    return(
        <LoginAndRegister />
    )
    
}