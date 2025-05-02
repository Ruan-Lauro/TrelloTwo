  import axios from 'axios';
  import {api} from "../services/axios";
  import { CardGetId } from '../components/showCard';

  export type cardCreate = {
    ColunaId: number;
    Descricao: string;
    Titulo: string;
    DataHora: Date;
  };

  export type cardEdit = {
    CardId: number;
    Titulo?: string;
    Descricao?: string;
    Status?: number;
    dataHora?: Date;
  };

  export type cardMove = {
    CardId: number;
    ColunaId: number;
    Order: number;
  };

  export type cardComment = {
    CardId: number;
    Comentario: string;
    Anexo?: Blob;
  };

  export type cardAnex = {
    CardId: number; 
    Anexo: Blob | string;
  };

  interface Card {
    getCardId: (id:number) => Promise<CardGetId>;
    createCard: (card:cardCreate) => Promise<string | boolean | undefined>;
    deleteCard: (id: number) => Promise<string | boolean | undefined>;
    editCard: (card:cardEdit) => Promise<string | boolean | undefined>;
    moveCard: (card:cardMove) => Promise<string | boolean | undefined>;
    addComentCard: (card:cardComment) => Promise<string | boolean | undefined>;
    addAnexCard: (formData: FormData) => Promise<string | boolean | undefined>;
    deleteAnex: (id: number) => Promise<string | boolean | undefined>;
  }

  export const useGetCard= (): Card => {

    const token = localStorage.getItem("token");

    const getCardId = async (id:number) => {
      try {
        const response = await api.get('/workspace/card/'+id, {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        })

        return response.data;
      } catch (error) {

        if (axios.isAxiosError(error)) {
          
          if (error.response && error.response.status === 400) {
            
            return "Get Card erro"
          } else {
            return "servidor erro"
          }
        } else {
        
          console.error('Erro desconhecido:', error)
        }
      }

    };

    const createCard = async (card:cardCreate) => {
        try {
          const response = await api.post('/workspace/card/create/', card, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
          })
  
          return response.data;
        } catch (error) {
  
          if (axios.isAxiosError(error)) {
            
            if (error.response && error.response.status === 400) {
              
              return "create Card erro"
            } else {
              return "servidor erro"
            }
          } else {
          
            console.error('Erro desconhecido:', error)
          }
        }
  
    };

    const deleteCard = async (id: number) => {
        try {
    
          const response = await api.delete('/workspace/card/delete/'+id, 
          {
            headers: {
                Authorization: `Bearer ${token}`,
              },
          })
    
          if(response.status === 200){
            return true;
          }
    
        } catch (error) {
    
          if (axios.isAxiosError(error)) {
            
            if (error.response && error.response.status === 400) {
              
              return "Delete card erro"
            } else {
              return "servidor erro"
            }
          } else {
           
            console.error('Erro desconhecido:', error)
          }
          
          
        }
    }

    const editCard = async (card:cardEdit) => {
        try {
          const response = await api.put('/workspace/card/edit/', card, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
          })
          
          if(response.status === 200){
            console.log(card)
            console.log(response)
            return true;
          }
        } catch (error) {
  
          if (axios.isAxiosError(error)) {
            
            if (error.response && error.response.status === 400) {
              
              return "Edit Card erro"
            } else {
              return "servidor erro"
            }
          } else {
          
            console.error('Erro desconhecido:', error)
          }
        }
  
    };

    const moveCard = async (card:cardMove) => {
        try {
          const response = await api.put('/workspace/card/move/', card, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
          })
  
          if(response.status === 200){
            console.log("O que foi passado:")
            console.log(card)
            return true;
          }else{
            console.log("Não passou")
            return false;
          }
        } catch (error) {
  
          if (axios.isAxiosError(error)) {
            
            if (error.response && error.response.status === 400) {
              
              return "Move Card erro"
            } else {
              return "servidor erro"
            }
          } else {
          
            console.error('Erro desconhecido:', error)
          }
        }
  
    };

    const addComentCard =  async (card:cardComment) => {
        try {
          const response = await api.post('/workspace/card/comment/', card, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
          })
  
          if(response.status === 200){
            return true;
          }
        } catch (error) {
  
          if (axios.isAxiosError(error)) {
            
            if (error.response && error.response.status === 400) {
              
              return "Move Card erro"
            } else {
              return "servidor erro"
            }
          } else {
          
            console.error('Erro desconhecido:', error)
          }
        }
  
    };

    const addAnexCard = async (formData: FormData) => {
      try {
          const response = await api.post('/workspace/card/anexo/', formData, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data'
              }
          });
  
          if (response.status === 200) {
              return true;
          }
      } catch (error) {
          if (axios.isAxiosError(error)) {
              if (error.response && error.response.status === 400) {
                  return "create Card erro";
              } else {
                  return "servidor erro";
              }
          } else {
              console.error('Erro desconhecido:', error);
          }
      }
  };

  const deleteAnex = async (id: number) => {
    try {

      const response = await api.delete('/workspace/card/anexo/delete/'+id, 
      {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })

      if(response.status === 200){
        return true;
      }

    } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "Delete card erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
      
      
    }
  };
  
  


    return { getCardId, createCard, addAnexCard, addComentCard, deleteCard, editCard, moveCard, deleteAnex}
  };
