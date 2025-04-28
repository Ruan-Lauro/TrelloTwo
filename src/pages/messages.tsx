
import React, { useEffect, useState } from "react";
import LayoutPage from "../components/layoutPage";
import { useGetUser, userGet } from "../hooks/useGetUser";
import { useNavigate } from "react-router-dom";

function Messages (){

    const {getListUserNoSearch} = useGetUser();
    const [listUserSee, setListUserSee] = useState<userGet[]>([]);
    const navigator = useNavigate();
    useEffect(()=>{
        const listUser = async () =>{
            const user = localStorage.getItem("user");
            if(user) {
                const userData = JSON.parse(user);  
                const userList = await getListUserNoSearch();
                setListUserSee(userList.items.filter((val:userGet)=>val.nome!==userData.name));
            }
        }
        listUser();
    },[])
    

    return(
        <LayoutPage name="Mensagens" loadingValue={false} >
            <main className="w-full min-w-[250px] flex flex-row bg-gray-100 items-start pr-5" >
                <div className="relative px-5 w-full sm:w-[470px] bg-white shadow-md ml-5 mt-5 rounded-[10px] max-h-[75vh] pb-5" >
                    <div className=" w-full pt-5 flex justify-between items-center bg-white">
                        <div className='flex items-center' >
                            <h2 className="font-bold text-[24px] text-2">Usuários</h2>
                        </div>
                        <div className='flex items-center justify-center text-1 font-bold text-[30px] border-1 border-[3px] w-9 h-9 rounded-full cursor-pointer' >
                            <p className='mb-1' >+</p>
                        </div>
                    </div>
                    <div className="w-full mt-5 h-auto max-h-[65vh] overflow-y-auto" >
                        {listUserSee.length > 0?(
                            <React.Fragment>
                                {listUserSee.map(user=>(
                                    <div className="flex gap-3 items-center h-[70px] bg-7 hover:bg-10 rounded-[10px] mb-5 px-3 cursor-pointer" onClick={()=>{
                                        navigator(`/MensagemAoUsuario/${user.id}`)
                                    }} >
                                        {user.foto && user.foto !== ""?(
                                            <div className="w-11 h-11 rounded-full" >
                                                <img className="w-full h-full"  src={user.foto} alt="imagem do usuário" />
                                            </div>
                                        ):(
                                            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-4" >
                                                <p className="text-white font-bold text-[20px]" >{user.nome[0]}</p>
                                            </div>
                                        )}
                                        <p className="text-[24px] font-bold truncate max-w-[200px]" >{user.nome}</p>
                                    </div>
                                ))}
                            </React.Fragment>
                        ):null}
                    </div>
                </div>
            </main>
        </LayoutPage>
    );
}

export default Messages;