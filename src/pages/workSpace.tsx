import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  MouseSensor,
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

// Definição dos tipos (mantém os mesmos tipos existentes)
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
  
  // Estado para armazenar preview das mudanças durante o drag
  const [previewWorkSpace, setPreviewWorkSpace] = useState<WorkSpaceNew | null>(null);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,        
        tolerance: 15,     
      },
    }),
  
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,       
        delay: 100,        
        tolerance: 8,     
      },
    }),

    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 100,
        tolerance: 8,
      },
    })
  );

  useEffect(() => {
    if(id) {
      const token = localStorage.getItem('token');
      if(token) {
        const workSpace = getWorkSpaceId(parseInt(id));
        console.log(workSpace)
        workSpace.then((res) => {
          if (res && typeof res === 'object' && !Array.isArray(res)) {
            const workspaceE = res as WorkSpaceNew;
            setWorkSpace(workspaceE);
            console.log(workspaceE)
            // Limpa o preview quando carrega novos dados
            setPreviewWorkSpace(null);
          } else {
            console.warn('Resposta inesperada:', res);
          }
        });
      }
    }
  }, [update, id]);

  const preventBodyScroll = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
  };

  const restoreBodyScroll = () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const id = active.id.toString();
    
    preventBodyScroll();
    
    if (id.includes('coluna-')) {
      setActiveType('coluna');
      setActiveId(id.replace('coluna-', ''));
    } else if (id.includes('card-')) {
      setActiveType('card');
      setActiveId(id.replace('card-', ''));
    }
    
    // Inicializa o preview com os dados atuais
    if (WorkSpace) {
      setPreviewWorkSpace({ ...WorkSpace });
    }
  }, [WorkSpace]);

  const [dragInfo, setDragInfo] = useState<{
    cardId: number;
    fromColumnId: number;
    toColumnId: number;
    newOrder: number;
  } | null>(null);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || !WorkSpace) return;
    
    if (activeType === 'card') {
      const activeCardId = parseInt(active.id.toString().replace('card-', ''));
      
      if (over.id.toString().includes('card-')) {
        const overCardId = parseInt(over.id.toString().replace('card-', ''));
        
        if (activeCardId !== overCardId) {
          const newWorkSpace = { ...WorkSpace };
          let activeColumnIndex = -1;
          let activeCardIndex = -1;
          let overColumnIndex = -1;
          let overCardIndex = -1;
          
          newWorkSpace.colunas.forEach((coluna, colIndex) => {
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
            // Reordena cards na mesma coluna
            const newCards = arrayMove(
              newWorkSpace.colunas[activeColumnIndex].cards,
              activeCardIndex,
              overCardIndex
            );
            
            // Recalcula as ordens sequencialmente
            const updatedCards = newCards.map((card, index) => ({
              ...card,
              order: index,
            }));
            
            newWorkSpace.colunas[activeColumnIndex] = {
              ...newWorkSpace.colunas[activeColumnIndex],
              cards: updatedCards,
            };
            
            // Salva informações para o dragEnd
            setDragInfo({
              cardId: activeCardId,
              fromColumnId: WorkSpace.colunas[activeColumnIndex].id,
              toColumnId: WorkSpace.colunas[activeColumnIndex].id,
              newOrder: overCardIndex,
            });
            
            setPreviewWorkSpace(newWorkSpace);
          } else {
            // Move card para coluna diferente
            const [movedCard] = newWorkSpace.colunas[activeColumnIndex].cards.splice(activeCardIndex, 1);
            
            // Reordena cards da coluna origem
            newWorkSpace.colunas[activeColumnIndex].cards = newWorkSpace.colunas[activeColumnIndex].cards.map((card, index) => ({
              ...card,
              order: index,
            }));
            
            // Insere card na nova posição
            newWorkSpace.colunas[overColumnIndex].cards.splice(overCardIndex, 0, movedCard);
            
            // Reordena cards da coluna destino
            newWorkSpace.colunas[overColumnIndex].cards = newWorkSpace.colunas[overColumnIndex].cards.map((card, index) => ({
              ...card,
              order: index,
            }));
            
            // Salva informações para o dragEnd
            setDragInfo({
              cardId: activeCardId,
              fromColumnId: WorkSpace.colunas[activeColumnIndex].id,
              toColumnId: WorkSpace.colunas[overColumnIndex].id,
              newOrder: overCardIndex,
            });
            
            setPreviewWorkSpace(newWorkSpace);
          }
        }
      } else if (over.id.toString().includes('coluna-')) {
        const overColumnId = parseInt(over.id.toString().replace('coluna-', ''));
        
        const newWorkSpace = { ...WorkSpace };
        let activeColumnIndex = -1;
        let activeCardIndex = -1;
        let overColumnIndex = -1;
        
        newWorkSpace.colunas.forEach((coluna, colIndex) => {
          const cardActiveIndex = coluna.cards.findIndex(card => card.id === activeCardId);
          
          if (cardActiveIndex !== -1) {
            activeColumnIndex = colIndex;
            activeCardIndex = cardActiveIndex;
          }
          
          if (coluna.id === overColumnId) {
            overColumnIndex = colIndex;
          }
        });
        
        if (activeColumnIndex !== overColumnIndex) {
          const [movedCard] = newWorkSpace.colunas[activeColumnIndex].cards.splice(activeCardIndex, 1);
          
          // Reordena cards da coluna origem
          newWorkSpace.colunas[activeColumnIndex].cards = newWorkSpace.colunas[activeColumnIndex].cards.map((card, index) => ({
            ...card,
            order: index,
          }));
          
          // Adiciona card ao final da coluna destino
          const newOrder = newWorkSpace.colunas[overColumnIndex].cards.length;
          newWorkSpace.colunas[overColumnIndex].cards.push({
            ...movedCard,
            order: newOrder,
          });
          
          // Salva informações para o dragEnd
          setDragInfo({
            cardId: activeCardId,
            fromColumnId: WorkSpace.colunas[activeColumnIndex].id,
            toColumnId: overColumnId,
            newOrder: newOrder,
          });
          
          setPreviewWorkSpace(newWorkSpace);
        }
      }
    }
  }, [activeType, WorkSpace]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    restoreBodyScroll();
    
    if (!over || !WorkSpace) {
      setActiveId(null);
      setActiveType(null);
      setDragInfo(null);
      setPreviewWorkSpace(null);
      return;
    }

    setLoading(true);

    // Lógica para reordenar colunas
    if (activeType === 'coluna' && over.id.toString().includes('coluna-')) {
      const activeColumnId = parseInt(active.id.toString().replace('coluna-', ''));
      const overColumnId = parseInt(over.id.toString().replace('coluna-', ''));
      
      if (activeColumnId !== overColumnId) {
        const oldIndex = WorkSpace.colunas.findIndex((col) => col.id === activeColumnId);
        const newIndex = WorkSpace.colunas.findIndex((col) => col.id === overColumnId);
        
        // Aplica a mudança otimisticamente
        const reordered = arrayMove(WorkSpace.colunas, oldIndex, newIndex);
        const updatedColumns = reordered.map((col, index) => ({
          ...col,
          order: index,
        }));

        setWorkSpace({
          ...WorkSpace,
          colunas: updatedColumns
        });

        if (id) {
          const token = localStorage.getItem('token');
          if (token) {
            const value = moveColum(activeColumnId, newIndex);
            value.then(res => {
              if(typeof res === "boolean" && res) {
                console.log("Coluna movida com sucesso");
                setLoading(false);
              } else {
                // Em caso de erro, recarrega os dados
                setUpdate(!update);
                setLoading(false);
              }
            }).catch((error) => {
              console.error("Erro ao mover coluna:", error);
              // Em caso de erro, recarrega os dados
              setUpdate(!update);
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    
    // Lógica para mover cards
    if (activeType === 'card' && dragInfo) {
      console.log("Fazendo chamada final da API com:", {
        CardId: dragInfo.cardId,
        ColunaId: dragInfo.toColumnId,
        Order: dragInfo.newOrder + 1,
      });
      
      // Aplica a mudança otimisticamente (já foi aplicada no preview)
      if (previewWorkSpace) {
        setWorkSpace(previewWorkSpace);
      }
      
      moveCard({
        CardId: dragInfo.cardId,
        ColunaId: dragInfo.toColumnId,
        Order: dragInfo.newOrder + 1,
      }).then((response) => {
        console.log("Card movido com sucesso:", response);
        setLoading(false);
      }).catch((error) => {
        console.error("Erro ao mover card:", error);
        // Em caso de erro, recarrega os dados para manter consistência
        setUpdate(!update);
        setLoading(false);
      });
    } else if (activeType === 'card') {
      setLoading(false);
    }
    
    // Limpa todos os estados
    setActiveId(null);
    setActiveType(null);
    setDragInfo(null);
    setPreviewWorkSpace(null);
    
    // Fallback para garantir que loading seja desabilitado
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [activeType, id, moveColum, moveCard, dragInfo, update, WorkSpace, previewWorkSpace]);

  const handleDragCancel = useCallback(() => {
    restoreBodyScroll();
    setActiveId(null);
    setActiveType(null);
    setDragInfo(null);
    setPreviewWorkSpace(null);
    setLoading(false);
  }, []);

  const getActiveItem = useCallback(() => {
    if (!activeId || !activeType || !WorkSpace) return null;
    
    // Usa o preview se disponível, senão usa os dados originais
    const dataSource = previewWorkSpace || WorkSpace;
    
    if (activeType === 'coluna') {
      const coluna = dataSource.colunas.find(col => col.id === parseInt(activeId));
      if (coluna) {
        return (
          <div className="opacity-70 pointer-events-none transform rotate-6 scale-105">
            <Coluna coluna={coluna} functionUptade={() => {setUpdate(!update)}} inforCard={showCardInfor} />
          </div>
        );
      }
    } else if (activeType === 'card') {
      let activeCard: CardType | null = null;
      
      dataSource.colunas.forEach(coluna => {
        const card = coluna.cards.find(c => c.id === parseInt(activeId));
        if (card) {
          activeCard = card;
        }
      });
      
      if (activeCard) {
        return (
          <div className="opacity-80 pointer-events-none transform rotate-12 scale-110 shadow-2xl">
            <Card card={activeCard} onClick={() => {}} />
          </div>
        );
      }
    }
    
    return null;
  }, [activeId, activeType, WorkSpace, previewWorkSpace, update]);

  // Usa preview durante drag, senão usa dados originais
  const displayWorkSpace = previewWorkSpace || WorkSpace;
  const sortedColunas = displayWorkSpace ? [...displayWorkSpace.colunas].sort((a, b) => a.order - b.order) : [];

  const createColumnNew = () => {
    if(WorkSpace?.id) {
      const res = creatColum({workspaceId: WorkSpace?.id, nome: "Coluna 2"});
      res.then(value => {
        if(typeof value === "boolean" && value) {
          setUpdate(!update);
        }
      });
    }
  };

  const showCardInfor = (number: number, show: boolean, nameColumn: string) => {
    if(show) {
      setClick(true);
      setIdCard(number);
      setColumnName(nameColumn);
    }
  };

  return (
    <LayoutPage name={WorkSpace?.nome!} loadingValue={loading}>
      <div className="p-6 bg-gray-100 h-[100%] min-w-[350px] select-none">
        <div className='max-xl:flex-col flex items-center justify-between mb-5'>
          <h2 className="max-xl:text-center text-[20px] break-words xl:text-2xl text-[#003057] font-bold xl:truncate w-[60%]">
            Área de Trabalho - {WorkSpace?.nome!}
          </h2>
          <div className='flex gap-2 items-center hover:scale-105 transition-all duration-300 cursor-pointer' onClick={createColumnNew}>
            <p className='text-11 font-bold'>Adicionar Coluna</p>
            <div className='flex items-center justify-center text-1 font-bold text-[20px] xl:text-[30px] border-1 border-[3px] w-6 h-6 xl:w-9 xl:h-9 rounded-full'>
              <p className='mb-1'>+</p>
            </div>
          </div>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragCancel={handleDragCancel}
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
                  functionUptade={() => {setUpdate(!update)}}
                  inforCard={showCardInfor}
                />
              ))}
            </SortableContext>
          </div>
          
          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
          >
            {getActiveItem()}
          </DragOverlay>
        </DndContext>
      </div>
      {click && idCard?(
        <ShowCard id={idCard} nameColumn={columnName} closeCard={() => {
          setClick(false);
        }} updateN={() => {setUpdate(!update)}} />
      ) : null}
    </LayoutPage>
  );
};

export default WorkSpace;