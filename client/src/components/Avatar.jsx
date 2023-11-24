export default function Avatar({username}){
    return(
        <div className="flex w-10 h-10 rounded-full bg-white text-black text-lg uppercase items-center font-semibold">
            <div className="text-center w-full">{username[0]}</div>
        </div>
    )
}