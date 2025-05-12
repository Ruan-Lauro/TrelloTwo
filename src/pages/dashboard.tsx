import { useEffect, useState } from "react";
import LayoutPage from "../components/layoutPage";
import { useDashboard } from "../hooks/useGetDashboard";
import React from "react";
import { MdOutlineStar } from "react-icons/md";
import ReturnCard from "../components/returnCard";
import { MdWarningAmber } from "react-icons/md";
import { FaRegEnvelope } from "react-icons/fa";
import ImgUser from "../components/imgUser";
import ProgressChart from "../components/progressChart";

type lateCards = {
    id: number;
    descricao: string;
    prazo: Date;
}

type markedCards = {
    id: number;
    descricao: string;
    prazo: Date;
}

type cards = {
    lateCards: lateCards[];
    markedCards: markedCards[]
};

type mensagens = {
    id: number;
    texto: string;
    nome: string;
    qtdNaoVistos: number;
    foto: string;
}

type workspaces = {
    id: number;
    nome: string;
}

export type dashboard = {
    cards: cards;
    mensagens: mensagens[];
    workspaces: workspaces[];
};

function Dashboard (){

    const {getDashboardData} = useDashboard();
    const [dashboardValue, setDashboardValue] = useState<dashboard | null>( null);

    useEffect(()=>{
        fetchdata();
    },[])

    const fetchdata = async () => {
        const value = await getDashboardData();
        if(value && typeof value !== "string"){
            setDashboardValue(value);
            console.log(value)
        }
    };

    return(
        <LayoutPage name="Dashboard" loadingValue={false} >
            <main className="w-full overflow-y-auto p-6 bg-gray-100 h-[100%] min-w-[350px]" >
                {dashboardValue?(
                    <section className="flex max-2xl:flex-wrap gap-5 items-start" >
                        <div className="bg-white rounded-lg shadow-md flex-shrink-0 flex flex-col w-[320px] 3xl:w-[459px] max-h-[65vh] pb-3" >
                            <div className="p-3 bg-white rounded-t-lg flex justify-between items-center cursor-grab ">
                                <div className='flex items-center gap-3' >
                                      <MdOutlineStar className='text-[30px] text-4' />
                                    <h2 className="font-bold xl:text-[24px] text-2 truncate max-xl:max-w-[100px]">Cards Marcados</h2>
                                </div>
                            </div>
                            <div className=" p-2 flex-grow overflow-y-auto ">
                                {dashboardValue.cards.markedCards.length > 0?(
                                    <React.Fragment>
                                        {dashboardValue.cards.markedCards.map(res=>(
                                            <ReturnCard id={res.id}/>
                                        ))}
                                    </React.Fragment>
                                ):(
                                    <p>Sem nenhum...</p>
                                )}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md flex-shrink-0 flex flex-col w-[320px] 3xl:w-[459px] max-h-[65vh] pb-3" >
                            <div className="p-3 bg-white rounded-t-lg flex justify-between items-center cursor-grab ">
                                <div className='flex items-center gap-3' >
                                      <MdWarningAmber className='text-[30px] text-red-700' />
                                    <h2 className="font-bold xl:text-[24px] text-2 truncate max-xl:max-w-[100px]">Cards em atraso</h2>
                                </div>
                            </div>
                            <div className=" p-2 flex-grow overflow-y-auto ">
                                {dashboardValue.cards.lateCards.length > 0?(
                                    <React.Fragment>
                                        {dashboardValue.cards.lateCards.map(res=>(
                                            <ReturnCard id={res.id}/>
                                        ))}
                                    </React.Fragment>
                                ):(
                                    <p>Sem nenhum...</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3" >
                            <div className="bg-white rounded-lg shadow-md flex-shrink-0 flex flex-col w-[320px] 3xl:w-[459px] max-h-[348px] pb-3" >
                                <div className="p-3 bg-white rounded-t-lg flex justify-between items-center cursor-grab ">
                                    <div className='flex items-center gap-3' >
                                        <FaRegEnvelope className='text-[30px] text-1' />
                                        <h2 className="font-bold xl:text-[24px] text-2 truncate max-xl:max-w-[100px]">Mensagens</h2>
                                    </div>
                                </div>
                                <div className=" p-2 flex-grow overflow-y-auto ">
                                    {dashboardValue.cards.lateCards.length > 0?(
                                        <React.Fragment>
                                            {dashboardValue.mensagens.map(res=>(
                                                <div className="flex items-center mb-2 bg-[black]/10 hover:bg-[black]/15 cursor-pointer rounded-[8px] justify-between p-4 " >
                                                    <div className="flex gap-3">
                                                         <ImgUser color="bg-4" id={res.id} nome={res.nome} img={res.foto} size="w-[44px] h-[44px]"/>
                                                        <div className="flex flex-col" >
                                                            <p className="font-bold text-[20px] 3xl:text-[24px]" >{res.nome}</p>
                                                            <p className="max-w-[150px]" >{res.texto}</p> 
                                                        </div>
                                                    </div>
                                                    <div className="bg-2 flex items-center justify-center w-7 h-7 rounded-full" >
                                                        <p className="text-white font-bold" >{res.qtdNaoVistos}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ):(
                                        <p>Sem nenhum...</p>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md flex-shrink-0 flex flex-col w-[320px] 3xl:w-[459px] max-h-[348px] pb-3" >
                                 <div className="flex flex-col w-full px-3 mb-5 mt-2 ">
                                    <span className="text-sm text-gray-500">Projeto: </span>
                                    <select className="pl-2 text-sm text-gray-700 outline-none border-[#C9C9C9] rounded-[8px] border-[1px] h-[45px]">
                                        {dashboardValue.workspaces.map(res=>(
                                            <option value={res.id} >{res.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <ProgressChart/>
                            </div>
                        </div>
                    </section>
                ):null}
               
            </main>
        </LayoutPage>
    );
}

export default Dashboard;