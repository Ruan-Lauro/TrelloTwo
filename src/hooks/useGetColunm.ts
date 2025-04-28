  import axios from 'axios';
  import {api} from "../services/axios";
  import { ColunaType } from '../pages/workSpace';


  interface Column {
    getColumn: () => Promise<ColunaType[]>;
    moveColum:( id: number, order: number) => Promise<boolean | string | undefined>;
    creatColum: ( {workspaceId, nome}:{workspaceId: number; nome: string}) => Promise<boolean | string | undefined>;
    deleteColum: (id: number) => Promise<boolean | string | undefined>;
    editColum: ({id, nome}:{id:number;nome: string}) => Promise<boolean | string | undefined>;
  }

  export const useGetColumn= (): Column => {

    const token = localStorage.getItem("token");

    const getColumn = async () => {
      try {
        const response = await api.get('/workspace/coluna', {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        })

        return response.data;
      } catch (error) {

        if (axios.isAxiosError(error)) {
          
          if (error.response && error.response.status === 400) {
            
            return "Get column erro"
          } else {
            return "servidor erro"
          }
        } else {
        
          console.error('Erro desconhecido:', error)
        }
      }

    };

    const moveColum = async ( id: number, order: number) => {
      try {
        const response = await api.put('/workspace/coluna/move/', {
          ColunaId: id,
          Order: order,
        },
        {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        })

        if(response.status === 200){
          return true;
        }else{
          return false;
        }
      } catch (error) {

        if (axios.isAxiosError(error)) {
          
          if (error.response && error.response.status === 400) {
            
            return "Get column erro"
          } else {
            return "servidor erro"
          }
        } else {
        
          console.error('Erro desconhecido:', error)
        }
      }
    };

    const creatColum = async ({workspaceId, nome}:{workspaceId: number; nome: string}) => {
      try {
        const response = await api.post('/workspace/coluna/create/', {
          workSpaceId: workspaceId,
          Nome: nome
        },
        {
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
            
            return "Create column erro"
          } else {
            return "servidor erro"
          }
        } else {
        
          console.error('Erro desconhecido:', error)
        }
      }
    };

    const editColum = async ({id, nome}:{id:number;nome: string}) =>{
      try {
        const response = await api.put('/workspace/coluna/editar/', {
          id:id,
          nome:nome
        },
        {
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
            
            return "Create column erro"
          } else {
            return "servidor erro"
          }
        } else {
        
          console.error('Erro desconhecido:', error)
        }
      }
    };

    const deleteColum = async (id: number) => {
      try {
  
        const response = await api.delete('/workspace/coluna/delete/'+id, 
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
            
            return "Delete column erro"
          } else {
            return "servidor erro"
          }
        } else {
         
          console.error('Erro desconhecido:', error)
        }
        
        
      }
  }

    return { getColumn, moveColum, creatColum, deleteColum, editColum}
  };
