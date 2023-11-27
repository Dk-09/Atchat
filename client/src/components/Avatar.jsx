export default function Avatar({username, userId , selectedId}){
    return(
        <div className={ "flex w-10 h-10 rounded-full  text-lg uppercase items-center font-semibold " + (userId === selectedId ? "bg-primary text-white": "bg-white text-black")}>
            <div className="text-center w-full">{username[0]}</div>
        </div>
    )
}