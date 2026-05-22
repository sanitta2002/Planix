import { useState, useRef, useCallback, type KeyboardEvent, type ChangeEvent } from "react";
import { Send, Smile, Paperclip, X } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

interface EmojiData {
  native: string;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const maxH = 130; // ~5 lines
      el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: EmojiData) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div className="relative px-6 py-4 border-t border-white/[0.06] bg-gradient-to-r from-[#0d1117]/90 to-[#0d1117]/70 backdrop-blur-xl">
      {/* Emoji Picker */}
      {showEmoji && (
        <div ref={emojiRef} className="absolute bottom-full left-6 mb-3 z-50">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="dark"
              previewPosition="none"
              skinTonePosition="none"
              maxFrequentRows={1}
            />
          </div>
        </div>
      )}

      {/* Input Container */}
      <div
        className={`relative flex items-end gap-2 rounded-2xl border transition-all duration-300 ${
          isFocused
            ? "bg-white/[0.06] border-indigo-500/40 shadow-lg shadow-indigo-500/5"
            : "bg-white/[0.04] border-white/[0.08] hover:border-white/[0.12]"
        }`}
      >
        {/* Attachment Button */}
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 ml-1 mb-1 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-200"
          title="Attach file"
        >
          <Paperclip className="w-[18px] h-[18px]" />
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent text-[14px] text-white/85 placeholder:text-white/25 resize-none py-3 pr-2 outline-none leading-relaxed custom-scrollbar"
          style={{ maxHeight: "130px" }}
          disabled={disabled}
        />

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          className={`flex items-center justify-center w-10 h-10 mb-1 rounded-xl transition-all duration-200 ${
            showEmoji
              ? "text-indigo-400 bg-indigo-500/10"
              : "text-white/30 hover:text-white/60 hover:bg-white/[0.06]"
          }`}
          title="Emoji"
        >
          {showEmoji ? <X className="w-[18px] h-[18px]" /> : <Smile className="w-[18px] h-[18px]" />}
        </button>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={`flex items-center justify-center w-10 h-10 mr-1 mb-1 rounded-xl transition-all duration-300 ${
            canSend
              ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-105 active:scale-95"
              : "bg-white/[0.04] text-white/15 cursor-not-allowed"
          }`}
          title="Send message"
        >
          <Send className={`w-[16px] h-[16px] ${canSend ? "translate-x-[1px]" : ""}`} />
        </button>
      </div>

      {/* Hint */}
      <p className="mt-2 text-[10px] text-white/20 text-center">
        Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-white/30 font-mono text-[9px]">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-white/30 font-mono text-[9px]">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
};

export default ChatInput;
