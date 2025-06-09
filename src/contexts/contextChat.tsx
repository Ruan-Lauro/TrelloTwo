import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createConnection, getConnection, registerListener, waitForConnection } from '../services/websocket';

export interface Message {
  autor: string;
  conteudo: string;
  dataHora: string;
}

export interface PrivateMessage extends Message {
  toUserId: string; 
}

export interface GroupMessage extends Message {
  grupoId: number;
}

interface ChatContextData {
  messages: Message | undefined;
  privateMessages: Message[]; 
  groupMessages: GroupMessage | undefined;
  privateGroupMessages: GroupMessage[];
  sendPrivateMessage: (toUserId: string | number, conteudo: string) => Promise<void>;
  getPrivateMessage: (toUserId: string | number) => Promise<Message[]>;
  sendGroupMessage: (toGroupId: string | number, conteudo: string) => Promise<void>;
  getGroupMessages: (toGroupId: string | number) => Promise<void>;
  clearPrivateMessages: () => void; 
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message>();
  const [privateMessages, setPrivateMessages] = useState<Message[]>([]);
  const [groupMessages, setGroupMessages] = useState<GroupMessage | undefined>();
  const [privateGroupMessages, setPrivateGroupMessages] = useState<GroupMessage[]>([]);
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    if(token){
      console.log("Passando aquii")
      createConnection(token);
      initConnection();
    }
  }, [token]);

  const clearPrivateMessages = () => {
    setPrivateMessages([]);
    setPrivateGroupMessages([])
  };

  const initConnection = async (): Promise<void> => {
    await waitForConnection();

    registerListener<[Message]>("ReceiveMessage", (msg: Message) => {
      if(!msg) return;
      setMessages(msg);
    });

    registerListener("ReceiveAllMessages", (msgs: Message[]) => {
      if (!msgs || msgs.length === 0) {
        
        setPrivateMessages([]);
        return;
      }
      setPrivateMessages(msgs);
    });

    registerListener("ReceiveGroupMessage", (msg: GroupMessage) => {
      if (!msg) return;
      setGroupMessages(msg);
    });
    
    registerListener("ReceiveAllGroupMessages", (msgs: GroupMessage[]) => {
      if (!msgs) return;
      setPrivateGroupMessages(msgs);
    });
  };

  const sendPrivateMessage = async (toUserId: string | number, conteudo: string): Promise<void> => {
    try {
      await waitForConnection();
      
      const conn = getConnection();
      if (conn) {
        const userId = typeof toUserId === 'number' ? toUserId.toString() : toUserId;
        await conn.invoke("PrivateMessage", userId, conteudo);
        initConnection();
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem privada:", err);
    }
  };

  const getPrivateMessage = async (toUserId: string | number): Promise<Message[]> => {
    try {
      await waitForConnection();
      
      const conn = getConnection();
      const userId = typeof toUserId === 'number' ? toUserId.toString() : toUserId;
      
      if (conn) {

        setPrivateMessages([]);
        await conn.invoke("GetPrivateMessages", userId);
        initConnection();
      }
    } catch (err) {
      console.error("Erro ao buscar mensagens privadas:", err);
    }
    return [];
  };

  const sendGroupMessage = async (toGroupId: string | number, conteudo: string): Promise<void> => {
    try {
      await waitForConnection();
      
      const conn = getConnection();
      if (conn) {
        const groupId = typeof toGroupId === 'number' ? toGroupId.toString() : toGroupId;
        await conn.invoke("GroupMessage", groupId, conteudo);
        initConnection();
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem de grupo:", err);
    }
  };

  const getGroupMessages = async (toGroupId: string | number): Promise<void> => {
    try {
      await waitForConnection();
      const conn = getConnection();
      if (conn) {
        const groupId = typeof toGroupId === 'number' ? toGroupId.toString() : toGroupId;
        setPrivateGroupMessages([]);
        await conn.invoke("GetGroupMessages", groupId);
        await initConnection();

      }
    } catch (err) {
      console.error("Erro ao buscar mensagens de grupo:", err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        privateMessages,
        groupMessages,
        privateGroupMessages,
        sendPrivateMessage,
        getPrivateMessage,
        sendGroupMessage,
        getGroupMessages,
        clearPrivateMessages, 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextData {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}