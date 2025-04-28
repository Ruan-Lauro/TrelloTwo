import { button } from "./button";

export default function ButtonAddUser (
    {
        children,
        authentication,
        id,
        type,
    }:button){

    return(
        <button className={`w-[132px] h-[36px] rounded-full bg-1 hover:bg-3 text-white cursor-pointer`} type={type} onClick={authentication} id={id}>
            {children}
        </button>
    );
}