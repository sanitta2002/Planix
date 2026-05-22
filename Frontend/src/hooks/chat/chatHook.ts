import { useQuery } from "@tanstack/react-query";
import { getChatHistory } from "../../Service/chat/chatService";
import { useEffect, useRef, useCallback, useState } from "react";
import { createChatSocket } from "../../socket/chatSocket";
import type { MessageResponse, SendMessagePayload } from "../../types/chat";
import type { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/Store";

export const useGetChatHistory = (projectId: string, limit = 50, offset = 0) => {
  return useQuery({
    queryKey: ["chatHistory", projectId, limit, offset],
    queryFn: () => getChatHistory({ projectId, limit, offset }),
    enabled: !!projectId,
    placeholderData: (prev) => prev,
  });
};

export const useChatSocket = (projectId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useSelector((state: RootState) => state.token.accessToken);

  useEffect(() => {
    if (!projectId || !accessToken) return;

    const socket = createChatSocket(accessToken);
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("joinProjectRoom", { projectId });
    });

    socket.on("joinedRoom", () => {
      console.log(`Joined chat room for project ${projectId}`);
    });

    socket.on("newMessage", (message: MessageResponse) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("error", (err: { message: string }) => {
      console.error("Chat socket error:", err.message);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("joinedRoom");
      socket.off("newMessage");
      socket.off("error");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [projectId, accessToken]);

  const sendMessage = useCallback(
    (payload: Omit<SendMessagePayload, "projectId">) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("sendMessage", {
          projectId,
          ...payload,
        });
      }
    },
    [projectId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, sendMessage, isConnected, clearMessages };
};
