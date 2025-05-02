import axios from 'axios';
import {api} from "../services/axios";

interface UseAuthLoginResult {
  authenticationLogin: (email: string, password: string) => Promise<string | undefined>
}7

export const useAuthLogin = (): UseAuthLoginResult => {

  const authenticationLogin = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login/', {
        email,
        password
      })
      return response.data.token;
  } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          return "login erro"
        } else if (error.response && error.response.status === 401){
          return "Unauthorized"
        }else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
    }

  };

  return { authenticationLogin }
};


