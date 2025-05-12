import BoxCheck from "./boxCheck";
import ImgUser from "./imgUser";
import { FaRegTrashAlt } from "react-icons/fa";
import { Check } from "./showCard";
import DateChecklist from "./dateChecklist";
import { useState } from "react";
import DateTime from "./dateTime";
import AcceptAndClose from "./acceptAndClose";
import ButtonAnimationMore from "./buttonAnimationMore";
import { createDateLocal, transfDateTime } from "../functions/checklist";
import AddMemberCheckList from "./addMemberCheckList";
import { useGetChecklistCard } from "../hooks/useGetCheckList";

type showItemChecklist = {
    val:Check;
    clickBox:()=>void;
    removeChecklist:()=>void;
    update: ()=>void;
};

const ShowItemChecklist = ({val, clickBox, removeChecklist, update}:showItemChecklist) => {

    const dateResult = transfDateTime(val.dataHora);
    const [editCheckList, setEditCheckList] = useState(false);
    const [dateCard, setDateCard] = useState<string>(dateResult.date);
    const [timeCard, setTimeCard] = useState<string>(dateResult.time);
    const [descriptioCheck, setDescriptionCheck] = useState(val.descricao);
    const [showListUsers, setShowListUsers] = useState(false);

    const {editChecklist} = useGetChecklistCard();

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateCard(e.target.value);
    };
    
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeCard(e.target.value);
    };

    const handleDescriptionCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescriptionCheck(e.target.value);
    };

    const EditCheckList = () =>{
        if(descriptioCheck || timeCard || dateCard){
            alert("A API não está editando");
            const dateNew = createDateLocal(dateCard, timeCard);
            const res = editChecklist({Id:val.id, DataHora:dateNew, Descricao:descriptioCheck});
            if(typeof res === "boolean" && res){
                update();
            }
        }
    };

    return(
        <div className="flex flex-col items-start" >
            {editCheckList?(
                <div className="flex max-sm:flex-wrap max-sm:justify-center items-center sm:gap-3 gap-5" >
                    <input type="text" placeholder="Adicionar Descrição" className="border-b-white border-b-[2px] focus:outline-0" onChange={handleDescriptionCheck} value={descriptioCheck} />
                    <DateTime add={()=>{}} close={()=>{}} dateCard={dateCard} handleDateChange={handleDateChange} handleTimeChange={handleTimeChange} timeCard={timeCard} trueEditCard={false} />
                    <AcceptAndClose add={EditCheckList} close={()=>{setEditCheckList(false)}} />
                    {val.memberslist && val.memberslist.length > 0?(
                        <div className="flex gap-2" >
                            {val.memberslist.slice(0, 1).map(val=>(
                                <ImgUser id={val.id} img={val.foto} nome={val.nome} color="bg-4"/>
                            ))}
                            <ButtonAnimationMore onClick={()=>{
                                setShowListUsers(!showListUsers);
                            }} value={showListUsers} />
                        </div>
                    ):(
                        <ButtonAnimationMore onClick={()=>{
                            setShowListUsers(!showListUsers);
                        }} value={showListUsers} />
                    )}
                </div>
            ):(
                <div className="flex  items-center justify-between w-full" >
                    <div className="flex items-center gap-3" >  
                        <BoxCheck value={val.concluido} click={clickBox} />
                        <p className={`${val.concluido?"line-through":""} max-w-[500px] break-words overflow-y-auto max-h-[80px]`} >{val.descricao}</p>
                    </div>
                    <div className="flex items-center gap-3" >
                        <DateChecklist val={val} />
                        {val.memberslist && val.memberslist.map(res=>(
                            <ImgUser color="bg-4" img={res.foto} nome={res.nome} id={res.id} size="w-[33px] h-[33px] text-[20px]" />
                        ))}
                        <FaRegTrashAlt className="text-[20px] cursor-pointer hover:text-red-500" onClick={()=>{
                            removeChecklist();
                        }} />
                    </div>
                </div>
            )}                              
            {!editCheckList?(
                <p className="ml-8 hover:text-4 cursor-pointer" onClick={()=>{setEditCheckList(true)}}  >Editar item</p>
            ):null}

            {showListUsers?(
                <AddMemberCheckList listMember={val.memberslist} idChecklist={val.id} update={update} description={val.descricao} />
            ):null}
        </div>
    );
}

export default ShowItemChecklist