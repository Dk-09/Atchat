export default function Avatar({username, userId , selectedId, isOnline}){
    return(
        <div className={ "relative flex w-10 h-10 rounded-full  text-lg uppercase items-center font-semibold " + (userId === selectedId ? "bg-primary text-white": "bg-white text-black")}>
            <div className="text-center w-full">{username[0]}</div>
            { isOnline && 
               (<div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500"></div>)
            }
            { !isOnline && 
               (<div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-red-500"></div>)
            }
        </div>
    )
}