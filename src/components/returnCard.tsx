import { useEffect, useState } from "react";
import { useGetCard } from "../hooks/useGetCard";
import { CardGetId } from "./showCard";
import { Card } from "./Card";

const ReturnCard = ({id}:{id:number}) => {

    const {getCardId} = useGetCard();
    const [card, setCard] = useState<CardGetId>();

    useEffect(()=>{
        fetchData();
    },[])


    const fetchData = async () =>{
        const value = await getCardId(id);
        if(value){
            if(value.id === undefined || !value.id) return;
            setCard(value);
        }
    }


    
    return(
        <>
            {card?(
                <Card card={{titulo: card.titulo, descricao: card.descricao, id: card.id, membersList: card.membersList.map(member => ({...member, avatar:member.foto,})), order:1, tags:card.tags}} onClick={()=>{}} />
            ):null}
        </>
    );


};

export default ReturnCard;