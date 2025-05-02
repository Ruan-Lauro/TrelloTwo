import LayoutPage from "../components/layoutPage";
import { useEffect, useState } from 'react';
import { Message, useChat } from '../contexts/contextChat'; 
import ButtonAddUser from "../components/buttonAddUser";
import { useParams } from "react-router-dom";
import { useGetUser, user, userGet } from "../hooks/useGetUser";

function PrivateMessages() {
    const { messages, sendPrivateMessage, getPrivateMessage } = useChat();
    const [message, setMessage] = useState('');
    const [newUser, setNewUser] = useState<userGet>();
    const [user, setUser] = useState<user>();
    const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
    const { getListUserNoSearch } = useGetUser();
    const { id } = useParams();

    useEffect(() => {
        const user = localStorage.getItem("user");
        
        if(user && id) {
            const userData = JSON.parse(user);  
            setUser(userData);
            const list = getListUserNoSearch();
            
            list.then(res => {
                const listRes: userGet[] = res.items;
                const userChoose = listRes.filter((value => value.id === parseInt(id)));
                setNewUser(userChoose[0]);
            });
        }
    }, [id]);


    useEffect(()=>{
        if(id){
            getPrivateMessage(id)
            console.log(messages);
        }
    },[messages])

    useEffect(() => {
        if (id && messages.length > 0) {
            const filtered = messages.filter(msg => {
                return msg.autor === user?.name || msg.autor === newUser?.nome;
            });
            
            setFilteredMessages(filtered);
        }
    }, [id, messages, user, newUser]);

    const handleSend = () => {
        if (user && newUser) {
            if (message.trim()) {
                sendPrivateMessage(newUser?.id, message);
                setMessage('');
            }
        }
    };

    return (
        <LayoutPage name="Mensagens" loadingValue={false}>
            <main className="w-full items-start flex bg-gray-100 pt-5">
                <div className="w-full min-w-[250px] 2xl:w-[1184px]  ml-5 max-lg:mr-5">
                    <div className="bg-white h-[90px] w-full rounded-[10px] mb-5 flex items-center pl-5">
                        <div className="flex items-center gap-5">
                            <div className="bg-blue-700 w-11 h-11 rounded-full flex items-center justify-center">
                                <p className="text-white font-bold">{newUser?.nome[0]}</p>
                            </div>
                            <p className="font-bold text-[24px] truncate max-w-[200px]">{newUser?.nome}</p>
                        </div>
                    </div>
                    <div className="bg-white w-full 2xl:w-[1184px] h-[47vh] flex flex-col px-5 gap-3 rounded-[10px] overflow-y-auto pb-2">
              
                        {filteredMessages.map((msg, idx) => (
                            <div key={idx} className={`flex mt-3 gap-2 h-auto ${user && user.name == msg.autor ? "self-end flex-row-reverse" : ""}`}>
                                <div className={`flex items-center justify-center w-[40px] h-[40px] lg:w-[65px] lg:h-[65px] rounded-full ${user && user.name === msg.autor ? "bg-red-700" : "bg-blue-700"}`}>
                                    <p className="font-bold text-[24px] lg:text-[32px] text-white">{msg.autor[0]}</p>
                                </div>
                                <div className={`bg-7 rounded-[10px] w-[200px] lg:w-[506px] p-2 relative before:content-[''] before:absolute before:top-0 ${user && user.name == msg.autor ? "before:right-3 mr-2" : "before:left-[-30px] ml-2"} before:translate-x-full before:border-[10px] before:border-transparent before:border-t-[10px] before:border-t-gray-200 mt-9`}>
                                    <p className="break-words" >{msg.conteudo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-white h-[90px] rounded-[10px] mt-10 mb-5 flex justify-center items-center gap-5">
                        <div className="flex items-center p-5 w-[98%] h-[60px] bg-gray-100 rounded-full">
                            <input
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Digite sua mensagem"
                                className="focus:outline-0 w-[85%] h-auto mr-5 break-words"
                            />
                         
                            <ButtonAddUser type="button" authentication={handleSend}>Enviar</ButtonAddUser>
                        </div>
                    </div>
                </div>
                <div className="bg-white hidden 3xl:flex flex-col w-[313px] h-[200px] rounded-[10px] ml-5 mr-5 px-5">
                    <h2 className="text-2 font-bold text-[24px] mb-5">Membros</h2>
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-700 w-11 h-11 rounded-full flex items-center justify-center">
                                <p className="text-white font-bold">{user?.name[0]}</p>
                            </div>
                            <p className="font-bold text-[24px] truncate max-w-[200px]">{user?.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-700 w-11 h-11 rounded-full flex items-center justify-center">
                                <p className="text-white font-bold">{newUser?.nome[0]}</p>
                            </div>
                            <p className="font-bold text-[24px] truncate max-w-[200px]">{newUser?.nome}</p>
                        </div>
                    </div>
                </div>
            </main>
        </LayoutPage>
    );
}

export default PrivateMessages;