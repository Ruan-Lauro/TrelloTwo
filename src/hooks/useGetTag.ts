import axios from 'axios';
import {api} from "../services/axios";

export type tag = {
    id: number;
    titulo: string;
    cor: string;
}

export type createTag = {
    cardId: number;
    titulo: string;
    cor: string;
}

interface getTag {
  getTag: () => Promise<tag[]>;
  addTag: (createTag:createTag) => Promise<boolean | string | undefined>;
  setTagCard: ({cardId,tagId}:{cardId:number, tagId: number}) => Promise<boolean | string | undefined>;
  removeTagCard: ({tagBondId}:{tagBondId: number}) => Promise<boolean | string | undefined>;
}

export const useGetTag = (): getTag => {

  const token = localStorage.getItem("token");

  const getTag = async () => {
    try {
      const response = await api.get('/workspace/tags/', {
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

  const addTag = async (createTag:createTag) => {
    try {
      const response = await api.post('/workspace/tags/create/', createTag ,{
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
          
          return "Create tag erro";
        } else {
          return "servidor erro";
        }
      } else {
       
        console.error('Erro desconhecido:', error);
      }
    }

  };

  const setTagCard = async ({cardId,tagId}:{cardId:number, tagId: number}) => {
    try {
      const response = await api.put('/workspace/tags/set/', {cardId, tagId} ,{
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
          
          return "Create tag erro";
        } else {
          return "servidor erro";
        }
      } else {
       
        console.error('Erro desconhecido:', error);
      }
    }

  };

  const removeTagCard = async ({tagBondId}:{tagBondId: number}) => {
    try {
      const response = await api.delete('/workspace/tags/remove/card/'+tagBondId,{
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
          
          return "Create tag erro";
        } else {
          return "servidor erro";
        }
      } else {
       
        console.error('Erro desconhecido:', error);
      }
    }

  };

  return { getTag, addTag, setTagCard, removeTagCard }
};
