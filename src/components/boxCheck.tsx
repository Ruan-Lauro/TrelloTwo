import { IoMdCheckmark } from "react-icons/io";

const BoxCheck = ({value, click}:{value:boolean; click:()=>void}) => {

    return(
        <div className={`w-5 h-5 ${value?"bg-white hover:bg-transparent":"hover:bg-white"} border-white border-[2px] rounded-[5px] group cursor-pointer`} onClick={click} >
            {value?(
                <IoMdCheckmark className="text-black flex group-hover:hidden" />
            ):(
                <IoMdCheckmark className="text-black hidden group-hover:flex" />
            )}
        </div>
    );
}

export default BoxCheck;