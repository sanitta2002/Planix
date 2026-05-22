import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MessageSquare,
  Loader2,
  Search,
  Hash,
  Users,
  Send,
  Smile,
  Paperclip,
  X,
  Wifi,
  WifiOff,
  ChevronRight,
  FolderKanban,
} from "lucide-react";
import type { RootState } from "../../../store/Store";
import type { MessageResponse } from "../../../types/chat";
import { useGetChatHistory, useChatSocket } from "../../../hooks/chat/chatHook";
import { useGetAllProjects } from "../../../hooks/project/projectHook";
import { setCurrentProject } from "../../../store/projectSlice";
import type { Project } from "../../../types/project";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
};

const getProjectColor = (name: string): string => {
  const colors = [
    "from-indigo-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-sky-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const shouldShowMeta = (messages: MessageResponse[], index: number): boolean => {
  if (index === 0) return true;
  const prev = messages[index - 1];
  const curr = messages[index];
  if (prev.senderId !== curr.senderId) return true;
  const diff = new Date(curr.createdAt).getTime() - new Date(prev.createdAt).getTime();
  return diff > 5 * 60 * 1000;
};

// ─── Project Sidebar Item ────────────────────────────────────────────────────

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}

const ProjectItem = ({ project, isActive, onClick }: ProjectItemProps) => {
  const gradient = getProjectColor(project.projectName);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-left ${
        isActive
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-secondary/60 border border-transparent"
      }`}
    >
      {/* Project Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-bold text-white shadow-lg`}
      >
        {project.projectName[0]?.toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] font-semibold truncate transition-colors ${
            isActive ? "text-white" : "text-white/70 group-hover:text-white/90"
          }`}
        >
          {project.projectName}
        </p>
        <p className="text-[11px] text-white/30 mt-0.5 flex items-center gap-1">
          <Hash className="w-3 h-3" />
          {project.key}
        </p>
      </div>

      {/* Active indicator */}
      {isActive && <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
    </button>
  );
};

// ─── Message Bubble ──────────────────────────────────────────────────────────

interface BubbleProps {
  message: MessageResponse;
  isOwn: boolean;
  showMeta: boolean;
}

const Bubble = ({ message, isOwn, showMeta }: BubbleProps) => (
  <div
    className={`flex gap-2.5 px-4 py-0.5 group hover:bg-white/[0.015] transition-colors ${
      isOwn ? "flex-row-reverse" : "flex-row"
    }`}
    style={{ animation: "msgIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}
  >
    {/* Avatar col */}
    <div className="w-8 flex-shrink-0 pt-0.5">
      {showMeta && (
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {message.senderAvatar ? (
            <img src={message.senderAvatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-[11px] font-bold text-white bg-gradient-to-br ${
                isOwn ? "from-indigo-500 to-purple-600" : "from-emerald-500 to-teal-600"
              }`}
            >
              {message.senderName?.[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>
      )}
    </div>

    {/* Bubble */}
    <div className={`flex flex-col max-w-[68%] ${isOwn ? "items-end" : "items-start"}`}>
      {showMeta && (
        <div className={`flex items-baseline gap-2 mb-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[12px] font-semibold text-white/75">
            {isOwn ? "You" : message.senderName || "Unknown"}
          </span>
          <span className="text-[10px] text-white/25">{formatTime(message.createdAt)}</span>
        </div>
      )}

      {message.content && (
        <div
          className={`relative px-3.5 py-2 text-[13.5px] leading-relaxed break-words ${
            isOwn
              ? "bg-indigo-500 text-white rounded-2xl rounded-br-sm shadow-md shadow-indigo-500/15"
              : "bg-secondary/60 text-foreground/85 rounded-2xl rounded-bl-sm border border-border"
          }`}
        >
          {message.content}
          {!showMeta && (
            <span
              className={`absolute ${isOwn ? "-left-12" : "-right-12"} top-1/2 -translate-y-1/2 text-[9px] text-white/0 group-hover:text-white/30 transition-colors whitespace-nowrap`}
            >
              {formatTime(message.createdAt)}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);


interface InputBarProps {
  onSend: (msg: string) => void;
  disabled?: boolean;
}

const InputBar = ({ onSend, disabled }: InputBarProps) => {
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const grow = () => {
    const el = ref.current;
    if (el) { el.style.height = "auto"; el.style.height = `${Math.min(el.scrollHeight, 120)}px`; }
  };

  const send = useCallback(() => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText("");
    if (ref.current) ref.current.style.height = "auto";
  }, [text, disabled, onSend]);

  return (
    <div className="relative px-4 py-3 bg-secondary/30 border-t border-border">
      {emoji && (
        <div className="absolute bottom-full left-4 mb-2 z-50">
          <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <Picker
              data={data}
              onEmojiSelect={(e: { native: string }) => {
                setText((p) => p + e.native);
                setEmoji(false);
                ref.current?.focus();
              }}
              theme="dark"
              previewPosition="none"
              skinTonePosition="none"
              maxFrequentRows={1}
            />
          </div>
        </div>
      )}

      <div
        className={`flex items-end gap-1.5 rounded-2xl border px-3 transition-all duration-200 ${
          focused
            ? "bg-secondary/60 border-primary/35 shadow-sm shadow-primary/10"
            : "bg-secondary/30 border-border"
        }`}
      >
        <button
          onClick={() => setEmoji(!emoji)}
          className={`flex-shrink-0 w-9 h-9 mb-1.5 flex items-center justify-center rounded-xl transition-all ${
            emoji ? "text-indigo-400" : "text-white/30 hover:text-white/60"
          }`}
        >
          {emoji ? <X className="w-4 h-4" /> : <Smile className="w-4 h-4" />}
        </button>

        <button className="flex-shrink-0 w-9 h-9 mb-1.5 flex items-center justify-center rounded-xl text-white/30 hover:text-white/60 transition-all">
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          ref={ref}
          rows={1}
          value={text}
          disabled={disabled}
          onChange={(e) => { setText(e.target.value); grow(); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={disabled ? "Select a project to chat..." : "Type a message…"}
          className="flex-1 bg-transparent text-[13.5px] text-white/85 placeholder:text-white/25 resize-none py-2.5 outline-none leading-relaxed custom-scrollbar"
          style={{ maxHeight: 120 }}
        />

        <button
          onClick={send}
          disabled={!text.trim() || disabled}
          className={`flex-shrink-0 w-9 h-9 mb-1.5 flex items-center justify-center rounded-xl transition-all duration-200 ${
            text.trim() && !disabled
              ? "bg-indigo-500 text-white hover:bg-indigo-400 active:scale-95 shadow-md shadow-indigo-500/20"
              : "text-white/15 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4 translate-x-px" />
        </button>
      </div>

      <p className="mt-1.5 text-[10px] text-white/15 text-center">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
};



const ChatPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentProject = useSelector((state: RootState) => state.project.currentProject);
  const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);

  const [search, setSearch] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);
  const projectId = currentProject?.id || "";

  // Fetch all workspace projects for the sidebar
  const { data: projectsData, isLoading: projectsLoading } = useGetAllProjects({
    workspaceId: currentWorkspace?.id || "",
    limit: 100,
    page: 1,
  });
  const projects: Project[] = projectsData?.data?.data || [];

  const filteredProjects = useMemo(
    () => projects.filter((p) => p.projectName.toLowerCase().includes(search.toLowerCase())),
    [projects, search]
  );

  // Chat data
  const { data: historyData, isLoading: historyLoading } = useGetChatHistory(projectId);
  const { messages: liveMessages, sendMessage, isConnected } = useChatSocket(projectId);

  // Merge history + realtime
  const allMessages = useMemo(() => {
    const hist = historyData?.messages || [];
    const seen = new Set<string>();
    return [...hist, ...liveMessages].filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [historyData?.messages, liveMessages]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: { date: string; messages: MessageResponse[] }[] = [];
    let cur = "";
    allMessages.forEach((msg) => {
      const d = formatDate(msg.createdAt);
      if (d !== cur) { cur = d; groups.push({ date: d, messages: [msg] }); }
      else groups[groups.length - 1].messages.push(msg);
    });
    return groups;
  }, [allMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleSelectProject = (project: Project) => {
    dispatch(setCurrentProject(project));
  };

  const handleSend = (content: string) => sendMessage({ content });

  return (
    <div className="flex h-[calc(100vh-6rem)] rounded-2xl overflow-hidden border border-border bg-background shadow-2xl shadow-black/40">

      {/* ── LEFT SIDEBAR ── */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r border-border bg-secondary/40">

        {/* Sidebar Header */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-white/90">Chat</h2>
              <p className="text-[10px] text-white/30">
                {currentWorkspace?.name || "Workspace"}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border rounded-xl text-[12px] text-foreground/70 placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 focus:bg-secondary/70 transition-all"
            />
          </div>
        </div>

        {/* Section label */}
        <div className="px-4 mb-2">
          <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">
            Projects · {filteredProjects.length}
          </span>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4 space-y-0.5">
          {projectsLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-indigo-400/60 animate-spin" />
            </div>
          )}

          {!projectsLoading && filteredProjects.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center px-4">
              <FolderKanban className="w-8 h-8 text-white/10" />
              <p className="text-[12px] text-white/25">
                {search ? "No projects found" : "No projects in workspace"}
              </p>
            </div>
          )}

          {filteredProjects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              isActive={currentProject?.id === project.id}
              onClick={() => handleSelectProject(project)}
            />
          ))}
        </div>

      </div>

      {/* ── RIGHT: CHAT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {!currentProject ? (
          /* No project selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-5 text-center max-w-sm px-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 ring-1 ring-white/[0.05] flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-indigo-400/40" />
                </div>
                <div className="absolute -inset-6 bg-indigo-500/5 rounded-full blur-3xl" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-white/60 mb-2">
                  Select a project to chat
                </h3>
                <p className="text-[13px] text-white/25 leading-relaxed">
                  Choose a project from the left panel to start messaging your team
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white/20">
                <Users className="w-3.5 h-3.5" />
                {projects.length} project{projects.length !== 1 ? "s" : ""} available
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary/30 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getProjectColor(currentProject.projectName)} flex items-center justify-center text-sm font-bold text-white`}
                >
                  {currentProject.projectName[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white/90">
                    {currentProject.projectName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-400" : "bg-amber-400"} transition-colors`}
                    />
                    <span className="text-[10px] text-white/30">
                      {isConnected ? "Connected" : "Connecting..."}
                    </span>
                    <span className="text-white/15 mx-1">·</span>
                    {isConnected ? (
                      <Wifi className="w-3 h-3 text-emerald-400/60" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-amber-400/60" />
                    )}
                  </div>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  {(currentProject.members || []).slice(0, 5).map((m, i) => (
                    <div
                      key={m.user.id}
                      style={{ zIndex: 10 - i }}
                      className="relative w-7 h-7 rounded-full border-2 border-background overflow-hidden"
                      title={m.user.firstName}
                    >
                      {m.user.avatarUrl ? (
                        <img src={m.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[9px] font-bold text-white">
                          {m.user.firstName?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-white/30">
                  {currentProject.members?.length || 0} members
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-3">
              {historyLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                    <p className="text-[12px] text-white/30">Loading messages…</p>
                  </div>
                </div>
              )}

              {!historyLoading && allMessages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4 text-center max-w-xs px-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 ring-1 ring-white/[0.05] flex items-center justify-center">
                      <Hash className="w-7 h-7 text-indigo-400/40" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-white/50 mb-1.5">
                        No messages yet
                      </p>
                      <p className="text-[12px] text-white/25 leading-relaxed">
                        Start the conversation for{" "}
                        <span className="text-indigo-400/70 font-medium">
                          {currentProject.projectName}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!historyLoading && grouped.map((group) => (
                <div key={group.date}>
                  {/* Date separator */}
                  <div className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 h-px bg-border/50" />
                    <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider px-3 py-1 rounded-full bg-secondary/50 border border-border whitespace-nowrap">
                      {group.date}
                    </span>
                    <div className="flex-1 h-px bg-white/[0.04]" />
                  </div>

                  <div className="space-y-0.5">
                    {group.messages.map((msg, idx) => {
                      const isOwn = msg.senderId === user?.id;
                      const meta = shouldShowMeta(group.messages, idx);
                      return (
                        <div key={msg.id} className={meta && idx > 0 ? "mt-3" : ""}>
                          <Bubble message={msg} isOwn={isOwn} showMeta={meta} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEnd} />
            </div>

            {/* Input */}
            <InputBar onSend={handleSend} disabled={!projectId} />
          </>
        )}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
