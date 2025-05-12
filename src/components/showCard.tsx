import  { useEffect, useState } from "react";
import { useGetCard } from "../hooks/useGetCard";
import { BiSolidPencil } from "react-icons/bi";
import AddMember from "./addMember";
import ButtonAnimationMore from "./buttonAnimationMore";
import ImgUser from "./imgUser";
import Tags from "./tags";
import AddTags from "./addTags";
import { Check } from "lucide-react"; 
import { BsCheck, BsX } from "react-icons/bs";
import { CiPen } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import React from "react";
import AddAnex from "./addAnex";
import Status from "./status";
import CheckList from "./checkList";
import DateTime from "./dateTime";
import CommentCard from "./comment";

export type Membro = {
    id: number;
    nome: string;
    foto: string;
};
  
export type Check = {
    id: number;
    concluido: boolean;
    descricao: string;
    dataHora: string; 
    memberslist: Membro[];
};
  
export type Comentario = {
    id: number;
    usuario: string;
    mensagem: string;
    foto: string;
    dataHora: string; 
    anexo: string;
};
  
export type Tag = {
    id: number;
    titulo: string;
    cor: string;
    tagId?: number; 
};
  
export type CardGetId = {
    id: number;
    titulo: string;
    descricao: string;
    dataHora: string; 
    membersList: Membro[];
    checklist: Check[];
    comentarios: Comentario[];
    tags: Tag[];
    anexos: string[];
};

export default function ShowCard ({id, nameColumn, closeCard, updateN}:{id: number, nameColumn: string, closeCard: ()=>void, updateN: ()=>void}) {

    //hook Card
    const {getCardId, editCard, deleteCard} = useGetCard();

    //value card
    const [card, setCard] = useState<CardGetId>();

    //edit Time Card
    const [dateCard, setDateCard] = useState<string>();
    const [timeCard, setTimeCard] = useState<string>();
    const [trueEditCard, setTrueEditCard] = useState(false);

    //List Card
    const [showListUsers, setShowListUsers] = useState(false);
    const [showListTags, setShowListTags] = useState(false);

    //Edit Card infor
    const [description, setDescription] = useState("");
    const [editCardInfor, setEditCardInfor] = useState(false);
    const [nameCard, setNameCard] = useState("");

    //update useEffect
    const [update, setUpdate] = useState(false);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateCard(e.target.value);
    };
    
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeCard(e.target.value);
    };

    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleNameCard = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameCard(e.target.value);
    };


    useEffect(()=>{
        if(id){
            const inforCard = getCardId(id);
            inforCard.then(value=>{
                if(value && (typeof value !== "string" ||  value !== undefined)){
                    setCard(value);
                    const res = transfDateTime(value.dataHora);
                    setDateCard(res.date);
                    setTimeCard(res.time);
                    setDescription(value.descricao);
                    setNameCard(value.titulo);
                    console.log(value)
                }
            })
        }   
    },[update]);

     const transfDateTime = (date: string) => {
        const fullDate = new Date(date);
        const formattedDate = fullDate.toLocaleDateString("sv-SE"); 
        const formattedTime = fullDate.toLocaleTimeString("pt-BR", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return {
            date: formattedDate,
            time: formattedTime
        };
    };
    
    
    const editDateTime = () =>{
        if(card && dateCard && timeCard){
            const dateTimeBetw = criarDataLocal(dateCard, timeCard);
            const res = editCard({CardId: card?.id, dataHora:dateTimeBetw});
            res.then(val=>{
                if(typeof val === "boolean" && val){
                    setTrueEditCard(false);
                    setUpdate(!update);
                    updateN();
                }
            })
        }
    };

    const criarDataLocal = (data: string, hora: string): Date => {
        const [ano, mes, dia] = data.split("-").map(Number);
        const [horaH, minuto] = hora.split(":").map(Number);
        const dataLocal = new Date(ano, mes - 1, dia, horaH, minuto);

        const offsetMin = dataLocal.getTimezoneOffset(); 
        const utcTime = new Date(dataLocal.getTime() - offsetMin * 60 * 1000);

        return utcTime;
    };


    useEffect(()=>{
        if(card){
            const res = transfDateTime(card.dataHora);
            if(dateCard !== res.date || timeCard !== res.time){
                setTrueEditCard(true);
            }
        }
    },[dateCard, timeCard])

    const editDescription = () => {
        if(card && description !== card?.descricao){
            const res = editCard({CardId: card.id, Descricao: description});
            res.then(val=>{
                if(typeof val === "boolean" && val){
                    setUpdate(!update);
                    updateN();
                }
            })
        };
    }

    const editNameCardNew = () =>{
        if(card && nameCard !== card?.titulo){
            const res = editCard({CardId: card.id, Titulo: nameCard});
            res.then(val=>{
                if(typeof val === "boolean" && val){
                    setUpdate(!update);
                    setEditCardInfor(false);
                    updateN();
                }
            })
        }   
    }


    return(
        <section className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center custom-scroll-Two " >
            {card?(
                <div className="w-full h-full lg:w-[879px] relative bg-[#00447B]/70 lg:rounded-[40px] lg:mt-5 backdrop-blur px-5 lg:px-10 lg:max-h-[95vh] lg:pb-10" >
                    {editCardInfor?(
                        <div className="text-white items-center flex pt-12 pb-5 gap-2 " >
                            <input type="text" value={nameCard} className=" max-w-[200px] bg-transparent border-b-white border-b-[2px] text-[32px] font-bold mt-[-10px] focus:outline-0" onChange={handleNameCard} />
                            <BsCheck className="text-[40px] cursor-pointer hover:text-8" onClick={()=>{
                                editNameCardNew();
                            }}  />
                            <BsX className="text-[40px] cursor-pointer hover:text-red-500" onClick={()=>{
                                setEditCardInfor(false);
                            }}/>
                            <FaRegTrashAlt className="text-[20px] cursor-pointer hover:text-red-500" onClick={()=>{
                                const res = deleteCard(card.id);
                                res.then(val=>{
                                    if(typeof val === "boolean" && val){
                                        updateN();
                                        closeCard();
                                    }
                                })
                            }} />
                        </div>
                    ):(
                        <div className="text-white flex pt-12 gap-5 pb-5 " >
                            <Status card={card} />
                            <div className="flex flex-col" >
                                <p className="text-[24px] sm:text-[32px] font-bold mt-[-10px] max-w-[200px] truncate" >{nameCard}</p>
                                <p >em {nameColumn}</p>
                            </div>
                            <BiSolidPencil className='text-[32px] text-white cursor-pointer hover:text-white/80 hover:scale-105 transition-all duration-300' onClick={()=>{
                                setEditCardInfor(true);
                            }} />
                        </div>
                        )}
                    <div onClick={closeCard} className="absolute top-3 right-3 sm:top-7 sm:right-7 flex items-center justify-center w-8 h-8 text-[20px] sm:w-[43px] sm:h-[43px] rounded-full bg-white font-bold text-black sm:text-[32px] cursor-pointer hover:text-4" ><p >X</p></div>
                    <div className="flex flex-col h-[85%] overflow-y-auto pr-2 " >
                        <div className="flex max-lg:flex-col text-white mt-7 lg:gap-15 gap-10" >
                            <div className="flex flex-col" >
                                <p>Membros</p>
                                <div className="flex gap-5 mt-1" >
                                    {card.membersList.length > 0?(
                                        <div className="flex gap-2" >
                                            {card.membersList.slice(0, 2).map(val=>(
                                                <ImgUser id={val.id} img={val.foto} nome={val.nome} color="bg-4"/>
                                            ))}
                                            <ButtonAnimationMore onClick={()=>{setShowListUsers(!showListUsers)}} value={showListUsers} />
                                        </div>
                                    ):(
                                        <ButtonAnimationMore onClick={()=>{setShowListUsers(!showListUsers)}} value={showListUsers} />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col " >
                                <p>Tags</p>
                                <div className="flex gap-5 mt-1 " >
                                    {card.tags.length > 0?(
                                        <div className="flex gap-2 flex-wrap w-[195px]" >
                                            {card.tags.slice(0, 3).map(val=>(
                                                <Tags color={val.cor} name={val.titulo} />
                                            ))}
                                            <ButtonAnimationMore type="tag" onClick={()=>{setShowListTags(!showListTags)}} value={showListTags} />
                                        </div>
                                    ):(
                                        <ButtonAnimationMore type="tag" onClick={()=>{setShowListTags(!showListTags)}} value={showListTags} />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col" >
                                <p className="mb-3" >Data de Entrega</p>
                                {dateCard && timeCard?(
                                    <DateTime add={()=>{
                                        editDateTime();
                                    }} close={()=>{
                                        const res = transfDateTime(card.dataHora);
                                        setDateCard(res.date);
                                        setTimeCard(res.time);
                                        setTrueEditCard(false);
                                    }} dateCard={dateCard} handleDateChange={handleDateChange} handleTimeChange={handleTimeChange} timeCard={timeCard} trueEditCard={trueEditCard} />
                                ):null}
                            </div>
                        </div>
                        {showListUsers?(
                            <AddMember card={card} />
                        ):null}
                        {showListTags?(
                            <AddTags cardListTag={card.tags} update={()=>{
                                setUpdate(!update)
                                updateN();
                            }} cardId={card.id} />
                        ):null}
                        <div className="flex flex-col mt-10 max-sm:mb-10" >
                            <p className="font-bold text-white text-[24px]" >Descrição</p>
                            <textarea name="description" id="description" value={description} onChange={handleDescription} className="mt-5 mb-3 focus:outline-0 focus:bg-2/50 text-white h-[100px] max-h-[100px] focus:pl-3 focus:px-3" ></textarea>
                            {description !== card.descricao?(
                                <div className="flex mt-1 gap-5 text-white items-center mb-5" >
                                    <div className="flex gap-2 items-center cursor-pointer hover:scale-105 transition-all duration-300" onClick={editDescription} >
                                        <CiPen className="text-[27px]" />
                                        <p>Editar</p>
                                    </div>
                                    <div className="flex gap-2 items-center cursor-pointer hover:scale-105 transition-all duration-300" onClick={()=>{
                                        setDescription(card.descricao);
                                    }} >
                                        <FaRegTrashAlt className="text-[20px]" />
                                        <p>Excluir</p>
                                    </div>
                                </div>
                            ):null}
                        </div>
                        <AddAnex CardId={card.id}  listAnex={card.anexos} update={()=>{setUpdate(!update)}}/>
                        <CheckList checklist={card.checklist} card={card} update={()=>{setUpdate(!update)}} />
                        <CommentCard update={()=>{setUpdate(!update)}} card={card} key={card.id} />
                    </div>
                </div>
            ):(
                <p className="font-bold text-white text-[20px]" >Card não existe</p>
            )}
        </section>
    );
}