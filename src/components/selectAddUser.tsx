import { ChangeEvent } from "react";

type selectUser = {
    list: string[];
    name: string;
    onchange: (e: ChangeEvent<HTMLSelectElement>) => void;
    value: string;
    infor?: string;
}

export const SelectAddUser = ({name, list, onchange, value, infor}:selectUser) => {
    return(
        <div className={`flex flex-col w-full ${infor?infor:"sm:w-[30%]"}`} >
            <label htmlFor={name} className="pl-5 font-semibold text-6" >{name}:</label>
            <select className="h-[40px] text-[20px] border-b-[3px] border-b-6 pl-5 focus:outline-0" name={name} id={name} value={value} onChange={onchange} >
                {list.map(val=>(
                    <option value={val}>{val}</option>
                ))}
            </select>
        </div>
    );
}