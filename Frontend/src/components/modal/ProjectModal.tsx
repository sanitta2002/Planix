import { X, Folder, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateProject } from "../../hooks/project/projectHook";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/Store";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type { WorkspaceMember } from "../../types/workspaceMember";
import type { Role } from "../../types/role";
import type { ProjectMember } from "../../types/ProjectMember";
import { useGetRoles, useWorkspaceMembers } from "../../hooks/user/userHook";



interface ProjectModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const ProjectModal = ({ isOpen, onClose }: ProjectModalProps) => {
    const [projectName, setProjectName] = useState('');
    const [projectKey, setProjectKey] = useState('');
    const [description, setDescription] = useState('');

    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace)
    const createProjectMutation = useCreateProject();
    const workspaceId = currentWorkspace?.id

    const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [members, setMembers] = useState<ProjectMember[]>([]);

    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const { data: roleData } = useGetRoles();
    const { data: WorkspaceMembers } = useWorkspaceMembers(currentWorkspace?.id || '')

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
        if (!projectName) return;

        const words = projectName.trim().split(" ").filter(Boolean);
        let key = "";

        if (words.length === 1) {
            key = words[0].slice(0, 3);
        } else {
            key = words[0][0] + words[1].slice(0, 2);
        }

        setProjectKey(key.toUpperCase());
    }, [projectName]);

    const handleCreateProject = () => {
        if (!projectName.trim()) {
            toast.error("Project name is required");
            return;
        }

        if (!projectKey.trim()) {
            toast.error("Project key is required");
            return;
        }

        if (!workspaceId) {
            toast.error("Workspace not found");
            return;
        }

        createProjectMutation.mutate(
            {
                projectName,
                key: projectKey,
                description,
                workspaceId,
                members

            },
            {
                onSuccess: () => {
                    toast.success("Project created successfully");
                    onClose?.();
                    setProjectName("");
                    setProjectKey("");
                    setDescription("");
                },
                onError: (error) => {
                    if (error instanceof AxiosError) {
                        toast.error(error.response?.data.message)
                    }
                },
            }
        );
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <div
                className="w-full max-w-2xl bg-[#0A0E27]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20">
                            <Folder className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Create Project</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-5 bg-[#5558dd] rounded-full" />
                                Project Details
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {/* Project Name */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                                    Project Name <span className="text-blue-500">*</span>
                                </h3>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) =>
                                        setProjectName(e.target.value)
                                    }
                                    placeholder="Try a project name"
                                    className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-slate-200 mb-2 focus:outline-none focus:border-[#5558dd] transition-colors"
                                />
                            </div>

                            {/* Key */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                                    Key <span className="text-blue-500">*</span>
                                </h3>
                                <input
                                    type="text"
                                    value={projectKey}
                                    onChange={(e) =>
                                        setProjectKey(e.target.value.toUpperCase())
                                    }
                                    placeholder="PRJ"
                                    className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-slate-200 mb-2 focus:outline-none focus:border-[#5558dd] transition-colors uppercase"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                                    Description <span className="text-blue-500">*</span>
                                </h3>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Try a project goal, team name, milestone..."
                                    className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#5558dd] transition-colors resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-5 bg-[#5558dd] rounded-full" />
                                Team Members
                            </h3>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 mb-3 block">
                                Add Members <span className="text-blue-500">*</span>
                            </h3>

                            {/* Input */}
                            <div className="flex items-center gap-3 mb-6">
                                {/* User Dropdown */}
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="flex-1 bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white"
                                >
                                    <option value="">Select Member</option>
                                    {workspaceMembers .filter(member => member.id !== currentWorkspace?.ownerId?.id).map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.firstName}
                                        </option>
                                    ))}
                                </select>

                                {/* Role Dropdown */}
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="flex-1 bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white"
                                >
                                    <option value="">Select Role</option>
                                    {roles?.map((role) => (
                                        <option key={role._id} value={role._id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>

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
                                    className="px-4 py-3 bg-[#6366F1] text-white rounded-xl"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Member List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {members.map((m, index) => {
                                    console.log("membersssss ", members)
                                    const user = workspaceMembers.find(u => u.id === m.userId);
                                    const role = roles.find(r => r._id === m.roleId);

                                    return (
                                        <div
                                            key={index}
                                            className="group relative bg-[#0f172a] border border-white/5 rounded-2xl p-4 flex items-center justify-between"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                {/* LEFT SIDE (User) */}
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#6366F1] flex items-center justify-center text-xs font-bold text-white">
                                                        {user?.avatarUrl ? (
                                                            <img
                                                                src={user.avatarUrl}
                                                                alt={user.firstName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            `${user?.firstName?.[0] ?? ''}}`
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-bold text-white">
                                                            {user
                                                                ? `${user.firstName} `
                                                                : "User not found"}
                                                        </p>
                                                        <p className="text-[11px] text-zinc-400">{user?.email}</p>
                                                    </div>
                                                </div>

                                                {/* RIGHT SIDE (Role) */}
                                                <div>
                                                    <p className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                                        {role?.name || "No role"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Remove button */}
                                            <button
                                                onClick={() =>
                                                    setMembers(prev =>
                                                        prev.filter((_, i) => i !== index)
                                                    )
                                                }
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-[#1E293B]">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-400 hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreateProject}
                        disabled={createProjectMutation.isPending}
                        className="px-6 py-2.5 bg-[#6366F1] hover:bg-[#5558DD] text-white rounded-lg disabled:opacity-50"
                    >
                        {createProjectMutation.isPending
                            ? "Creating..."
                            : "Create Project"}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default ProjectModal;