import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createConnection, getConnection } from '../services/websocket';

export interface Message {
  autor: string;
  conteudo: string;
  dataHora: string;
}

interface ChatContextData {
  messages: Message[];
  sendPrivateMessage: (toUserId: string | number, conteudo: string) => void;
  getPrivateMessage: (toUserId: string) => void;
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const connection = getConnection() || createConnection(token);

    if (connection.state === "Disconnected") {
      connection
        .start()
        .then(() => {
          console.log("Conectado ao SignalR");

          connection.on("ReceiveMessage", (msg: Message) => {
            setMessages(prev => [...prev, msg]);
          });
          
        })
        .catch(err => console.error("Erro na conexão:", err));
    }

    return () => {
      if (connection.state === "Connected") {
        connection.stop();
      }
    };
  }, [token]);

  const sendPrivateMessage = (toUserId: string | number, conteudo: string) => {
    const conn = getConnection();
    if (conn?.state === "Connected") {
      const userId = typeof toUserId === 'number' ? toUserId.toString() : toUserId;
      
      conn.invoke("PrivateMessage", userId, conteudo).catch(err =>
        console.error("Erro ao enviar:", err)
      );
    }
  };

  const getPrivateMessage = async (toUserId: string): Promise<Message[]> => {
    const conn = getConnection();
    if (conn?.state === "Connected") {
      
      try {
         await conn.invoke<any[]>("GetPrivateMessages", toUserId);
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
        return [];
      }
    }
    return [];
  };

  return (
    <ChatContext.Provider value={{ 
      messages,
      getPrivateMessage, 
      sendPrivateMessage 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
}