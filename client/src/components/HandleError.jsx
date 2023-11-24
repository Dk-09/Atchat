export default async function handleError(res, toast){
    if(res.response.data === "DUP USR"){
        return(
            toast({
            variant: "destructive",
            description: "The usename is already taken"
        }))
        
    }
    else if(res.response.data === "INVALID"){
        return(toast({
            variant: "destructive",
            description: "Username or Password is wrong"
        }))        
    }

}