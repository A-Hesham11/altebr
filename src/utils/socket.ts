import { io } from "socket.io-client";

export const SOCKET_SERVER_URL = "https://backend.alexonsolutions.net";

export const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
