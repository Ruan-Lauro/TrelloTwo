import { button } from "./button";

export default function ButtonListUser ({children, authentication, id, type}:button) {
    return(
        <button type={type} className="font-semibold w-[175px] h-12 rounded-full bg-1 flex items-center text-white gap-3 pl-3 hover:bg-3 cursor-pointer" onClick={authentication} id={id}>
            <div className="flex items-center justify-center font-semibold h-[22px] w-[22px] rounded-full bg-5" >
                <p >+</p>
            </div>
            {children}
        </button>
    );
}