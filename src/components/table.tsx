"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash } from 'lucide-react';
import { useGetUser, userGet } from '../hooks/useGetUser';
import { useGetWorkSpace } from '../hooks/useGetWorkSpace';
import { workSpaceType } from './selectMenuLeft';
import RenderWorkSpace from './renderWorkSpace';
import ShowWorkSpaceSelect from './showWorkSpaceSelect';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  foto?: string;
  workplacesIds: number[];
}

interface ApiResponse {
  page: number;
  totalPages: number;
  totalItems: number;
  totalDisplay: number;
  items: Usuario[];
  hasNext: boolean;
  nextPage: number;
  hasPrevious: boolean;
  previousPage: number;
}

interface UserTableProps {
  pageSize: number;
  search: string;
}

const UserTable: React.FC<UserTableProps> = ({ pageSize, search }) => {

  const [users, setUsers] = useState<Usuario[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {getListUser, deleteUser } = useGetUser();
  const {getWorkSpace, addUserWorkSpace} = useGetWorkSpace();
  const [listWorkSpace, setListWorkSpace] = useState<workSpaceType[]>([]);
  const [openWorkSpaceIds, setOpenWorkSpaceIds] = useState<number[]>([]);
  const [update, setUpdate] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
    
      const response = await getListUser( {
        Search: search,
        Page: currentPage,
        PageMax: pageSize  
      });
      
      const data: ApiResponse = response;
      console.log("API Response:", data);
      
      if (data.items.length > pageSize) {
        console.log("API not respecting PageMax, using client-side pagination");
        
        const allUsers = data.items;
        setTotalItems(allUsers.length);
        
        const calculatedTotalPages = Math.ceil(allUsers.length / pageSize);
        setTotalPages(calculatedTotalPages);
        
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, allUsers.length);
        setUsers(allUsers.slice(startIndex, endIndex));
      } else {
        setUsers(data.items);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(()=>{
    const list = getWorkSpace();
      list.then(value=>{
        setListWorkSpace(value);
      })
  },[])

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search, pageSize, update]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (id: number) => {
    console.log(`Editar usuário ${id}`);
  };

  const handleDelete = async (id: number) => {
      const res = await deleteUser(id);
      if(typeof res === "boolean" && res){
          alert("Usuário Deletado");
          setUpdate(!update);
      }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 ${
            currentPage === i
              ? 'bg-blue-800 text-white'
              : 'hover:bg-gray-200'
          }`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center px-3 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} /> Usuários anteriores
        </button>

        <div className="flex mx-2">{pages}</div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center px-3 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          aria-label="Próxima página"
        >
          Próximos usuários <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const getDefaultAvatar = (nome: string) => {
    return nome.charAt(0).toUpperCase();
  };

  const toggleWorkSpace = (id: number) => {
    setOpenWorkSpaceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className=" rounded-lg shadow-md p-4 min-w-[900px] bg-white">
      <div className="overflow-x-auto h-[57vh]">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-blue-800 text-white text-[20px]">
              <th className="px-4 py-3 text-left">Foto</th>
              <th className="px-4 py-3 text-left ">Nome</th>
              <th className="px-4 py-3 text-left">E-mail</th>
              <th className="px-4 py-3 text-left">Áreas de trabalho</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">Carregando...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">Nenhum usuário encontrado</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="px-4 py-3 ">
                    {user.foto ? (
                      <img
                        src={user.foto}
                        alt={`Foto de ${user.nome}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                        {user.nome === 'Administrador' ? (
                          <span className="text-2xl">👤</span>
                        ) : (
                          getDefaultAvatar(user.nome)
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[18px] 2xl:text-[24px] break-words max-w-[200px] ">{user.nome}</td>
                  <td className="px-4 py-3 text-[18px] 2xl:text-[20px]">{user.email}</td>
                  <td className="px-4 py-3 relative">
                    <RenderWorkSpace
                      listWorkSpace={listWorkSpace}
                      workplaceIds={user.workplacesIds}
                      onClick={() => toggleWorkSpace(user.id)}
                      seeAllWorkSpace={openWorkSpaceIds.includes(user.id)}
                    />
                    {openWorkSpaceIds.includes(user.id) && (
                      <ShowWorkSpaceSelect
                        listWorkSpace={listWorkSpace}
                        workplaceIds={user.workplacesIds}
                        userId={user.id}
                        update={()=>{
                          setUpdate(!update);
                        }}
                      />
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
                        aria-label="Excluir"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default UserTable;