import React, { useState } from 'react';
import { X, Shield, Check, Edit2, Trash2, Save } from 'lucide-react';
import { useCreateRole, useDeleteRole, useGetRoles, useUpdateRole } from '../../hooks/user/userHook';
import { toast } from 'sonner';
import ConfirmationModal from './ConfirmationModal';


const AVAILABLE_PERMISSIONS = [
    { key: "CREATE_EPIC", label: "Create Epic" },
    { key: "COMPLETE_SPRINT", label: "Complete Sprint" },
    { key: "CREATE_SPRINT", label: "Create Sprint" },
    { key: "ASSIGN_TASK", label: "Assign Task" },
    { key: "CREATE_TASK", label: "Create Task" },
    { key: "UPDATE_TASK", label: "Update Task" },
    { key: "DELETE_TASK", label: "Delete Task" },
    { key: "INVITE_MEMBER", label: "Invite Member" },
    { key: "REMOVE_MEMBER", label: "Remove Member" }
];


interface RoleManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}
interface IRole {
    _id: string;
    name: string;
    permissions: string[];
}

const RoleManagementModal: React.FC<RoleManagementModalProps> = ({
    isOpen,
    onClose,
}) => {
    const createRoleMutation = useCreateRole()
    const { data: rolesData, isLoading: isRolesLoading, refetch } = useGetRoles()
    const updateRoleMutation = useUpdateRole();
    const deleteRoleMutation = useDeleteRole();



    const [newRoleName, setnewRoleName] = useState('');
    const [newRolePermissions, setnewRolePermissions] = useState<string[]>([]);
    const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
    const [editRoleName, setEditRoleName] = useState('');
    const [editRolePermissions, setEditRolePermissions] = useState<string[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<IRole | null>(null);

    if (!isOpen) return null;

    const handleCreateRole = () => {
        if (!newRoleName.trim()) {
            toast.error("Role name cannot be empty")
        }
        if (newRolePermissions.length === 0) {
            toast.error("Please select at least one permission");
            return;
        }
        createRoleMutation.mutate({
            name: newRoleName,
            permissions: newRolePermissions
        }, {
            onSuccess: () => {
                toast.success("Role created successfully")
                setnewRoleName('');
                setnewRolePermissions([]);
            },
            onError: () => {
               
            }
        })
    }

    const handleStartEdit = (role: IRole) => {
        setEditingRoleId(role._id);
        setEditRoleName(role.name);
        setEditRolePermissions(role.permissions);
    }
    const handleSaveEdit = (roleId: string) => {
        if (!editRoleName.trim()) {
            toast.error("Role name cannot be empty");
            return;
        }
        if (editRolePermissions.length === 0) {
            toast.error("Please select at least one permission");
            return;
        }

        updateRoleMutation.mutate({
            roleId,
            name: editRoleName,
            permissions: editRolePermissions
        }, {
            onSuccess: () => {
                toast.success("Role updated successfully");
                setEditingRoleId(null);
                refetch();
            },
            onError: () => {
                toast.error("Failed to update role");
            }
        });
    };

    const handleDeleteClick = (role: IRole) => {
        setRoleToDelete(role);
        setIsDeleteDialogOpen(true);
    }
    const handleConfirmDelete = () => {
        if (!roleToDelete) return;
        console.log("bvsjadbvkasb", roleToDelete._id)
        deleteRoleMutation.mutate(roleToDelete._id, {
            onSuccess: () => {
                toast.success("Role deleted successfully");
                setIsDeleteDialogOpen(false);
                setRoleToDelete(null);
                refetch();
            },
            onError: () => {

                toast.error("Failed to delete role");
            }
        });
    };


    const togglePermission = (permissions: string[], setPermissions: (p: string[]) => void, key: string) => {
        if (permissions.includes(key)) {
            setPermissions(permissions.filter(p => p !== key));
        } else {
            setPermissions([...permissions, key]);
        }
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="w-full max-w-2xl bg-[#0A0E27] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            Manage Roles & Permissions
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>


                {/* BODY */}
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">

                    {/* Existing Roles */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-5 bg-[#5558dd] rounded-full" />
                                Existing Roles
                            </h3>

                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 py-0.5 bg-[#0f172a] rounded-full border border-white/5">
                                {rolesData?.data?.length || 0} Total
                            </span>
                        </div>

                        {isRolesLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5558dd]" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rolesData?.data?.map((role: IRole) => (
                                    <div
                                        key={role._id}
                                        className="group relative bg-[#0f172a] border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-[#0d1016] flex flex-col min-h-[180px]"
                                    >

                                        {/* Action Buttons */}
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {editingRoleId === role._id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveEdit(role._id)}
                                                        className="p-1.5 rounded-md bg-[#5558dd] text-white hover:bg-[#5558dd]"
                                                    >
                                                        <Save className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        onClick={() => setEditingRoleId(null)}
                                                        className="p-1.5 rounded-md bg-white/10 text-zinc-400 hover:text-white"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleStartEdit(role)}
                                                        className="p-1.5 rounded-md bg-white/5 text-zinc-400 hover:text-[#5558dd]"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteClick(role)}
                                                        className="p-1.5 rounded-md bg-white/5 text-zinc-400 hover:text-red-400"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        <div className="space-y-4  flex-5">
                                            {editingRoleId === role._id ? (
                                                <input
                                                    type="text"
                                                    value={editRoleName}
                                                    onChange={(e) => setEditRoleName(e.target.value)}
                                                    className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 w-36 text-sm text-white font-bold"
                                                />
                                            ) : (
                                                <h4 className="text-base font-bold text-white uppercase">
                                                    {role.name}
                                                </h4>
                                            )}

                                            <ul className="space-y-2.5">
                                                {AVAILABLE_PERMISSIONS.map((perm) => {
                                                    const isSelected = editingRoleId === role._id
                                                        ? editRolePermissions.includes(perm.key)
                                                        : role.permissions.includes(perm.key);

                                                    if (editingRoleId !== role._id && !isSelected) return null;

                                                    return (
                                                        <li
                                                            key={perm.key}
                                                            className="flex items-center gap-2 group/item"
                                                        >
                                                            {editingRoleId === role._id ? (
                                                                <button
                                                                    onClick={() => togglePermission(editRolePermissions, setEditRolePermissions, perm.key)}
                                                                    className={`flex items-center gap-2 w-full text-left transition-all ${isSelected ? 'text-[#5558dd]' : 'text-white'}`}
                                                                >
                                                                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${isSelected ? 'bg-blue-[#5558dd] shadow-[0_0_6px_rgba(59,130,246,0.6)]' : 'bg-zinc-800'}`} />
                                                                    <span className="text-[11px] font-medium tracking-wide">{perm.label}</span>
                                                                </button>
                                                            ) : (
                                                                <>
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#5558dd] shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                                                                    <span className="text-[11px] font-medium text-zinc-400 tracking-wide">{perm.label}</span>
                                                                </>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* CREATE ROLE */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-300 mb-3">
                            Create a New Role
                        </h3>

                        <input
                            type="text"
                            value={newRoleName}
                            onChange={(e) => setnewRoleName(e.target.value)}
                            placeholder="Enter Role Name"
                            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-slate-200 mb-4"
                        />

                        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {AVAILABLE_PERMISSIONS.map((perm) => (
                                    <button
                                        key={perm.key}
                                        onClick={() => togglePermission(newRolePermissions, setnewRolePermissions, perm.key)}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all
                                    ${newRolePermissions.includes(perm.key)
                                                ? 'bg-blue-500/10 border-[#5558dd] text-[#5558dd]'
                                                : 'bg-[#0a0e27] border-white/5 text-zinc-500'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center
                                    ${newRolePermissions.includes(perm.key)
                                                ? 'bg-[#5558dd] border-[#5558dd]'
                                                : 'border-white/10'
                                            }`}>
                                            {newRolePermissions.includes(perm.key) &&
                                                <Check className="w-3 h-3 text-zinc-950" />
                                            }
                                        </div>

                                        <span className="text-[11px] font-bold uppercase text-white">
                                            {perm.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>


                {/* FOOTER */}
                <div className="flex justify-end gap-3 p-6 border-t border-[#1E293B]">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-400 hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreateRole}
                        className="px-6 py-2.5 bg-[#6366F1] hover:bg-[#5558DD] text-white rounded-lg"
                    >
                        Add Role
                    </button>
                </div>

            </div>
            <ConfirmationModal
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Role"
                message={`Are you sure you want to delete "${roleToDelete?.name}" role?`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={deleteRoleMutation.isPending}
            />
        </div>
    );
};

export default RoleManagementModal;
