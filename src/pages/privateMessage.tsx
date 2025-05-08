import { useEffect, useState, useRef } from 'react';
import LayoutPage from "../components/layoutPage";
import { Message, useChat } from '../contexts/contextChat';
import ButtonAddUser from "../components/buttonAddUser";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUser, user, userGet } from "../hooks/useGetUser";
import ImgUser from '../components/imgUser';
import LoadingLetter from '../components/loadingLetter';


function PrivateMessages() {

    const { messages, sendPrivateMessage, getPrivateMessage, privateMessages, clearPrivateMessages } = useChat();

    const [message, setMessage] = useState('');
    const [chatPartner, setChatPartner] = useState<userGet | null>(null);
    const [currentUser, setCurrentUser] = useState<user | null>(null);
    const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { getListUserNoSearch } = useGetUser();
    const { id } = useParams();
    const navigator = useNavigate();
    const prevIdRef = useRef<string | undefined>(id);

    useEffect(() => {
        if (prevIdRef.current !== id) {
            setFilteredMessages([]);
            setIsLoading(true);
            prevIdRef.current = id;
        }
        
        fetchData();
    }, [id]);

    const fetchData = async () => {
        if (!id) return;
        setFilteredMessages([]);
        await clearPrivateMessages();
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            navigator('/login');
            return;
        }

        const userData = JSON.parse(userJson);
        setCurrentUser(userData);

        const userList = await getListUserNoSearch();
        if (userList?.items) {
            const partnerUser = userList.items.find((user: userGet) => user.id === parseInt(id));
            if (partnerUser) {
                setChatPartner(partnerUser);
            } else {
                navigator('/messages');
                return;
            }
        }
        
        setIsLoading(false);
        await getPrivateMessage(id);
        
    };
   
    useEffect(() => {
        if (privateMessages && !isLoading) {
            setFilteredMessages(privateMessages);
        }
    }, [privateMessages, isLoading]);  

    useEffect(() => {
        if (messages) {
            setFilteredMessages(prev => [...prev, messages]);
        }
    }, [messages]); 

    useEffect(() => {
        
        if(!isLoading && filteredMessages){
            setFilteredMessages(filteredMessages)
            scrollToBottom();
        }
    }, [filteredMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (message.trim() && id && chatPartner) {
            await sendPrivateMessage(chatPartner.id, message);
            
            setMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <LayoutPage name="Mensagens Privadas" loadingValue={false}>
            <main className="w-full items-start flex bg-gray-100 pt-5">
                <div className="w-full min-w-[250px] 2xl:w-[1184px] ml-5 max-lg:mr-5">
                    <div className="bg-white h-[90px] w-full rounded-[10px] mb-5 flex items-center pl-5">
                        <div className="flex items-center gap-5">
                                <ImgUser 
                                    color="bg-blue-700" 
                                    nome={chatPartner?.nome || "U"} 
                                    img={chatPartner?.foto || ""} 
                                    id={chatPartner?.id || 0} 
                                />
                            <p className="font-bold text-[24px] truncate max-w-[200px]">{chatPartner?.nome}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white w-full 2xl:w-[1184px] h-[47vh] flex flex-col px-5 gap-3 rounded-[10px] overflow-y-auto pb-2">
                        {isLoading ? (
                             <LoadingLetter/>
                        ) : filteredMessages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Nenhuma mensagem ainda. Inicie uma conversa!</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg, idx) => {
                                const isCurrentUser = currentUser && msg.autor === currentUser.name;
                                return (
                                    <div key={idx} className={`flex mt-3 gap-2 h-auto ${isCurrentUser ? "self-end flex-row-reverse" : ""}`}>
                                        <ImgUser 
                                            color={`${isCurrentUser ? "bg-red-700" : "bg-blue-700"}`} 
                                            id={0} 
                                            nome={msg.autor} 
                                            img={isCurrentUser ? currentUser.photo : chatPartner?.foto || ""} 
                                            size='w-[40px] h-[40px] lg:w-[65px] lg:h-[65px] text-[30px]' 
                                            textColor='text-white' 
                                        />
                                        <div className="flex flex-col">
                                            <span className={`text-xs text-gray-500 ${isCurrentUser ? "text-right mr-4" : "ml-4"}`}>
                                                {msg.autor}
                                            </span>
                                            <div className={`rounded-[10px] w-[200px] lg:w-[506px] p-2 relative before:content-[''] 
                                                before:absolute before:top-0 
                                                ${isCurrentUser 
                                                    ? "before:right-3 mr-2 bg-7 before:border-t-gray-200" 
                                                    : "before:left-[-30px] ml-2 bg-1 before:border-t-1 text-white"} 
                                                before:translate-x-full before:border-[10px] before:border-transparent 
                                                before:border-t-[10px] mt-1`}
                                            >
                                                <p className="break-words">{msg.conteudo}</p>
                                                <span className={`text-xs block text-right ${isCurrentUser?"text-gray-500":"text-white"}`}>
                                                    {new Date(msg.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="w-full bg-white h-[90px] rounded-[10px] mt-10 mb-5 flex justify-center items-center gap-5">
                        <div className="flex items-center p-5 w-[98%] h-[60px] bg-gray-100 rounded-full">
                            <input
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite sua mensagem"
                                className="focus:outline-0 w-[85%] h-auto mr-5 break-words bg-transparent"
                                disabled={isLoading}
                            />
                            <ButtonAddUser type="button" authentication={handleSend}>Enviar</ButtonAddUser>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white hidden 3xl:flex flex-col w-[313px] h-[200px] rounded-[10px] ml-5 mr-5 px-5">
                    <h2 className="text-2 font-bold text-[24px] mb-5">Membros</h2>
                    <div className="flex flex-col gap-5">
                        {currentUser && (
                            <div className="flex items-center gap-3">
                                <ImgUser 
                                    color="bg-red-700" 
                                    nome={currentUser.name} 
                                    img={currentUser.photo || ""} 
                                    id={1} 
                                />
                                <p className="font-bold text-[24px] truncate max-w-[200px]">{currentUser.name}</p>
                            </div>
                        )}
                        
                        {chatPartner && (
                            <div className="flex items-center gap-3">
                                <ImgUser 
                                    color="bg-blue-700" 
                                    nome={chatPartner.nome} 
                                    img={chatPartner.foto || ""} 
                                    id={chatPartner.id} 
                                />
                                <p className="font-bold text-[24px] truncate max-w-[200px]">{chatPartner.nome}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </LayoutPage>
    );
}

export default PrivateMessages;