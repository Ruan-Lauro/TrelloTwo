import React, { ChangeEvent, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './Card';
import { ColunaType } from '../pages/workSpace';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BiSolidPencil } from "react-icons/bi";
import { useGetColumn } from '../hooks/useGetColunm';
import { BsCheck, BsX } from 'react-icons/bs';
import { useGetCard } from '../hooks/useGetCard';


interface ColunaProps {
  coluna: ColunaType;
  functionUptade: ()=>void;
  inforCard: (number:number, show: boolean, nameColumn:string, status?:number)=> void;
}

export const Coluna: React.FC<ColunaProps> = ({ coluna, functionUptade, inforCard }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `coluna-${coluna.id}`,
    data: {
      type: 'coluna',
      coluna,
    },
  });

  const {editColum} = useGetColumn();
  const [name, setName] = useState(coluna.nome);
  const [editName, setEditName] = useState(false);
  const {createCard} = useGetCard();

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Ordenar cards pela propriedade 'order'
  const sortedCards = [...coluna.cards].sort((a, b) => a.order - b.order);

  const addNameColuna = async () => {
    if(name !== coluna.nome){
      const res = await editColum({id:coluna.id, nome:name});
      if(typeof res === "boolean" && res){
        setEditName(!editName);
      }
    }else{
      setEditName(!editColum);
      return;
    }
  };


  const createCardNew = () => {
    const res = createCard({ColunaId: coluna.id, Descricao:"Coloque uma descriçaõ", Titulo:"Edite o Card", DataHora:null});
    if(typeof res === "object" && res !== undefined){
      functionUptade();
    } 
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-md flex-shrink-0 flex flex-col w-[220px] xl:w-[459px] max-h-[65vh] pb-3 ${
        isDragging ? 'z-10' : 'z-0'
      }`}
    >
      {/* Cabeçalho da coluna - área arrastável */}
      <div
        {...attributes}
        {...listeners}
        className="p-3 bg-white rounded-t-lg flex justify-between items-center cursor-grab "
      >
        
          {editName?(
            <div className='flex items-center' >
              <input type="text" className='border-b-[2px] border-1 focus:outline-0 font-bold xl:text-[24px] text-2 max-xl:w-[120px]' placeholder={name} onChange={handleName} />
              <BsCheck className="text-[20px] xl:text-[40px] text-1 cursor-pointer hover:text-8" onClick={()=>{
                  addNameColuna();
              }}  />
              <BsX className="text-[20px] xl:text-[40px] text-1 cursor-pointer hover:text-red-500" onClick={()=>{
                  setName(coluna.nome);
                  setEditName(!editColum);
              }}/>
            </div>
          ):(
            <div className='flex items-center' >
              <h2 className="font-bold xl:text-[24px] text-2 truncate max-w-[100px]">{name}</h2>
            <BiSolidPencil className='xl:text-[22px] text-2' onClick={()=>{
              setEditName(!editName);
            }} />
            </div>
          )}

        <div className='flex items-center justify-center text-1 font-bold text-[20px] xl:text-[30px] border-1 border-[3px] w-5 h-5 xl:w-9 xl:h-9 rounded-full' onClick={createCardNew} >
          <p className='mb-1' >+</p>
        </div>
      </div>

      {/* Container dos cards */}
      <div className=" p-2 flex-grow overflow-y-auto ">
        <SortableContext
          items={sortedCards.map(card => `card-${card.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {sortedCards.map((card) => (
            <Card key={card.id} card={card}  onClick={()=>{inforCard(card.id, true, coluna.nome,)}}/>
          ))}
        </SortableContext>

        {sortedCards.length === 0 && (
          <div className="p-3 text-center text-gray-400 italic border-dashed border-gray-200 rounded-lg mt-2 ">
            Arraste cards para esta coluna
          </div>
        )}
      </div>
    </div>
  );
};