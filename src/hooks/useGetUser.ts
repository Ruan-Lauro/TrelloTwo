import axios from 'axios';
import {api} from "../services/axios";

export type user = {
  name: string,
  email: string,
  photo: string,
  role: number,
}

export type userGet = {
  nome: string,
  email: string,
  foto: string,
  role: number,
  id: number,
  workplacesIds: number[],
}


export type userCreate = {
  nome: string,
  email: string,
  senha: string,
  role: number,
}

export type search = {
  Page: number;
  PageMax: number;
  Search: string;
};

interface UseGetResult {
  getUser: () => Promise<user | string | undefined>;
  getListUser: ( search: search) => Promise<any>;
  getListUserNoSearch: () => Promise<any>;
  createUser: (user: userCreate) => Promise<any>;
  deleteUser: (id:number) => Promise<any>;
  getUserId: (id: number) => Promise<userGet>;
}

export const useGetUser = (): UseGetResult => {

  const token = localStorage.getItem("token");

  const getUser = async () => {
    try {
      const response = await api.get('/usuario/', {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })

      const user:user =  {
        name: response.data.nome,
        email: response.data.email,
        photo: response.data.foto,
        role: response.data.role,
      }

      return user;
    } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "user erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
      
      
    }

  };

  const getListUser = async ( search: search) =>{
    try {

      console.log(search);

      const response = await api.get('/usuario/list/?'+`Page=${search.Page}&PageMax=${search.PageMax}&Search=${search.Search}`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })

      return response.data;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "user erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
      
      
    }
  };

  const getUserId = async ( id: number) =>{
    try {

      const response = await api.get(`/usuario/list/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })

      return response.data;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "user erro"
        } else {
          console.log(error)
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
      
      
    }
  };
  
  const getListUserNoSearch = async ( ) =>{
    try {

      const response = await api.get('/usuario/list/?PageMax=100', {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      })

      return response.data;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        
        if (error.response && error.response.status === 400) {
          
          return "user erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
      
      
    }
  };

  const createUser = async ( user: userCreate) =>{
    try {

      const response = await api.post('/usuario/create', {
        nome: user.nome,
        email: user.email,
        role: user.role,
        senha: user.senha
      }, 
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
          
          return "user erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
      
      
    }
  };

  const deleteUser = async (id: number) => {
    try {

      const response = await api.delete('/usuario/delete/'+id, 
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
          
          return "user erro"
        } else {
          return "servidor erro"
        }
      } else {
       
        console.error('Erro desconhecido:', error)
      }
      
      
    }
  }


  return { getUser, getListUser,createUser, deleteUser, getListUserNoSearch, getUserId }
};


