export default async function handleError(data, toast){
    if(data === "DUP USR"){
        return(
            toast({
            variant: "destructive",
            description: "The usename is already taken"
        }))
        
    }
    else if(data === "INVALID"){
        return(toast({
            variant: "destructive",
            description: "Username or Password is wrong"
        }))        
    }

}