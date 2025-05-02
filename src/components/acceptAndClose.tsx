import { BsCheck, BsX } from "react-icons/bs";

const AcceptAndClose = ({add, close}:{add:()=>void, close:()=>void}) => {
    return(
        <div className="flex" >
            <BsCheck className="text-[40px] cursor-pointer hover:text-8" onClick={()=>{
                add();
    
            }}  />
            <BsX className="text-[40px] cursor-pointer hover:text-red-500" onClick={()=>{
                close();
            }}/>
        </div>
    );
};

export default AcceptAndClose;