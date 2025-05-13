import axios from 'axios';
import {api} from "../services/axios";
import { workSpaceType } from '../components/selectMenuLeft';
import { WorkSpaceNew } from '../pages/workSpace';


interface workSpace {
    getWorkSpace: () => Promise<workSpaceType[]>;
    getWorkSpaceId: ( id: number) => Promise<WorkSpaceNew[] | string | undefined>;
    postWorkSpace: ( name: string) => Promise<boolean | string | undefined>;
    deleteWorkSpace: ( id: number) => Promise<boolean | string | undefined>;
    addUserWorkSpace: (id:number, list:number[]) => Promise<boolean | string | undefined>;
}

export const useGetWorkSpace= (): workSpace => {

  const token = localStorage.getItem("token");

  const getWorkSpace = async () => {
    try {
      const response = await api.get('/workspace/', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      })

      return response.data;
    } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "Get tag erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };

  const getWorkSpaceId = async ( id:number) => {
    try {
      const response = await api.get('/workspace/'+id, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      })

      return response.data;
    } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "Get workspace erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };

  const postWorkSpace = async ( name: string) => {
    try {
      const response = await api.post('/workspace/create/',
        {
          Nome: name
        }, 
        {
        
          headers: {
              Authorization: `Bearer ${token}`,
          }
        })
      console.log(response)
      if(response.status === 200){
        return true;
      }
    } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "Get tag erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };

  const deleteWorkSpace = async ( id: number) => {
    try {
      const response = await api.delete('/workspace/delete/'+id,
        {
        
          headers: {
              Authorization: `Bearer ${token}`,
          }
        })
      console.log(response)
      if(response.status === 200){
        return true;
      }
    } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "Get tag erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }
  }

  const addUserWorkSpace = async ( id:number, list:number[]) => {
    try {
      const response = await api.put('usuario/edit-workspaces/',
        {
          id,
          workspaceIds: list,
        },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      })

      if(response.status === 200){
        return true
      }
    } catch (error) {

      if (axios.isAxiosError(error)) {
        console.log(error)
        if (error.response && error.response.status === 400) {
          
          return "Get workspace erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };


  return { getWorkSpace, getWorkSpaceId, postWorkSpace, deleteWorkSpace, addUserWorkSpace }
};
