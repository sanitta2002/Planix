import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL;

export const createChatSocket = (token: string): Socket => {
  return io(`${URL}/chat`, {
    auth: { token },
    autoConnect: true,
    withCredentials: true,
  });
};
