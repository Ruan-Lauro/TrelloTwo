import * as signalR from '@microsoft/signalr';

interface Listener {
  eventName: string;
  callback: (...args: any[]) => void;
}

let connection: signalR.HubConnection | null = null;
let listeners: Listener[] = [];
let connectionPromise: Promise<boolean> | null = null;

export const createConnection = (token: string): signalR.HubConnection => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl('https://api-dashboard.maot.dev/chat', {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();
      
    connectionPromise = startConnection();
    
    connection.onclose(async (error?: Error) => {
      console.log('Conexão SignalR fechada:', error);
      
      await reconnect();
    });
  }

  return connection;
};

const startConnection = async (): Promise<boolean> => {
  if (!connection) return false;
  
  try {
    await connection.start();
    console.log('Conectado ao SignalR com sucesso');

    reregisterAllListeners();
    
    return true;
  } catch (err) {
    console.error('Erro ao conectar ao SignalR:', err);
    return false;
  }
};

const reconnect = async (): Promise<boolean> => {
  if (!connection) return false;
  
  try {
    await connection.start();
    console.log('Reconectado ao SignalR com sucesso');
    
    reregisterAllListeners();
    
    return true;
  } catch (err) {
    console.error('Erro ao reconectar ao SignalR:', err);
    
    setTimeout(reconnect, 5000);
    return false;
  }
};

export const getConnection = (): signalR.HubConnection | null => connection;

export const registerListener = <T extends any[]>(eventName: string, callback: (...args: T) => void): void => {
  if (!connection) return;
  
  listeners.push({ eventName, callback });
  
  connection.on(eventName, callback);
};

const reregisterAllListeners = (): void => {
  if (!connection) return;
  
  connection.off();
  
  listeners.forEach(({ eventName, callback }) => {
    if(connection){
      connection.on(eventName, callback);
    }
  });
};

export const waitForConnection = async (): Promise<boolean> => {
  if (!connectionPromise) {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      return true;
    }
    return false;
  }
  return connectionPromise;
};

 
export const clearConnection = (): void => {
  if (connection) {
    connection.stop();
    connection = null;
    connectionPromise = null;
    listeners = [];
  }
};