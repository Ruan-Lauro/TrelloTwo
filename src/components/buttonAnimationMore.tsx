
const ButtonAnimationMore = ({onClick, value, type}:{onClick: ()=>void, value: boolean, type?: string}) => {
    return(
        <div onClick={onClick} className={` overflow-hidden cursor-pointer bg-[#d9d9d9] text-[#174972] ${type === "tag"?"w-[91px] h-[21px]":"w-[44px] h-[44px]"} rounded-full flex items-center justify-center`} >
            <p className={`${type === "tag"?"text-[35px]":"text-[40px]"} font-bold mb-2 cursor-pointer transition-transform duration-300 ease-in-out ${value ? 'rotate-45 ml-2' : 'rotate-0'}`}>+</p>
        </div>
    );
}

export default ButtonAnimationMore;