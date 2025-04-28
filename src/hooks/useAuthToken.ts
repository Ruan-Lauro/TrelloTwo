import axios from 'axios';
import {api2} from "../services/axios";

interface UseAuthTokenResult {
  authenticationT: (token: string) => Promise<boolean | string | undefined>
}

export const useAuthToken = (): UseAuthTokenResult => {
 


  const authenticationT = async (token: string) => {

    try {
      const response = await api2.get('/check/', {
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
          
          return "user erro"
        }else if(error.response && error.response.status === 401){
          return "token erro";
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
      
      
    }

  };

  return { authenticationT }
};


