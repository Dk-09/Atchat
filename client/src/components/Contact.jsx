import Avatar from "./Avatar"

export default function Contact({userId, selectedId,onClick, isOnline, username}){
    return(
        <div key={userId} onClick={() => {onClick(userId)}} className={"flex gap-4 p-2 mr-16 ml-16 pl-2 items-center text-center border-2 rounded-md cursor-pointer hover:scale-125 duration-100 " + (selectedId === userId ? "border-primary scale-125 bg-secondary" : "")}>
            <Avatar username={username} 
                    userId={userId} 
                    selectedId={selectedId} 
                    isOnline={isOnline}
            />
            {username}
        </div>
    )
}