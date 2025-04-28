
export type button = {
    children: string;
    authentication?: () => void;
    id?: string;
    type?:"button" | "submit" | "reset" | undefined;
}

export default function Button (
    {
        children,
        authentication,
        id,
        type,
    }:button){

    return(
        <button className={`w-[161px] h-[48px] rounded-[100px] bg-white hover:bg-7 text-black cursor-pointer`} type={type} onClick={authentication} id={id}>
            {children}
        </button>
    );
}