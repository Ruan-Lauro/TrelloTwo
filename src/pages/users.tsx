"use client"
import { useNavigate } from "react-router-dom";
import ButtonListUser from "../components/buttonListUser";
import LayoutPage from "../components/layoutPage";
import Search from "../components/search";
import UserTable from "../components/table";
import { ChangeEvent, useState } from "react";


function Users (){

    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    return(
        <LayoutPage name="Usuários" >
            <main className="p-6 bg-gray-100 h-full  min-w-[200px] " >
                <header className="flex items-center justify-between max-xl:flex-col" >
                    <h2 className="text-2xl text-[#003057] font-bold max-xl:mb-5" >Listagem de Usuários</h2>
                    <div className="flex items-center gap-5 md:gap-10 xl:w-[70%] justify-end ml-5 max-md:flex-col" >
                        <ButtonListUser authentication={()=>{navigate("/criarUsuario")}} type="button" >
                            Novo Usuário
                        </ButtonListUser>
                        <div className='w-[54.6%] min-w-[200px]' >
                            <Search onClickSearch={()=>{}} onchange={handleSearch} placeholder="Pesquisar Usuário" typeTwo/>
                        </div>
                    </div>
                </header>
                <main className="w-full bg-white mt-5 overflow-x-auto" >
                    <UserTable pageSize={6} search={search}/>
                </main>
            </main>
        </LayoutPage>
    );
}

export default Users;