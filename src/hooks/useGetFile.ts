import axios from 'axios';
import {api} from "../services/axios";

export type fileUp = {
    tipo: number;
    nomeArquivo: string;
    contentType: string;
    guid: string;
    linkArquivo: string;
    id: number;
    ativo: boolean;
    createdAt: null | string | Date; 
    updatedAt: null | string | Date; 
};

interface UseAuthFileResult {
  postFile: (bloob:string) => Promise<fileUp |string | undefined>
}


export const useAuthFile = (): UseAuthFileResult => {

  const postFile = async (bloob:string) => {
    try {
      const response = await api.post('/arquivos/upload/', {
        file: bloob
      })
      return response.data;
  } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "File erro"
        } else {
          return "servidor erro"
        }
      } else {
        console.error('Erro desconhecido:', error)
      }
    }

  };

  return { postFile }
};


