import { Hash, Search, Users } from "lucide-react";
import type { Member } from "../../types/project";

interface ChatHeaderProps {
  projectName: string;
  members: Member[];
}

const ChatHeader = ({ projectName, members }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-gradient-to-r from-[#0d1117]/80 to-[#0d1117]/60 backdrop-blur-xl">
      {/* Left: Channel info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
          <Hash className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-white/90 tracking-tight">
            {projectName}
          </h2>
          <p className="text-[11px] text-white/40 mt-0.5">
            Project chat channel
          </p>
        </div>
      </div>

      {/* Right: Members & Actions */}
      <div className="flex items-center gap-4">
        {/* Member Avatars (stacked) */}
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((member, index) => (
              <div
                key={member.user.id}
                className="relative w-8 h-8 rounded-full border-2 border-[#0d1117] overflow-hidden transition-transform hover:scale-110 hover:z-10"
                style={{ zIndex: members.length - index }}
                title={member.user.firstName}
              >
                {member.user.avatarUrl ? (
                  <img
                    src={member.user.avatarUrl}
                    alt={member.user.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {member.user.firstName?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
            ))}
          </div>
          {members.length > 4 && (
            <div className="ml-1 flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] border-2 border-[#0d1117] text-[10px] font-medium text-white/50">
              +{members.length - 4}
            </div>
          )}
        </div>

        {/* Member count */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <Users className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[11px] font-medium text-white/50">
            {members.length}
          </span>
        </div>

        {/* Search */}
        <button className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200">
          <Search className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
