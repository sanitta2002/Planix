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

export const useChatSocket = (
  projectId: string,
  options?: {
    onMessageEdited?: (message: MessageResponse) => void;
    onMessageDeleted?: (messageId: string) => void;
  }
) => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useSelector((state: RootState) => state.token.accessToken);

  const callbacksRef = useRef(options);
  useEffect(() => {
    callbacksRef.current = options;
  }, [options]);

  useEffect(() => {
    setMessages([]);
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
      console.log(
        "[DEBUG SOCKET]",
        message.projectId,
        projectId,
        message.senderId
      );

      if (String(message.projectId) !== String(projectId)) {
        return;
      }

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    socket.on("messageEdited", (message: MessageResponse) => {
      console.log("[DEBUG SOCKET] messageEdited", message);
      if (String(message.projectId) !== String(projectId)) {
        return;
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? message : m))
      );
      callbacksRef.current?.onMessageEdited?.(message);
    });

    socket.on("messageDeleted", ({ messageId }: { messageId: string }) => {
      console.log("[DEBUG SOCKET] messageDeleted", messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      callbacksRef.current?.onMessageDeleted?.(messageId);
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
      socket.off("messageEdited");
      socket.off("messageDeleted");
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

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("editMessage", {
          messageId,
          projectId,
          content,
        });
      }
    },
    [projectId]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("deleteMessage", {
          messageId,
          projectId,
        });
      }
    },
    [projectId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    isConnected,
    clearMessages,
  };
};
