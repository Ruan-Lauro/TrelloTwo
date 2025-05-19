import { useEffect, useState, useRef } from 'react';
import { useChat } from '../contexts/contextChat';
import { useNavigate } from 'react-router-dom';
import { nameOfUser } from '../functions/chat';
import { inforMessage } from './layoutPage';

interface NotificationToastProps {
  timeoutMs?: number;
  inforMessage?: inforMessage;
}

interface ActiveNotification {
  id: number;
  type: 'private' | 'group';
  author: string;
  content: string;
  timestamp: number;
}

export default function NotificationToast({ timeoutMs = 5000, inforMessage }: NotificationToastProps) {
  const { messages, groupMessages } = useChat();
  const [notifications, setNotifications] = useState<ActiveNotification[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    return localStorage.getItem("audioEnabled") === "true";
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const userData = JSON.parse(userJson);
      setCurrentUser(userData.name);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1;
      audioRef.current.muted = false;
    }
  }, [audioRef]);

  const playNotificationSound = () => {
    if (audioEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err =>
        console.error("Failed to play notification sound:", err)
      );
    }
  };

 useEffect(() => {
  if (!messages || !currentUser) return;
  if (messages.autor === currentUser) return;
  if(inforMessage && inforMessage.type === "user" && inforMessage.nome === messages.autor) return;

  const handleNotification = async () => {
    const id = await nameOfUser(messages.autor);

    if (!id) return;

    const newNotification: ActiveNotification = {
      id,
      type: 'private',
      author: messages.autor,
      content: messages.conteudo,
      timestamp: Date.now(),
    };

    setNotifications(prev => [...prev, newNotification]);
    playNotificationSound();

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, timeoutMs);
  };

  handleNotification();
}, [messages]);


  useEffect(() => {
    if (!groupMessages || !currentUser) return;
    if (groupMessages.autor === currentUser) return;
    if(inforMessage && inforMessage.type === "group" && inforMessage.id === groupMessages.grupoId) return;

    const newNotification: ActiveNotification = {
      id: groupMessages.grupoId,
      type: 'group',
      author: groupMessages.autor,
      content: groupMessages.conteudo,
      timestamp: Date.now(),
    };

    setNotifications(prev => [...prev, newNotification]);
    playNotificationSound();

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, timeoutMs);
  }, [groupMessages]);

  if (!audioEnabled) {
    return (
      <>
        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => {
                  setAudioEnabled(true);
                  localStorage.setItem("audioEnabled", "true");
                })
                .catch(err => {
                  console.error("User gesture required to play audio:", err);
                });
            }
          }}
          className="fixed bottom-16 right-4 z-50 bg-blue-600 text-white p-3 rounded shadow"
        >
          Ativar som de notificação 🔈
        </button>

        <audio ref={audioRef}>
          <source src="/src/assets/song/olha-a-mensagem.mp3" type="audio/mpeg" />
          Seu navegador não suporta áudio.
        </audio>
      </>
    );
  }

  return (
    <>
      <audio ref={audioRef}>
        <source src="/src/assets/song/olha-a-mensagem.mp3" type="audio/mpeg" />
        Seu navegador não suporta áudio.
      </audio>

      <div className="fixed bottom-16 right-4 z-50 flex flex-col-reverse gap-2 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start p-3 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 cursor-pointer
              ${notification.type === 'private' ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-green-50 border-l-4 border-green-500'}`}
            onClick={()=>{
                notification.type === "group"?navigate(`/MensagemAoGrupo/${notification.id}`): navigate(`/MensagemAoUsuario/${notification.id}`)
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {notification.type === 'private' ? '💬 ' : '👥 '}
                {notification.author}
              </p>
              <p className="text-sm text-gray-700 truncate max-w-xs">
                {notification.content}
              </p>
            </div>
            <button
              className="ml-2 inline-flex text-gray-400 hover:text-gray-700 focus:outline-none"
              onClick={() => {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
              }}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
