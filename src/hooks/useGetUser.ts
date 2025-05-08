import axios from 'axios';
import {api} from "../services/axios";

export type user = {
  name: string;
  email: string;
  photo: string;
  role: number;
}

export type userGet = {
  nome: string;
  email: string;
  foto: string;
  role: number;
  id: number;
  workplacesIds: number[];
  ativo?: boolean;
}

export type userEdit = {
  nome?: string;
  email?: string;
  foto?: string;
  role?: number;
  id: number;
  workspaceIds: number[];
  senha?: string;
  ativo?: boolean;
}


export type userCreate = {
  nome: string;
  email: string;
  senha: string;
  role: number;
}

export type search = {
  Page: number;
  PageMax: number;
  Search: string;
};

export type userEditPerfil = {
  Nome?: string;
  Email?: string;
  Senha?: string;
  Foto?: File | string;
};

interface UseGetResult {
  getUser: () => Promise<user | string | undefined>;
  getListUser: ( search: search) => Promise<any>;
  getListUserNoSearch: () => Promise<any>;
  createUser: (user: userCreate) => Promise<any>;
  deleteUser: (id:number) => Promise<any>;
  getUserId: (id: number) => Promise<userGet>;
  editUser: (user: userEdit) => Promise<boolean | string | undefined>;
  editUserPerfil: (user: userEditPerfil) => Promise<boolean | string | undefined>;
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

      const response = await api.get(`/usuario/${id}`, {
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

  const editUser = async (user: userEdit) => {
    const formData = new FormData();
    console.log(user);
    formData.append('id', user.id.toString());
    if(user.role === 0){
      formData.append('role', user.role.toString());
    }else if(user.role === 1){
      formData.append('role', user.role.toString());
    }

    
    if(user.ativo){
      formData.append('ativo', user.ativo.toString());
    }
  
    user.workspaceIds.forEach(id => {
      formData.append('workspaceIds', id.toString());
    });
  
    try {
      const response = await api.post('/usuario/edit/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.status === 200;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.status === 400 ? 'user erro' : 'servidor erro';
      } else {
        console.error('Erro desconhecido:', error);
      }
    }
  };
  
  
  const editUserPerfil = async (user: userEditPerfil) => {
    try {
      const formData = new FormData();
  
      if (user.Nome) formData.append('nome', user.Nome);
      if (user.Email) formData.append('email', user.Email);
      if (user.Senha) formData.append('senha', user.Senha);
      if (user.Foto) formData.append('foto', user.Foto); 
      
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }      

      const response = await api.post('/usuario/edit-perfil/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
  
      console.log(response);
      return response.status === 200;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.status === 400 ? 'user erro' : 'servidor erro';
      } else {
        console.error('Erro desconhecido:', error);
      }
    }
  };
  

  return { getUser, getListUser,createUser, deleteUser, getListUserNoSearch, getUserId, editUser, editUserPerfil }
};