import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardType } from '../pages/workSpace';
import { MdOutlineStar } from "react-icons/md";
import { useGetCard } from '../hooks/useGetCard';
import Tags from './tags';

interface CardProps {
  card: CardType;
  onClick: ()=>void;
}

export const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `card-${card.id}`,
    data: {
      type: 'card',
      card,
    },
  });

  const { getCardId } = useGetCard();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const [formattedDate, setFormattedDate] = useState<string>('');
  const {deleteCard} = useGetCard();

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const res = await getCardId(card.id);
        if (res && res.dataHora) {
          console.log(res)
          const inputDate = new Date(res.dataHora);
          const now = new Date();

          const isToday =
            inputDate.getDate() === now.getDate() &&
            inputDate.getMonth() === now.getMonth() &&
            inputDate.getFullYear() === now.getFullYear();

          const day = String(inputDate.getDate()).padStart(2, '0');
          const month = String(inputDate.getMonth() + 1).padStart(2, '0');
          const year = inputDate.getFullYear();

          if (isToday) {
            const hours = String(inputDate.getHours()).padStart(2, '0');
            const minutes = String(inputDate.getMinutes()).padStart(2, '0');
            setFormattedDate(`${day}/${month}/${year} - ${hours}:${minutes}`);
          } else {
            setFormattedDate(`${day}/${month}/${year}`);
          }
        } else {
          setFormattedDate("sem data");
        }
      } catch (error) {
        console.error("Erro ao buscar data do card:", error);
        setFormattedDate("erro");
      }
    };

    fetchDate();
  }, [card.id, getCardId]);


  return (
    <div
    onClick={onClick}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-[#E6E6E6] h-auto max-h-[205px] rounded-md p-3 mb-2 shadow-sm cursor-grab hover:bg-[#dcdbdb] flex flex-col justify-between ${
        isDragging ? 'z-10' : 'z-0'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex gap-2' >
          {card.tags.slice(0,3).map(val=>(
            <Tags color={val.cor} name={val.titulo}/>
          ))}
        </div>
        <MdOutlineStar className='text-[30px] text-4' onClick={()=>{
          deleteCard(card.id);
        }} />
      </div>

      <h3 className="font-bold mb-1 text-[20px] max-h-[100px] overflow-hidden break-words max-w-[100%]">{card.titulo}</h3>

      <div className='flex items-center justify-between'>
        { card && card.membersList && card.membersList.length !== undefined && card.membersList.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {card.membersList.map((membro) => (
              <div 
                key={membro.id} 
                className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white"
                title={membro.nome}
              >
                {membro.avatar ? (
                  <img 
                    src={membro.avatar} 
                    alt={membro.nome} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <p className='font-bold text-white text-[20px]'>{membro.nome.charAt(0)}</p>
                )}
              </div>
            ))}
          </div>
        )}
        <div className='flex items-center'>
          <div className='border-black border-[2px] bg-transparent w-[21px] h-[21px] rounded-full' ></div>
          <p className='ml-2'>{formattedDate}</p>
        </div>
      </div>
      
    </div>
  );
};
