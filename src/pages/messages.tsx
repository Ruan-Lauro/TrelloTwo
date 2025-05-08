
import React, { useEffect, useState } from "react";
import LayoutPage from "../components/layoutPage";
import { useGetUser, userGet } from "../hooks/useGetUser";
import { useNavigate } from "react-router-dom";
import { Group, GroupUser, useGetGroup } from "../hooks/useGetGroup";
import ImgUser from "../components/imgUser";
import CreateGroupModal from "../components/createGroupModal";
import { useChat } from "../contexts/contextChat";

function Messages (){

    const {getListUserNoSearch} = useGetUser();
    const { getUserGroups} = useGetGroup();
    const [listUserSee, setListUserSee] = useState<userGet[]>([]);
    const [listGroup, setListGroup] = useState<Group[]>([]);
    const navigator = useNavigate();
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [update, setUpdate] = useState(false);
    const [user, setUser] = useState<userGet>();
    const { getGroupMessages } = useChat();

    useEffect(()=>{
        const listUser = async () =>{
            const user = localStorage.getItem("user");
            if(user) {
                const userData = JSON.parse(user);  
                const userList = await getListUserNoSearch();
                setListUserSee(userList.items.filter((val:userGet)=>val.nome!==userData.name));
            }
        }

        const listGroup = async () =>{
            const user = localStorage.getItem("user");
            if(user) {
                const userData = JSON.parse(user);  
                const userList = await getListUserNoSearch();
                const res = userList.items.filter((val:userGet)=>val.nome===userData.name);
                setUser(res[0]);
                const valueList = await getUserGroups();
                if(typeof valueList !== "string" && valueList !== undefined){
                    setListGroup(valueList)
                }
                 
            }
        }
        listUser();
        listGroup();
    },[update])
    
    // const msgGroupTotal = (groupId: number) => {
    //     getGroupMessages(groupId);
    //     const result = localStorage.getItem("msgGroupRead"+groupId);

    //     if(result){
    //         const resultJson = JSON.parse(result);
           
    //         return 1;
    //     }else{
    //         return 2;
    //     }
    // };    
    

    return(
        <LayoutPage name="Mensagens" loadingValue={false} >
            <main className="w-full min-w-[250px] flex flex-row bg-gray-100 items-start pr-5" >
                <div className="relative px-5 w-full sm:w-[470px] bg-white shadow-md ml-5 mt-5 rounded-[10px] max-h-[75vh] pb-5" >
                    <div className=" w-full pt-5 flex justify-between items-center bg-white">
                        <div className='flex items-center' >
                            <h2 className="font-bold text-[24px] text-2">Usuários</h2>
                        </div>
                        <div className='flex items-center justify-center text-1 font-bold text-[30px] border-1 border-[3px] w-9 h-9 rounded-full cursor-pointer'  >
                            <p className='mb-1' >+</p>
                        </div>
                    </div>
                    <div className="w-full mt-5 h-auto max-h-[65vh] overflow-y-auto" >
                        {listUserSee.length > 0?(
                            <React.Fragment key={1} >
                                {listUserSee.map(user=>(
                                    <div className="flex gap-3 items-center h-[70px] bg-7 hover:bg-10 rounded-[10px] mb-5 px-3 cursor-pointer" onClick={()=>{
                                        navigator(`/MensagemAoUsuario/${user.id}`)
                                    }} >
                                         <ImgUser color="bg-4" nome={user.nome} img={user.foto} id={user.id} />
                                        <p className="text-[24px] font-bold truncate max-w-[200px]" >{user.nome}</p>
                                    </div>
                                ))}
                            </React.Fragment>
                        ):null}
                    </div>
                </div>
                <div className="relative px-5 w-full sm:w-[470px] bg-white shadow-md ml-5 mt-5 rounded-[10px] max-h-[75vh] pb-5" >
                    <div className=" w-full pt-5 flex justify-between items-center bg-white">
                        <div className='flex items-center' >
                            <h2 className="font-bold text-[24px] text-2">Grupos</h2>
                        </div>
                        <div className='flex items-center justify-center text-1 font-bold text-[30px] border-1 border-[3px] w-9 h-9 rounded-full cursor-pointer' onClick={()=>{setShowCreateGroup(true)}} >
                            <p className='mb-1' >+</p>
                        </div>
                    </div>
                    <div className="w-full mt-5 h-auto max-h-[65vh] overflow-y-auto" >
                        {listGroup.length > 0?(
                            <React.Fragment key={0} >
                                {listGroup.map(group=>(
                                    <div className="flex items-center h-[70px] bg-7 hover:bg-10 rounded-[10px] mb-5 px-3 cursor-pointer justify-between" onClick={()=>{
                                        navigator(`/MensagemAoGrupo/${group.id}`)
                                    }} >
                                        <div className="flex items-center gap-3 " >
                                            <ImgUser color="bg-4" nome={group.nome} img={group.foto} id={group.id} />
                                            <p className="text-[24px] font-bold truncate max-w-[200px]" >{group.nome}</p>
                                        </div>
                                        {/* {msgGroupTotal(group.id)?(
                                            <div className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-2" ><p className="font-bold text-white" >{msgGroupTotal(group.id)}</p></div>
                                        ):null} */}
                                        
                                    </div>
                                ))}
                            </React.Fragment>
                        ):null}
                    </div>
                </div>
                {user && showCreateGroup?(
                    <CreateGroupModal onClose={()=>{setShowCreateGroup(false)}} onSuccess={()=>{setUpdate(!update)}} userId={user.id}/>
                ):null}
            </main>
        </LayoutPage>
    );
}

export default Messages;