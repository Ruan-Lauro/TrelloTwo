import React from "react";
import { workSpaceType } from "./selectMenuLeft";
import { ReactSVG } from "react-svg";

type RenderWorkSpace = {
    listWorkSpace: workSpaceType[];
    workplaceIds: number[];
    onClick: ()=>void;
    seeAllWorkSpace: boolean;
};

export default function RenderWorkSpace ({listWorkSpace, workplaceIds, onClick, seeAllWorkSpace}:RenderWorkSpace){


    let allWorkSpace = false;

    const listValue = listWorkSpace.filter(value =>
        workplaceIds.some(id => id === value.id)
    );

    if(listValue.length === listWorkSpace.length){
        allWorkSpace = true;
    }

    return(
        <div className="flex flex-col relative w-full "  >
            <div className="w-full flex items-center bg-white justify-between border-[#C9C9C9] border-[1px] rounded-[8px] h-[45px] px-5 cursor-pointer" onClick={onClick}>
                <div className="flex gap-2 overflow-hidden" >
                    {!allWorkSpace && listValue.length > 0?(
                    <React.Fragment>
                        {listValue.slice(0,3).map(value=>(
                            <div key={value.id} className={`flex items-center justify-center ${value.id%2===0?"bg-4":"bg-1"} w-[65px] h-[22px] rounded-[4px] px-1`} >
                            <p className='truncate max-w-full text-white font-semibold' >{value.nome}</p>
                            </div>
                        ))}
                    </React.Fragment>
                    ):(
                        <React.Fragment>
                            {allWorkSpace?(
                            <p className="font-semibold" >Todos</p>
                            ):(
                                <p className="font-semibold" >Em nenhum</p>
                            )}
                        </React.Fragment>
                    )}
                </div>

                <ReactSVG
                        className={`${!seeAllWorkSpace?"rotate-[90deg]":"rotate-[30deg]"} text-[#1D1B20]`}
                        src="/src/assets/svg/play_arrow_filled.svg"
                />
            </div>
            
        </div>
    );
} ;