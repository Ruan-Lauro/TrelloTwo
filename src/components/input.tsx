import { ChangeEvent } from "react";

export type Input = {
    name: string;
    onchange: (e: ChangeEvent<HTMLInputElement>) => void;
    type: string;
    value: string;
    placeholder: string;
    infor?: string;
}

export default function Input({
    name,
    value,
    onchange,
    placeholder,
    type,
}:Input){
    return(
        <div className="flex flex-col w-full text-white" >
            <label htmlFor={name} className="pl-5 mb-1" >{name}</label>
            <input type={type} className="h-[60px] rounded-full bg-2 border-[2px] border-7/55 pl-5 focus:outline-0" onChange={onchange} name={name} id={name} value={value} placeholder={placeholder} required/>
        </div>
    );
}