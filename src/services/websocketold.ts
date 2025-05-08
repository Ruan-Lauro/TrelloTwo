import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export const createConnection = (token: string) => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl('https://api-dashboard.maot.dev/chat', {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();
  }

  return connection;
};
