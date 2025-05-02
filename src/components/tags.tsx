
const Tags = ({name, color}:{name: string, color: string}) => {
    return(
        <div className={`text-white w-[93px] h-[21px] rounded-full flex items-center justify-center`} style={{background: color}} >
            <p className="font-bold text-[13px]" >{name}</p>
        </div>
    );
};

export default Tags;