
import { Calendar, MoreVertical, Trash2, } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/Store";
import { useInviteMember } from "../../../hooks/user/userHook";
import { toast } from "sonner";



export default function InviteMemberPage() {
    const [email, setEmail] = useState<string>('')
    const [name, setName] = useState<string>('')
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace)
    const { user } = useSelector((state: RootState) => state.auth);
    const isOwner = currentWorkspace?.ownerId === user?.id;
    const { mutate: inviteMember } = useInviteMember()

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
            onError: () => {
                toast.error("Failed to invite member");
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
                    {/* Add up to 6 members to your team. */}
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
                        onClick={handleInvite}
                        disabled={!isOwner}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
    ${isOwner
                                ? "bg-gradient-to-r from-[#606cf6] to-[#606cf6] text-white"
                                : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }
  `}
                    >
                        Send Invitation
                    </button>
                    {!isOwner && (
                        <p className="text-xs text-gray-500 mt-2">
                            Only workspace owner can invite members.
                        </p>
                    )}
                </div>
            </div>

            {/* Existing Members Card */}
            <div className="bg-[#0f1729]/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-5">
                    Existing Members
                </h2>

                <div className="space-y-3">

                    <div

                        className="flex items-center gap-4 p-4 rounded-xl bg-[#1a2340]/60 border border-gray-800/30 hover:border-gray-700/50 hover:bg-[#1a2340] transition-all duration-200 group"
                    >
                        {/* Avatar */}
                        {/* <AvatarCircle /> */}

                        {/* Member Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                                { }
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                { }
                            </p>
                        </div>

                        {/* Role Badge */}
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium 
                                    }`}
                        >
                            { }
                        </span>

                        {/* Joined Date */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 min-w-[120px]">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            <span>{ }</span>
                        </div>

                        {/* More Actions */}
                        <div className="relative">
                            <button


                                className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-700/30 transition-all duration-200"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}

                            <>
                                <div
                                    className="fixed inset-0 z-10"

                                />
                                <div className="absolute right-0 top-full mt-1 w-40 bg-[#1a2340] border border-gray-700/50 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/30 hover:text-white transition-colors">
                                        Change Role
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Remove
                                    </button>
                                </div>
                            </>

                        </div>
                    </div>



                    <div className="text-center py-12 text-gray-500">
                        <p className="text-sm">No team members yet.</p>
                        <p className="text-xs mt-1">
                            Invite members using the form above.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
