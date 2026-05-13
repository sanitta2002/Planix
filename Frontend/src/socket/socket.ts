
import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL;
export const createNotificationSocket = (userId: string): Socket => {
  return io(`${URL}/notification`, {
    query: { userId },
    autoConnect: true,
    withCredentials: true,
  });
};
