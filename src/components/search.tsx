import { ChangeEvent } from "react";
import { ReactSVG } from "react-svg";

type search = {
    placeholder: string;
    onClickSearch: ()=> void;
    onchange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Search ({
    placeholder,
    onClickSearch,
    onchange
}:search){
    return(
        <div className="flex items-center bg-2 rounded-full w-full px-5 text-white" >
            <input type="search" onChange={onchange} placeholder={placeholder} className="bg-transparent w-full focus:outline-0 h-[60px]" />
            <ReactSVG
                className="cursor-pointer hover:scale-105 transition-all duration-300"
                src="/src/assets/svg/Search.svg"
                onClick={onClickSearch}
            />
        </div>
    );
}