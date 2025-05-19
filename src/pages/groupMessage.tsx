import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import LayoutPage from "../components/layoutPage";
import { GroupMessage, useChat } from '../contexts/contextChat';
import ButtonAddUser from "../components/buttonAddUser";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUser, user, userGet } from "../hooks/useGetUser";
import { Group, GroupUser, useGetGroup } from "../hooks/useGetGroup";
import AddUserGroup from '../components/addUserGroup';
import ListUser from '../components/listUser';
import ImgUser from '../components/imgUser';
import LoadingLetter from '../components/loadingLetter';
import EditGroup from '../components/editGroup';
import { AiFillSetting } from "react-icons/ai";

function GroupMessages() {

    const { id } = useParams();
    const navigator = useNavigate();
    const groupId = id ? parseInt(id) : 0;

    const prevIdRef = useRef<string | undefined>(id);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { groupMessages, sendGroupMessage, getGroupMessages, privateGroupMessages } = useChat();
    const { getListUserNoSearch } = useGetUser();
    const { getGroupUsers, addUserToGroup, removeUserFromGroup, getUserGroups} = useGetGroup();

    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageGroup, setMessageGroup] = useState<GroupMessage[]>([]);
    const [group, setGroup] = useState<Group | null>(null);
    const [currentUser, setCurrentUser] = useState<user | null>(null);
    const [groupUsers, setGroupUsers] = useState<GroupUser[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<userGet[]>([]);
    const [trueEditGroup, setTrueEditGroup] = useState(false);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
       
        if (prevIdRef.current !== id) {
            setMessageGroup([]);
            setIsLoading(true);
            prevIdRef.current = id;
            
        }

        fetchData();
     
    }, []);

    useEffect(()=>{
        scrollToBottom();
        if(id && privateGroupMessages && privateGroupMessages.length > 0 && privateGroupMessages[0].grupoId === parseInt(id)){
            setMessageGroup(privateGroupMessages);
            setIsLoading(false);
        }
       
    },[privateGroupMessages])

    useEffect(() => {
        const loadAvailableUsers = async () => {
            if (showAddUserModal) {
                const userList = await getListUserNoSearch();
                if (userList && userList.items) {
                    const existingUserIds = groupUsers.map(gu => gu.usuarioId);
                    const filteredUsers = userList.items.filter(
                        (user: userGet) => !existingUserIds.includes(user.id)
                    );
                    setAvailableUsers(filteredUsers);
                }
            }
        };
        
        loadAvailableUsers();
    }, [showAddUserModal, groupUsers]);

    useEffect(() => {
        if(!id) return;
        if(groupMessages && groupMessages.grupoId===parseInt(id) &&!messageGroup.some(val=> val.autor === groupMessages.autor && val.conteudo === groupMessages.conteudo && groupMessages.dataHora === val.dataHora)){
            setMessageGroup(prev=>[...prev, groupMessages]);
        }    
    
    }, [groupMessages]);

    useLayoutEffect(() => {
        if (!isLoading) {
            scrollToBottom();
        }
    }, [messageGroup]);

    useEffect(()=>{
        if(group && messageGroup.length > 0){
            localStorage.setItem("msgGroupRead"+group.id, JSON.stringify(messageGroup));
        }
    },[messageGroup])

    const fetchData = async () => {
        if (!id) return;
        
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            navigator('/login');
            return;
        }
        const userData = JSON.parse(userJson);
        setCurrentUser(userData);

        const groups = await getUserGroups();
        if (typeof groups !== 'string' && groups !== undefined) {
            const currentGroup = groups.find(g => g.id === parseInt(id));
            if (currentGroup) {
                setGroup(currentGroup);
            } else {
                navigator('/Mensagens');
                return;
            }
        }

        const members = await getGroupUsers(parseInt(id));

        if (typeof members !== 'string' && members !== undefined) {
            setGroupUsers(members);
            setIsAdmin(userData.role === 1);
        }
       await getGroupMessages(parseInt(id));
       setIsLoading(false);
    };
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = () => {
        if (message.trim() && id) {
            sendGroupMessage(id, message);
            setMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleAddUser = async (userId: number) => {
        if (!groupId) return;
        
        const result = await addUserToGroup(groupId, userId);
        if (result === true) {
            const members = await getGroupUsers(groupId);
            if (typeof members !== 'string' && members !== undefined) {
                setGroupUsers(members);
            }
            setShowAddUserModal(false);
        }
    };

    const handleRemoveUser = async (linkId: number) => {
        const result = await removeUserFromGroup(linkId);
        if (result === true) {
            const members = await getGroupUsers(groupId);
            if (typeof members !== 'string' && members !== undefined) {
                setGroupUsers(members);
            }
        }
    };


    return (
        <LayoutPage name="Mensagens de Grupo" loadingValue={false} inforMessage={{id:group?.id!, nome:group?.nome!, type:'group'}}>
            <main className="w-full items-start flex bg-gray-100 pt-5">
                <div className="w-full min-w-[250px] 2xl:w-[1184px] ml-5 max-lg:mr-5">
                    <div className="bg-white h-[90px] w-full rounded-[10px] mb-5 flex items-center justify-between px-5">
                        <div className="flex items-center gap-2 sm:gap-5">
                            {group?(
                                <ImgUser color='bg-4' id={1} nome={group?.nome} img={group?.foto} size='w-11 h-11 text-[22px]' textColor='text-white' />
                            ):null}
                            
                            <p className="font-bold text-[18px] sm:text-[24px] truncate max-w-[200px]">{group?.nome}</p>
                        </div>
                        {isAdmin && (
                            <div className='flex items-center gap-2 sm:gap-5' >
                                <AiFillSetting className='text-3 text-[25px] cursor-pointer hover:transition-transform hover:duration-700 hover:rotate-180' onClick={()=>{
                                    setTrueEditGroup(true);
                                }} />
                                <button 
                                    onClick={() => setShowAddUserModal(true)}
                                    className="bg-black/10 text-black px-2 max-sm:text-[12px] sm:px-4 py-2 rounded-lg hover:bg-black/20 transition cursor-pointer"
                                >
                                    Adicionar Usuário
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-white w-full 2xl:w-[1184px] h-[47vh] flex flex-col px-5 gap-3 rounded-[10px] overflow-y-auto pb-2">
                        {isLoading?(
                            <LoadingLetter/>
                        ):(
                            <>
                                {messageGroup.length > 0 && groupUsers && currentUser? messageGroup.map((msg, idx) => {
                                    const isCurrentUser = currentUser && msg.autor === currentUser.name;
                                    
                                    return (
                                        <div key={idx} className={`flex mt-3 gap-2 h-auto ${isCurrentUser ? "self-end flex-row-reverse" : ""}`}>
                                            <ImgUser color={`${isCurrentUser ? "bg-red-700" : "bg-blue-700"}`} id={1} nome={msg.autor} img={groupUsers.filter(val=>val.nome === msg.autor)[0]?groupUsers.filter(val=>val.nome === msg.autor)[0].foto:""} size='w-[40px] h-[40px] lg:w-[65px] lg:h-[65px] text-[30px]' textColor='text-white' />
                                            <div className="flex flex-col">
                                                <span className={` text-xs text-gray-500 truncate max-w-[200px] ${isCurrentUser ? "self-end mr-4 " : "ml-4"}`}>
                                                    {msg.autor}
                                                </span>
                                                <div className={` rounded-[10px] w-[200px] lg:w-[506px] p-2 relative before:content-[''] 
                                                    before:absolute before:top-0 
                                                    ${isCurrentUser 
                                                        ? "before:right-3 mr-2 bg-7 before:border-t-gray-200" 
                                                        : "before:left-[-30px] ml-2 bg-1 before:border-t-1 text-white"} 
                                                    before:translate-x-full before:border-[10px] before:border-transparent 
                                                    before:border-t-[10px]  mt-1`}
                                                >
                                                    <p className="break-words">{msg.conteudo}</p>
                                                    <span className={`text-xs block text-right ${isCurrentUser?"text-gray-500":"text-white"}`}>
                                                        {new Date(msg.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }):(
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500">Nenhuma mensagem ainda. Inicie uma conversa!</p>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef}  />
                    </div>
                    
                    {/* Message Input */}
                    <div className="w-full bg-white h-[90px] rounded-[10px] mt-10 mb-5 flex justify-center items-center gap-5">
                        <div className="flex items-center p-5 w-[98%] h-[60px] bg-gray-100 rounded-full">
                            <input
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite sua mensagem"
                                className="focus:outline-0 w-[85%] h-auto mr-5 break-words bg-transparent"
                            />
                            <ButtonAddUser type="button" authentication={handleSend}>Enviar</ButtonAddUser>
                        </div>
                    </div>
                </div>
                
                <ListUser currentUser={currentUser!} handleRemoveUser={handleRemoveUser} isAdmin={isAdmin} list={groupUsers} />
            </main>

            {showAddUserModal && (
                <AddUserGroup availableUsers={availableUsers} handleAddUser={handleAddUser} setShowAddUserModal={()=>setShowAddUserModal(false)} />
            )}

            {group && trueEditGroup?(
                <EditGroup group={group} onClose={()=>{setTrueEditGroup(false)}} onSuccess={()=>{setUpdate(!update)}} currentUser={currentUser!} handleRemoveUser={handleRemoveUser} isAdmin={isAdmin} list={groupUsers}  />
            ):null}
        </LayoutPage>
    );
}

export default GroupMessages;