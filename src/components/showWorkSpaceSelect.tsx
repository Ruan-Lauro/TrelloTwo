import React from "react";
import { workSpaceType } from "./selectMenuLeft";
import { useGetWorkSpace } from "../hooks/useGetWorkSpace";

type showWorkSpaceSelect = {
    listWorkSpace: workSpaceType[];
    workplaceIds: number[];
    userId: number;
    update: ()=>void;
};

export default function ShowWorkSpaceSelect ({listWorkSpace, workplaceIds, userId, update}:showWorkSpaceSelect){

    const list:{nome:string; id: number; isUser: boolean}[] = [];

      const {addUserWorkSpace} = useGetWorkSpace();

    listWorkSpace.map(value=>{
        const res = workplaceIds.filter(w=>w === value.id);

        let userBelongs = false;

        if(res.length > 0){
            userBelongs = true;
        }

        list.push({nome: value.nome, id: value.id, isUser: userBelongs})
    })

    return(
        <div className="w-full relative z-2 flex flex-col px-5 py-2 bg-white border-[#C9C9C9] border-[1px] rounded-[8px] h-[100px] overflow-y-auto" >
            {listWorkSpace.length > 0 && list.length > 0?(
                <React.Fragment>
                    {list.map(value=>(
                        <React.Fragment key={value.id} >
                            {value.isUser?(
                                <div key={value.id} onClick={()=>{
                                    const res = addUserWorkSpace(userId, workplaceIds.filter(val=>val !== value.id));
                                    res.then(ele=>{
                                        if(typeof ele === "boolean" && ele){
                                            update();
                                        }
                                    })
                                    
                                }} className={`flex items-center justify-center mb-2 bg-green-600 w-[150px] h-[22px] rounded-[4px] px-1 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-red-600`} >
                                    <p className='truncate max-w-full text-white font-semibold' >{value.nome}</p>
                                </div>
                            ):(
                                <div key={value.id} onClick={() =>{
                                    const list = [...workplaceIds, value.id];
                                    const res = addUserWorkSpace(userId, list);
                                    res.then(ele=>{
                                        if(typeof ele === "boolean" && ele){
                                            update();
                                        }
                                    })
                                }} className={`flex items-center justify-center mb-2 bg-red-600 w-[150px] h-[22px] rounded-[4px] px-1 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-green-600`} >
                                    <p className='truncate max-w-full text-white font-semibold' >{value.nome}</p>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </React.Fragment>
            ):null}
        </div>
    );
}