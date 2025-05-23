import React, { ChangeEvent, useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import {BsCheck, BsX} from 'react-icons/bs';
import { useGetWorkSpace } from "../hooks/useGetWorkSpace";
import { useNavigate } from "react-router-dom";
import { ColunaType } from "../pages/workSpace";
import { useGetUser } from "../hooks/useGetUser";

type SelectMenuLeft = {
    name: string;
    isAdmin: boolean;
}

export type workSpaceType = {
    id: number;
    nome: string;
    column: ColunaType[];
};

export default function SelectMenuLeft ({name, isAdmin}:SelectMenuLeft){

    const [onSelected, setOnSelected] = useState(false);
    const [onButtonAdd, setOnButtonAdd] = useState(false);
    const [newArea, setNewArea] = useState('');
    const [showList, setShowList] = useState<workSpaceType[]>([]);
    const {getWorkSpace, postWorkSpace, deleteWorkSpace} = useGetWorkSpace();
    const {getListUserNoSearch} = useGetUser();
    const [update, setUpdate] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        getListWorkSpace();
    },[update])

    const getListWorkSpace = async () => {
        const listWorkSpace = await getWorkSpace();
        
        if (listWorkSpace.length !== 0) {
            const user = localStorage.getItem("user");
            if (!user) return;
    
            const userData = JSON.parse(user);
            const listUsers = await getListUserNoSearch();
            if(!listUsers) return;
            const result = listUsers.items.find((val: { nome: any; }) => val.nome === userData.name);
            if (!result) return;
    
            const userWorkplacesIds = result.workplacesIds || [];
    
            const filteredWorkspaces = listWorkSpace.filter(ws =>
                userWorkplacesIds.includes(ws.id)
            );
    
            setShowList(filteredWorkspaces);
        }
    };
    

    const handleNewArea = (e: ChangeEvent<HTMLInputElement>) => {
            setNewArea(e.currentTarget.value);
    };

    const addList = async () =>{
        
       if(newArea && newArea.trim()){
            const addWorkSpace = await postWorkSpace( newArea);
            if(typeof addWorkSpace === "boolean" && addWorkSpace){
                setUpdate(!update);
            }
       }
    };

    const deleteWorkSpaceFunction = async (id: number) =>{
        const deleteWork = await deleteWorkSpace(id);
            if(typeof deleteWork === "boolean" && deleteWork){
                setUpdate(!update)
            }

    };


    return(
        <React.Fragment>
            {onSelected?(
                <div className="flex flex-col items-center w-[90%] hover:bg-3 rounded-[8px]" >
                    <div className='bg-transparent h-[60px] flex items-center justify-between w-full pl-6 pr-4 rounded-full cursor-pointer ' onClick={()=>{
                        setOnSelected(!onSelected);
                    }} >
                        <div className='flex items-center gap-3'>
                            <ReactSVG
                                className=""
                                src='/src/assets/svg/File.svg'
                            />
                            <h2 className='text-white font-bold' >Área de trabalho</h2>
                        </div>
                        <ReactSVG
                            className="justify-self-end text-white"
                            src="/src/assets/svg/play_arrow_filled@2x.svg"
                        />
                    </div>
                    <div className="w-full h-auto flex flex-col items-center bg-3 rounded-[8px] pb-3 pt-5 gap-1">
                        <div className="flex flex-col h-auto gap-2 w-full max-h-[220px] overflow-y-auto items-center custom-scroll-Two z-10" >
                            {showList.length > 0?(
                                <React.Fragment>
                                    {showList.map(value=>(
                                        <React.Fragment>
                                            <div className={`relative w-[90%] h-[33px] rounded-[6px] text-white flex justify-center items-center  cursor-pointer ${value.nome === name?"bg-4":"hover:bg-6 bg-2"} `} onClick={()=>{
                                                    navigate(`/AreaDeTrabalho/${value.id}`);
                                                }} >
                                                <p className="max-w-[80%] truncate" onClick={()=>{
                                                    navigate(`/AreaDeTrabalho/${value.id}`);
                                                }} >{value.nome}</p>
                                                {isAdmin?(
                                                    <p className="font-bold absolute hover:text-red-600 right-5" onClick={()=>{
                                                        deleteWorkSpaceFunction(value.id);
                                                    }} >X</p>
                                                ):null}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ):null}
                        </div>
                        {onButtonAdd?(
                            <div className="flex w-[90%] h-[33px] rounded-[6px] text-white" >
                                <input type="text" className="rounded-[6px] w-full h-full flex justify-center items-center cursor-pointer hover:bg-6 bg-2 focus:outline-0 text-center" placeholder="Adicione o nome" value={newArea} onChange={handleNewArea} ></input>
                                <BsCheck className="text-[40px] cursor-pointer hover:text-8" onClick={()=>{
                                    addList();
                                }}  />
                                <BsX className="text-[40px] cursor-pointer hover:text-red-500" onClick={()=>{
                                    setOnButtonAdd(false);
                                }}/>
                            </div>
                        ):null}
                        {isAdmin?(
                            <p className="text-5 hover:scale-105 transition-all duration-300 cursor-pointer mt-1" onClick={()=>{
                            setOnButtonAdd(true);
                        }} >+Criar nova área de trabalho</p>
                        ):null}
                    </div>
                </div>
                  
            ):(
                <div className='bg-transparent hover:bg-3 h-[60px] flex items-center justify-between w-[90%] pl-6 pr-4 rounded-full cursor-pointer' onClick={()=>{
                    setOnSelected(!onSelected);
                }}>
                    <div className='flex items-center gap-3'>
                        <ReactSVG
                            className=""
                            src='/src/assets/svg/File.svg'
                        />
                        <h2 className='text-white font-bold' >Área de trabalho</h2>
                    </div>
                    <ReactSVG
                        className="justify-self-end text-white"
                        src="/src/assets/svg/play_arrow_filled.svg"
                    />
                </div>
            )}
        </React.Fragment>
    );
}