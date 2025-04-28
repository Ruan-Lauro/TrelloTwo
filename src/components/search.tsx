import { ChangeEvent } from "react";
import { ReactSVG } from "react-svg";

type search = {
    placeholder: string;
    onClickSearch: ()=> void;
    onchange: (e: ChangeEvent<HTMLInputElement>) => void;
    typeTwo?: boolean;
}

export default function Search ({
    placeholder,
    onClickSearch,
    onchange,
    typeTwo
}:search){
    return(
        <div className={`flex items-center ${typeTwo?"bg-10":"bg-2 text-white"} rounded-full w-full px-5 `} >
            <input type="search" onChange={onchange} placeholder={placeholder} className="bg-transparent w-full focus:outline-0 h-[60px]" />
            <ReactSVG
                className={`cursor-pointer hover:scale-105 transition-all duration-300 ${typeTwo?"text-[#003B6B]":"text-[#B2C4D3]"}`}
                src="/src/assets/svg/Search.svg"
                onClick={onClickSearch}
            />
        </div>
    );
}