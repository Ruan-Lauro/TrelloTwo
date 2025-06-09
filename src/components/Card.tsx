import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardType } from '../pages/workSpace';
import { MdOutlineStarBorder } from "react-icons/md";
import { useGetCard } from '../hooks/useGetCard';
import Tags from './tags';

interface CardProps {
  card: CardType;
  onClick: () => void;
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
  const [width, setWidth] = useState(window.innerWidth);
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  const [clickStartTime, setClickStartTime] = useState<number>(0);
  const [dragStarted, setDragStarted] = useState(false);
  const clickThreshold = 150; 

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handlePointerDown = () => {
    setClickStartTime(Date.now());
    setDragStarted(false);
  };

  const handlePointerUp = () => {
    const clickDuration = Date.now() - clickStartTime;
    
    if (clickDuration < clickThreshold && !isDragging && !dragStarted) {
      setTimeout(() => {
        if (!isDragging) {
          onClick();
        }
      }, 50);
    }
    
    setDragStarted(false);
  };

  useEffect(() => {
    if (isDragging) {
      setDragStarted(true);
    }
  }, [isDragging]);

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const res = await getCardId(card.id);
        if (res && res.dataHora) {
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

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={`
        bg-[#E6E6E6] h-auto max-h-[205px] rounded-md p-3 mb-2 shadow-sm 
        cursor-grab hover:bg-[#dcdbdb] flex flex-col justify-between 
        transition-colors duration-150
        touch-none select-none
        -webkit-touch-callout-none
        -webkit-tap-highlight-color-transparent
        ${isDragging ? 'z-50 cursor-grabbing' : 'z-0'}
        ${dragStarted ? '' : ''}
      `}
      // @ts-ignore

      style={{
        
        ...style,
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      {/* Container principal do conteúdo - pointer-events-none para evitar interferência */}
      <div className="pointer-events-none">
        <div className='flex items-center justify-between'>
          <div className='flex gap-2'>
            {card.tags.slice(0, width > 1820 ? 3 : 1).map((val, index) => (
              <Tags key={index} color={val.cor} name={val.titulo} />
            ))}
          </div>
          <MdOutlineStarBorder 
            className='text-[30px] text-4' 
          />
        </div>

        <h3 className="font-bold mb-1 xl:text-[20px] max-h-[100px] overflow-hidden break-words max-w-[100%]">
          {card.titulo}
        </h3>

        <div className='flex items-center justify-between'>
          {card && card.membersList && card.membersList.length !== undefined && card.membersList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.membersList.map((membro) => (
                <div 
                  key={membro.id} 
                  className="w-8 h-8 xl:w-11 xl:h-11 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white"
                  title={membro.nome}
                >
                  {membro.avatar ? (
                    <img 
                      src={import.meta.env.VITE_LINK_API + membro.avatar} 
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
            <div className={`border-black border-[2px] bg-transparent w-[21px] h-[21px] rounded-full`}></div>
            <p className='ml-2 max-xl:text-[14px]'>{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};