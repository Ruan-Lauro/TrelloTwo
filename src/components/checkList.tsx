import { CardGetId, Check } from "./showCard";
import React, { useState } from "react";
import DateTime from "./dateTime";

// import { Membro } from "./showCard";
import AcceptAndClose from "./acceptAndClose";
import { useGetChecklistCard } from "../hooks/useGetCheckList";
import ShowItemChecklist from "./showItemChecklist";
import { createDateLocal } from "../functions/checklist";

type checkList = {
    checklist:Check[];
    card: CardGetId;
    update: ()=> void;
}

const CheckList = ({checklist, card, update}:checkList) => {

    const now = new Date();

    const formattedDate = now.toISOString().split("T")[0];

    const formattedTime = now.toTimeString().slice(0, 5);

    const [trueAddCheckList, setTrueAddCheckList] = useState(false);

    const [dateCard, setDateCard] = useState<string>(formattedDate);
    const [timeCard, setTimeCard] = useState<string>(formattedTime);
    const [descriptioCheck, setDescriptionCheck] = useState("");

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateCard(e.target.value);
    };
    
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeCard(e.target.value);
    };

    const handleDescriptionCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescriptionCheck(e.target.value);
    };

    const { createChecklist, toggleChecklist} = useGetChecklistCard();


    const addItemCheckList = () =>{
        if(descriptioCheck && timeCard && dateCard){
            const res = createChecklist({CardId: card.id, DataHora: createDateLocal(dateCard, timeCard), Descricao:descriptioCheck});
            res.then(ele=>{
                if(typeof ele === "boolean" && ele){
                    update();
                }
            })
        }
    }


    return(
        <div className="flex flex-col items-center gap-2 text-white mt-10">
            <div className="flex justify-between w-full" >
                <p className="font-bold text-2xl">CheckList</p>
                {checklist && checklist.length>0?(
                    <p className={`text-2xl ${checklist.filter(val=>val.concluido).length === checklist.length?"text-4":""}`}>{checklist.filter(val=>val.concluido).length}/{checklist.length}</p>
                ):(
                    <p className="text-2xl">0/0</p>
                )}
            </div>
            <div className="flex flex-col gap-5 mt-5 w-full" >
                {checklist && checklist.length > 0?(
                    <>
                        {checklist.map(val=>(
                            <ShowItemChecklist val={val} clickBox={()=>{
                                const res = toggleChecklist(val.id);
                                res.then(res=>{
                                    if(typeof res === "boolean" && res){
                                        update();
                                    }
                                })
                            }} removeChecklist={()=>{alert("Não criada na API")}} update={update} />
                        ))}
                    </>
                ):(
                    <p className="text-white/50" >Adicione algum</p>
                )}
            </div>
            <div className="flex flex-col w-full" >
                {trueAddCheckList?(
                    <div className="flex items-center gap-3" >
                        <input type="text" placeholder="Adicionar Descrição" className="border-b-white border-b-[2px] focus:outline-0" onChange={handleDescriptionCheck} value={descriptioCheck} />
                        <DateTime add={()=>{}} close={()=>{}} dateCard={dateCard} handleDateChange={handleDateChange} handleTimeChange={handleTimeChange} timeCard={timeCard} trueEditCard={false} />
                        <AcceptAndClose add={addItemCheckList} close={()=>{setTrueAddCheckList(false)}} />
                    </div>
                ):null}
                {!trueAddCheckList?(
                    <p className="mt-3 self-end cursor-pointer hover:text-4" onClick={()=>{
                        setTrueAddCheckList(true);
                    }} >Adicionar item</p>
                ):null}
            </div>
            
        </div> 
    );
};

export default CheckList;