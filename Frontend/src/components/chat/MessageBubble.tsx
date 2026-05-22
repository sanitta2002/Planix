import { FileText, Download } from "lucide-react";
import type { MessageResponse } from "../../types/chat";

interface MessageBubbleProps {
  message: MessageResponse;
  isOwn: boolean;
  showAvatar: boolean;
  showName: boolean;
}

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const MessageBubble = ({ message, isOwn, showAvatar, showName }: MessageBubbleProps) => {
  const hasAttachments = message.attachments && message.attachments.length > 0;

  return (
    <div
      className={`flex gap-3 px-6 py-0.5 group transition-colors duration-150 hover:bg-white/[0.02] ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
      style={{
        animation: "messageSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 pt-0.5">
        {showAvatar && (
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#0d1117]">
            {message.senderAvatar ? (
              <img
                src={message.senderAvatar}
                alt={message.senderName || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-xs font-bold text-white ${
                  isOwn
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                    : "bg-gradient-to-br from-emerald-500 to-teal-600"
                }`}
              >
                {message.senderName?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col max-w-[65%] ${isOwn ? "items-end" : "items-start"}`}>
        {/* Name & Time */}
        {showName && (
          <div className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
            <span className="text-[13px] font-semibold text-white/80">
              {isOwn ? "You" : message.senderName || "Unknown"}
            </span>
            <span className="text-[10px] text-white/25 font-medium">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        {/* Message bubble */}
        {message.content && (
          <div
            className={`relative px-4 py-2.5 text-[14px] leading-relaxed break-words ${
              isOwn
                ? "bg-gradient-to-br from-indigo-500/90 to-indigo-600/90 text-white rounded-2xl rounded-br-md shadow-lg shadow-indigo-500/10"
                : "bg-white/[0.06] backdrop-blur-sm text-white/85 rounded-2xl rounded-bl-md border border-white/[0.06]"
            }`}
          >
            {message.content}
            {/* Timestamp on hover for non-named messages */}
            {!showName && (
              <span
                className={`absolute ${
                  isOwn ? "-left-14" : "-right-14"
                } top-1/2 -translate-y-1/2 text-[10px] text-white/0 group-hover:text-white/30 transition-colors duration-200 whitespace-nowrap`}
              >
                {formatTime(message.createdAt)}
              </span>
            )}
          </div>
        )}

        {/* Attachments */}
        {hasAttachments && (
          <div className={`flex flex-col gap-1.5 mt-1.5 ${isOwn ? "items-end" : "items-start"}`}>
            {message.attachments.map((att, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-200 cursor-pointer group/file max-w-xs"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/10">
                  <FileText className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white/75 truncate">
                    {att.fileName}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {att.fileType} {formatFileSize(att.fileSize)}
                  </p>
                </div>
                <Download className="w-4 h-4 text-white/0 group-hover/file:text-white/40 transition-colors duration-200" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
