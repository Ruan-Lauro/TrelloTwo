import React from "react";
import { workSpaceType } from "./selectMenuLeft";

type showWorkSpaceSelect = {
    listWorkSpace: workSpaceType[];
    workplaceIds: number[];
    addUserWork: (id:number)=>void;
    deleteUserWork: (id:number)=> void;
};

export default function ShowWorkSpaceSelect ({listWorkSpace, workplaceIds, addUserWork, deleteUserWork}:showWorkSpaceSelect){

    const list:{nome:string; id: number; isUser: boolean}[] = [];

    listWorkSpace.map(value=>{
        const res = workplaceIds.filter(w=>w === value.id);

        let userBelongs = false;

        if(res.length > 0){
            userBelongs = true;
        }

        list.push({nome: value.nome, id: value.id, isUser: userBelongs})
    })

    return(
        <div className="w-full z-2 flex flex-col px-5 py-2 bg-white border-[#C9C9C9] border-[1px] rounded-[8px]" >
            {listWorkSpace.length > 0 && list.length > 0?(
                <React.Fragment>
                    {list.map(value=>(
                        <React.Fragment key={value.id} >
                            {value.isUser?(
                                <div key={value.id} onClick={()=>{
                                    deleteUserWork(value.id);
                                }} className={`flex items-center justify-center mb-2 bg-green-600 w-[80px] h-[22px] rounded-[4px] px-1 cursor-pointer`} >
                                    <p className='truncate max-w-full text-white font-semibold' >{value.nome}</p>
                                </div>
                            ):(
                                <div key={value.id} onClick={() =>{
                                    addUserWork(value.id);
                                }} className={`flex items-center justify-center mb-2 bg-red-600 w-[80px] h-[22px] rounded-[4px] px-1 cursor-pointer`} >
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