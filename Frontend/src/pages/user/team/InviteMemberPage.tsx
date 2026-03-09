
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/Store";
import { useInviteMember, useWorkspaceMembers } from "../../../hooks/user/userHook";
import { toast } from "sonner";
import { AxiosError } from "axios";


export interface WorkspaceMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "owner" | "member";
    joinedAt: string;
}


export default function InviteMemberPage() {
    const [email, setEmail] = useState<string>('')
    const [name, setName] = useState<string>('')
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace)
    const { mutate: inviteMember } = useInviteMember()
    const { data, isLoading } = useWorkspaceMembers(currentWorkspace?.id || "")

    const handleInvite = () => {
        if (!email) {
            return toast.error("Please enter an email")
        }
        if (!currentWorkspace?.id) {
            return toast.error("Workspace not found");
        }
        inviteMember({
            workspaceId: currentWorkspace?.id,
            email,
            name
        }, {
            onSuccess: () => {
                toast.success("Member invited successfully")
                setEmail("");
                setName('')
            },
            onError: (error) => {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data.message)
                }
            }
        })
    };



    return (
        <div className="min-h-full p-2 md:p-6 pt-6">
            {/* Breadcrumb */}

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-white mb-6">Team Members</h1>

            {/* Invite Members Card */}
            <div className="bg-[#0f1729]/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 mb-6 shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-1">
                    Invite Members
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                    Add up to 6 members to your team.
                </p>

                {/* Invite Rows */}
                <div className="space-y-3">

                    <div className="flex items-end gap-3">
                        {/* Email */}
                        <div className="flex-1">

                            <input
                                type="email"
                                placeholder="member@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}

                                className="w-full h-11 px-4 rounded-xl bg-[#1a2340] border border-gray-700/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#606cf6] focus:ring-1 focus:ring-[#606cf6] transition-all duration-200"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="flex-1">

                            <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl bg-[#1a2340] border border-gray-700/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#606cf6] focus:ring-1 focus:ring-[#606cf6] transition-all duration-200"
                            />
                        </div>
                    </div>

                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-5">

                    <button
                        disabled={!currentWorkspace}
                        onClick={handleInvite}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#606cf6] to-[#606cf6] text-white text-sm font-semibold hover:from-[#606cf6] hover:to-[#606cf6] shadow-lg shadow-[#272f80] hover:shadow-[#272f80] transition-all duration-200"
                    >
                        Send Invitation
                    </button>
                </div>
            </div>

            {/* Existing Members Card */}
            <div className="bg-[#0f1729]/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-5">
                    Existing Members
                </h2>

                <div className="space-y-3">

                    {isLoading && (
                        <p className="text-gray-400 text-sm">Loading members...</p>
                    )}

                    {data?.data?.members?.length > 0 ? (
                        data.data.members.map((member: WorkspaceMember) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-[#1a2340]/60 border border-gray-800/30 hover:border-gray-700/50 hover:bg-[#1a2340] transition-all duration-200 group"
                            >

                                {/* Member Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">
                                        {member.firstName} {member.lastName}
                                    </p>

                                    <p className="text-xs text-gray-400 truncate">
                                        {member.email}
                                    </p>
                                </div>

                                {/* Role Badge */}
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${member.role === "member"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-[#8e1414]/20 text-[#c71414]"
                                        }`}
                                >
                                    {member.role}
                                </span>

                                {/* Joined Date */}
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 min-w-[120px]">
                                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                    <span>
                                        {new Date(member.joinedAt).toLocaleDateString()}
                                    </span>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-sm">No team members yet.</p>
                            <p className="text-xs mt-1">
                                Invite members using the form above.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
