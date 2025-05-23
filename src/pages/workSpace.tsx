import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Coluna } from '../components/Coluna';
import { Card } from '../components/Card';
import LayoutPage from '../components/layoutPage';
import { useParams } from 'react-router-dom';
import { useGetWorkSpace } from '../hooks/useGetWorkSpace';
import { useGetColumn } from '../hooks/useGetColunm';
import { useGetCard } from '../hooks/useGetCard';
import ShowCard, { Tag } from '../components/showCard';

// Definição dos tipos
export type Membro = {
  id: number;
  nome: string;
  avatar: string;
};

export type CardType = {
  id: number;
  order: number;
  titulo: string;
  descricao: string;
  membersList: Membro[];
  dataHora?: Date;
  tags: Tag[];
};

export type ColunaType = {
  id: number;
  nome: string;
  order: number;
  cards: CardType[];
};

export type WorkSpaceNew = {
  id: number;
  nome: string;
  colunas: ColunaType[];
}

const WorkSpace = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'card' | 'coluna' | null>(null);
  const [WorkSpace, setWorkSpace] = useState<WorkSpaceNew>();
  const [update, setUpdate] = useState(false);
  const {getWorkSpaceId} = useGetWorkSpace();
  const {moveColum, creatColum} = useGetColumn();
  const {moveCard} = useGetCard();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [click, setClick] = useState(false);
  const [idCard, setIdCard] = useState<number>();
  const [columnName, setColumnName] = useState("");
  
  const [colunas, setColunas] = useState<ColunaType[]>([]);

  useEffect(()=>{
    if(id){
      const token = localStorage.getItem('token');
      if(token){
        const workSpace = getWorkSpaceId(parseInt(id));
        console.log(workSpace)
        workSpace.then((res) => {
          if (res && typeof res === 'object' && !Array.isArray(res)) {
            const workspaceE = res as WorkSpaceNew;
            setWorkSpace(workspaceE);
            console.log(workspaceE)
            setColunas(workspaceE.colunas)
          } else {
            console.warn('Resposta inesperada:', res);
          }
        });
      }
    }
  },[update, id]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const id = active.id.toString();
    
    // Determinar se estamos arrastando uma coluna ou um card
    if (id.includes('coluna-')) {
      setActiveType('coluna');
      setActiveId(id.replace('coluna-', ''));
    } else if (id.includes('card-')) {
      setActiveType('card');
      setActiveId(id.replace('card-', ''));
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveType(null);
      return;
    }

    setLoading(true);

    if (activeType === 'coluna' && over.id.toString().includes('coluna-')) {
      const activeColumnId = parseInt(active.id.toString().replace('coluna-', ''));
      const overColumnId = parseInt(over.id.toString().replace('coluna-', ''));
      
      if (activeColumnId !== overColumnId) {
        setColunas((prevColunas) => {
          const oldIndex = prevColunas.findIndex((col) => col.id === activeColumnId);
          const newIndex = prevColunas.findIndex((col) => col.id === overColumnId);
          
          const reordered = arrayMove(prevColunas, oldIndex, newIndex);
          
          const updatedColumns = reordered.map((col, index) => ({
            ...col,
            order: index,
          }));

          if (id) {
            const token = localStorage.getItem('token');
            if (token) {
              console.log(activeColumnId)
              console.log(newIndex)
              const value =  moveColum(activeColumnId, newIndex);
              value.then(res=>{
                if(typeof res === "boolean" && res){
                  console.log("Aquiiiii")
                  setLoading(false);
                } 
              })
            }
          }
          
          return updatedColumns;
        });
      }
    }
    
    setActiveId(null);
    setActiveType(null);
    setLoading(false);
  }, [activeType]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (activeType === 'card') {
      const activeCardId = parseInt(active.id.toString().replace('card-', ''));
      
      if (over.id.toString().includes('card-')) {

        const overCardId = parseInt(over.id.toString().replace('card-', ''));
        
        if (activeCardId !== overCardId) {
          setColunas((prevColunas) => {
            let activeColumnIndex = -1;
            let activeCardIndex = -1;
            let overColumnIndex = -1;
            let overCardIndex = -1;
            
            prevColunas.forEach((coluna, colIndex) => {
              const cardActiveIndex = coluna.cards.findIndex(card => card.id === activeCardId);
              const cardOverIndex = coluna.cards.findIndex(card => card.id === overCardId);
              
              if (cardActiveIndex !== -1) {
                activeColumnIndex = colIndex;
                activeCardIndex = cardActiveIndex;
              }
              
              if (cardOverIndex !== -1) {
                overColumnIndex = colIndex;
                overCardIndex = cardOverIndex;
              }
            });
            
            if (activeColumnIndex === overColumnIndex) {
              console.log("Se ambos os cards estão na mesma coluna, apenas reordene")
              const newCards = arrayMove(
                prevColunas[activeColumnIndex].cards,
                activeCardIndex,
                overCardIndex
              );
              
              const updatedCards = newCards.map((card, index) => ({
                ...card,
                order: index,
              }));
              
              const updatedColunas = [...prevColunas];
              updatedColunas[activeColumnIndex] = {
                ...updatedColunas[activeColumnIndex],
                cards: updatedCards,
              };

            const colunaId = prevColunas[activeColumnIndex].id;
            moveCard({
              CardId: activeCardId,
              ColunaId: colunaId,
              Order: overCardIndex + 1
            });
            console.log("Resultado mesma coluna:")
            console.log({
              CardId: activeCardId,
              ColunaId: colunaId,
              Order: overCardIndex + 1
            })
            
              
              return updatedColunas;
            } 
            else {
              console.log("Se os cards estão em colunas diferentes, mova o card para a nova coluna")
              const updatedColunas = [...prevColunas];
              
              const [movedCard] = updatedColunas[activeColumnIndex].cards.splice(activeCardIndex, 1);
              
              updatedColunas[activeColumnIndex].cards = updatedColunas[activeColumnIndex].cards.map((card, index) => ({
                ...card,
                order: index,
              }));
              
              updatedColunas[overColumnIndex].cards.splice(overCardIndex, 0, movedCard);
              
              updatedColunas[overColumnIndex].cards = updatedColunas[overColumnIndex].cards.map((card, index) => ({
                ...card,
                order: index,
              }));

            const novaColunaId = prevColunas[overColumnIndex].id;
            moveCard({
              CardId: activeCardId,
              ColunaId: novaColunaId,
              Order: overCardIndex + 1
            });
            console.log("Resultado colunas diferentes:")
            console.log({
              CardId: activeCardId,
              ColunaId: novaColunaId,
              Order: overCardIndex + 1
            })
              return updatedColunas;
            }
          });
        }
      } 
      else if (over.id.toString().includes('coluna-')) {
        console.log("Se estamos arrastando sobre uma coluna (para adicionar o card ao final da coluna)")
        const overColumnId = parseInt(over.id.toString().replace('coluna-', ''));
        
        setColunas((prevColunas) => {
          let activeColumnIndex = -1;
          let activeCardIndex = -1;
          let overColumnIndex = -1;
          
          prevColunas.forEach((coluna, colIndex) => {
            const cardActiveIndex = coluna.cards.findIndex(card => card.id === activeCardId);
            
            if (cardActiveIndex !== -1) {
              activeColumnIndex = colIndex;
              activeCardIndex = cardActiveIndex;
            }
            
            if (coluna.id === overColumnId) {
              overColumnIndex = colIndex;
            }
          });
          
          if (activeColumnIndex === overColumnIndex) {
            return prevColunas;
          }
          
          const updatedColunas = [...prevColunas];
          
          const [movedCard] = updatedColunas[activeColumnIndex].cards.splice(activeCardIndex, 1);
          
          updatedColunas[activeColumnIndex].cards = updatedColunas[activeColumnIndex].cards.map((card, index) => ({
            ...card,
            order: index,
          }));
          
          updatedColunas[overColumnIndex].cards.push({
            ...movedCard,
            order: updatedColunas[overColumnIndex].cards.length,
          });

          const tome = {
            CardId: activeCardId,
            ColunaId: overColumnId,
            Order: updatedColunas[overColumnIndex].cards.length
          }
          console.log("Resultado de para último:")
          console.log(tome)

          moveCard({
            CardId: activeCardId,
            ColunaId: overColumnId,
            Order: updatedColunas[overColumnIndex].cards.length
          });

          
          
          return updatedColunas;
        });
      }
    }
  }, [activeType]);

  const getActiveItem = useCallback(() => {
    if (!activeId || !activeType) return null;
    
    if (activeType === 'coluna') {
      const coluna = colunas.find(col => col.id === parseInt(activeId));
      if (coluna) {
        return (
          <div className="opacity-70 pointer-events-none">
            <Coluna coluna={coluna} functionUptade={()=>{setUpdate(!update)}} inforCard={showCardInfor} />
          </div>
        );
      }
    } else if (activeType === 'card') {
      let activeCard: CardType | null = null;
      
      colunas.forEach(coluna => {
        const card = coluna.cards.find(c => c.id === parseInt(activeId));
        if (card) {
          activeCard = card;
        }
      });
      
      if (activeCard) {
        return (
          <div className="opacity-70 pointer-events-none">
            <Card card={activeCard} onClick={()=>{}} />
          </div>
        );
      }
    }
    
    return null;
  }, [activeId, activeType, colunas]);

  const sortedColunas = [...colunas].sort((a, b) => a.order - b.order);
  console.log(sortedColunas)

  const createColumnNew = () => {

    if(WorkSpace?.id){
      const res = creatColum({workspaceId:WorkSpace?.id, nome:"Coluna 2"});
      res.then(value=>{
        if( typeof value === "boolean" && value){
          setUpdate(!update);
        }
      });
    }
  };

  const showCardInfor = (number: number, show: boolean, nameColumn:string) =>{
    if(show){
      setClick(true);
      setIdCard(number);
      setColumnName(nameColumn);
    }
  };

  return (
    <LayoutPage name={WorkSpace?.nome!} loadingValue={loading}>
       
        <div className="p-6 bg-gray-100 h-[100%] min-w-[350px]">
            <div className='max-xl:flex-col flex items-center justify-between mb-5' >
              <h2 className="max-xl:text-center text-[20px] break-words xl:text-2xl text-[#003057] font-bold xl:truncate w-[60%] ">Área de Trabalho - {WorkSpace?.nome!}</h2>
              <div className='flex gap-2 items-center hover:scale-105 transition-all duration-300 cursor-pointer' onClick={createColumnNew} >
                <p className='text-11 font-bold' >Adicionar Coluna</p>
                <div className='flex items-center justify-center text-1 font-bold text-[20px] xl:text-[30px] border-1 border-[3px] w-6 h-6 xl:w-9 xl:h-9 rounded-full' >
                <p className='mb-1' >+</p>
                </div>
              </div>
            </div>
            
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
            >
                <div className="flex gap-4 overflow-x-auto h-full max-h-[70vh] pb-4 elemento items-start">
                <SortableContext
                    items={sortedColunas.map(col => `coluna-${col.id}`)}
                    strategy={horizontalListSortingStrategy}
                >
                    {sortedColunas.map((coluna) => (
                    <Coluna 
                        key={coluna.id}
                        coluna={coluna}
                        functionUptade={()=>{setUpdate(!update)}}
                        inforCard={showCardInfor}
                    />
                    ))}
                </SortableContext>
                </div>
                
                <DragOverlay>{getActiveItem()}</DragOverlay>
            </DndContext>
        </div>
        {click && idCard?(
        <ShowCard id={idCard} nameColumn={columnName} closeCard={()=>{
          setClick(false);
        }} updateN={()=>{setUpdate(!update)}} />
      ):null}
    </LayoutPage>
  );
};

export default WorkSpace;