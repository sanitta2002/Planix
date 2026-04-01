import { X, Users, Plus, UserPlus, Shield, User } from "lucide-react";
import type { ProjectMember } from "../../types/ProjectMember";
import { useEffect, useState } from "react";
import type { WorkspaceMember } from "../../types/workspaceMember";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/Store";
import { useGetRoles, useWorkspaceMembers } from "../../hooks/user/userHook";
import type { Role } from "../../types/role";
import { useRemoveProjectMember, useUpdateProject } from "../../hooks/project/projectHook";
import { toast } from "sonner";
import ConfirmationModal from "./ConfirmationModal";
type Project = {
    id: string;
    members: {
        user: {
            id: string;
            firstName: string;
            avatarUrl?: string;
        };
        role: {
            id: string;
            name: string;
        };
    }[];
};
type ManageMembersModalProps = {
    open: boolean;
    onClose: () => void;
    project: Project | null;
};


const ManageMembersModal = ({
    open,
    onClose,
    project,
}: ManageMembersModalProps) => {

    const [roles, setRoles] = useState<Role[]>([]);
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([]);
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace)
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const { data: roleData } = useGetRoles();
    const { data: WorkspaceMembers } = useWorkspaceMembers(currentWorkspace?.id || '')
    const { mutate: updateProjectMutation} = useUpdateProject();
    const { mutate: removeMember , } = useRemoveProjectMember();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

    useEffect(() => {
        if (roleData) {
            setRoles(roleData.data ?? roleData);
        }
    }, [roleData]);

    useEffect(() => {
        if (WorkspaceMembers) {
            const membersArray =
                WorkspaceMembers?.data?.members ||
                WorkspaceMembers?.data ||
                [];

            setWorkspaceMembers(membersArray);
        }
    }, [WorkspaceMembers])

    useEffect(() => {
        if (project?.members) {
            setMembers(
                project.members.map((m: any) => ({
                    userId: m.user?.id || m.user?._id || m.userId,
                    roleId: m.role?.id || m.role?._id || m.roleId,
                }))
            );
        }
    }, [project]);

    const handleSave = () => {
        if (!project) return;
        updateProjectMutation({
            projectId: project.id,
            members: members,
        },
            {
                onSuccess: () => {
                    toast.success("Project updated successfully");
                    setMembers([]);
                    setSelectedUser("");
                    setSelectedRole("");
                    onClose();
                    
                },
                onError: () => {
                    toast.error("Failed to update project");
                }
            }
        );
    };

    const handleConfirmRemove = () => {
        if (!selectedMemberId || !project) return;

        removeMember(
            {
                projectId: project.id,
                userId: selectedMemberId,
            },
            {
                onSuccess: () => {
                    setMembers(prev =>
                        prev.filter(m => m.userId !== selectedMemberId)
                    );
                     
                    toast.success('Project member removed successfully')
                    setIsConfirmOpen(false);
                    setSelectedMemberId(null);
                },
            }
        );
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div
                className="w-full max-w-3xl bg-gradient-to-b from-[#0A0E27]/95 to-[#050818]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.1)] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 🔷 Header */}
                <div className="relative flex items-center justify-between p-6 px-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6366F1]/50 to-transparent"></div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6366F1]/20 to-[#6366F1]/5 border border-[#6366F1]/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Users className="h-6 w-6 text-[#818CF8]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                                Manage Members
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Add or remove members and assign roles to this project.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 ml-4 group"
                    >
                        <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* 🔹 Body */}
                <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">

                    {/*  Add Members Section */}
                    <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#6366F1]/10 blur-[60px] rounded-full pointer-events-none"></div>

                        <h3 className="relative text-base font-semibold text-white flex items-center gap-3 mb-5">
                            <div className="p-1.5 rounded-lg bg-[#6366F1]/20 text-[#818CF8]">
                                <UserPlus className="h-4 w-4" />
                            </div>
                            Add New Member
                        </h3>

                        <div className="relative flex flex-col sm:flex-row items-center gap-4">
                            {/* User Select */}
                            <div className="relative w-full sm:flex-1 group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#6366F1] transition-colors" />
                                </div>
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                                >
                                    <option value="" className="bg-[#0F172A]">Select Member</option>
                                    {workspaceMembers.filter(member => member.id !== currentWorkspace?.ownerId?.id).map((user) => (
                                        <option key={user.id} value={user.id} className="bg-[#0F172A] py-2">
                                            {user.firstName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Role Select */}
                            <div className="relative w-full sm:flex-1 group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Shield className="h-4 w-4 text-slate-400 group-focus-within:text-[#6366F1] transition-colors" />
                                </div>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                                >
                                    <option value="" className="bg-[#0F172A]">Select Role</option>
                                    {roles?.map((role: any) => (
                                        <option key={role._id || role.id} value={role._id || role.id} className="bg-[#0F172A] py-2">
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={() => {
                                    if (!selectedUser || !selectedRole) return;
                                    const exists = members.some(m => m.userId === selectedUser);
                                    if (exists) return;
                                    setMembers(prev => [
                                        ...prev,
                                        { userId: selectedUser, roleId: selectedRole }
                                    ]);
                                    setSelectedUser('');
                                    setSelectedRole('');
                                }}
                                disabled={!selectedUser || !selectedRole}
                                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white font-medium rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add</span>
                            </button>
                        </div>
                    </div>

                    {/*  Existing Members */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-semibold text-white flex items-center gap-3">
                                <div className="w-2 h-6 bg-gradient-to-b from-[#6366F1] to-[#4F46E5] rounded-full" />
                                Current Team ({members.length})
                            </h3>
                        </div>
                        <div>
                            {members.length > 0 ? (
                                members.map((member, index) => {
                                    const user = workspaceMembers.find((u) => u.id === member.userId) ||
                                        project?.members?.find((m: any) => (m.user?.id || m.user?._id) === member.userId)?.user;

                                    const role = roles.find((r) => r._id === member.roleId) ||
                                        project?.members?.find((m: any) => (m.role?.id || m.role?._id) === member.roleId)?.role;

                                    return (
                                        <div
                                            key={index}
                                            className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300"
                                        >
                                            {/* LEFT - User Info */}
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-base font-bold text-white shadow-lg">
                                                        {user?.avatarUrl ? (
                                                            <img src={user.avatarUrl} alt={user?.firstName || "User"} className="w-full h-full object-cover" />
                                                        ) : (
                                                            (user?.firstName?.[0] || "U").toUpperCase()
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-semibold text-slate-200 group-hover:text-white">
                                                        {user?.firstName || "New Member"}
                                                    </p>
                                                    <p className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                                        {role?.name ? role.name.replace(/_/g, ' ').toLowerCase() : 'No Role Assigned'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* RIGHT - Role & Actions */}
                                            <div className="flex items-center gap-3 w-full sm:w-auto">

                                                {/* ROLE */}
                                                <div className="relative flex-1 sm:w-48">
                                                    {role?.name === 'PROJECT_MANAGER' ? (
                                                        <div className="w-full bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-lg px-3 py-2 text-sm text-[#818CF8] font-medium text-center cursor-not-allowed">
                                                            Project Manager
                                                        </div>
                                                    ) : (
                                                        <select
                                                            value={member.roleId}
                                                            onChange={(e) => {
                                                                setMembers(prev => prev.map((m, i) => i === index ? { ...m, roleId: e.target.value } : m));
                                                            }}
                                                            className="w-full bg-[#0F172A]/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-slate-300"
                                                        >
                                                            <option value="" disabled>Select Role</option>
                                                            {roles?.map((r: any) => (
                                                                <option key={r._id || r.id} value={r._id || r.id}>
                                                                    {r.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>

                                                {/* REMOVE */}
                                                {role?.name !== 'PROJECT_MANAGER' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedMemberId(member.userId);
                                                            setIsConfirmOpen(true);
                                                        }}
                                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}

                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-12 px-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <Users className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <p className="text-slate-300 font-medium text-sm">No members added yet</p>
                                    <p className="text-slate-500 text-xs mt-1 max-w-xs">Use the section above to add members to this project.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* 🔻 Footer */}
                <div className="flex items-center justify-end gap-4 p-6 px-8 border-t border-white/5 bg-white/[0.02] mt-auto">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-white/5 rounded-xl transition-all duration-300"
                    >
                        Cancel
                    </button>

                    <button onClick={handleSave} className="px-8 py-2.5 text-sm font-medium bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-[#6366F1]/20">
                        Save Changes
                    </button>
                </div>

            </div>
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmRemove}
                title="Remove Member"
                message="Are you sure you want to remove this member from the project?"
                confirmText="Remove"
                cancelText="Cancel"
                type="danger"
            />
        </div >

    );
};

export default ManageMembersModal;