import { Input } from "./input";

export default function InputAddUser ({name, onchange, placeholder, type,value}:Input){
    return(
        <div className="flex flex-col w-full sm:w-[30%]" >
            <label htmlFor={name} className="pl-5 font-semibold text-6" >{name}:</label>
            <input type={type} className="h-[40px] text-[20px] border-b-[3px] border-b-6 pl-5 focus:outline-0" onChange={onchange} name={name} id={name} value={value} placeholder={placeholder} required/>
        </div>
    );
};