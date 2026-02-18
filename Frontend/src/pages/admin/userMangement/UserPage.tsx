
import { Search, Mail, Building2, } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useState } from 'react';
import { useBlockUser, useDebounce, useGetUsers, useUnblockUser } from '../../../hooks/Admin/adminHook';
import ConfirmationModal from '../../../components/modal/ConfirmationModal';

type UserStatusFilter = "all" | "active" | "blocked"

type AdminUser = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    isBlocked: boolean
    isEmailVerified?: boolean
    avatarUrl?: string
}


const UserPage = () => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 500)
    const [status, setStatus] = useState<UserStatusFilter>("all")
    const limit = 5
    const { data, isLoading } = useGetUsers({
        page,
        limit,
        search: debouncedSearch || undefined,
        isBlocked: status === "all" ? undefined : status === "blocked",
    })
    const users = data?.users ?? []
    const total = data?.total ?? 0

    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, total)
    const canGoPrev = page > 1
    const canGoNext = page * limit < total

    const { mutate: blockUserMutate, isPending: isBlocking } = useBlockUser();
    const { mutate: unblockUserMutate, isPending: isUnblocking } = useUnblockUser();

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'block' | 'unblock';
        user: AdminUser | null;
    }>({ isOpen: false, type: 'block', user: null });

    const onConfirmAction = () => {
        if (!modalConfig.user) return;
        if (modalConfig.type === 'block') {
            blockUserMutate({ userId: modalConfig.user.id });
        } else {
            unblockUserMutate({ userId: modalConfig.user.id });
        }
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    }
    return (

        <div className="flex flex-col h-fu text-gray-100 p-6 space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Manage Users</h1>
                <p className="text-gray-400 mt-1">Control user access and permissions</p>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between  p-4 rounded-xl border border-gray-800/50 shadow-sm">

                {/* Search */}
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2  -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    <Input onChange={(e) => { setPage(1); setSearch(e.target.value) }}
                        placeholder="Search users..."
                        className="pl-10 bg-[#0A0C10] border-gray-800 focus-visible:ring-blue-500/20 text-gray-200 placeholder:text-gray-600 h-10"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">

                    <select className="bg-[#0A0C10] text-sm text-gray-300 border border-gray-800 rounded-lg px-4 py-2 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 cursor-pointer hover:bg-[#1f222e] transition-colors">
                        <option>All Workspaces</option>
                        {/* <option>Acme Corp</option>
                        <option>TechStart</option> */}
                    </select>

                    <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value as UserStatusFilter) }} className="bg-[#0A0C10] text-sm text-gray-300 border border-gray-800 rounded-lg px-4 py-2 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 cursor-pointer hover:bg-[#1f222e] transition-colors">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-[#0f1729] rounded-xl border border-gray-800/50 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800/50 bg-[#0f1729]">
                                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Workspace</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-400">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-400">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user: AdminUser) => (
                                    <tr
                                        key={user.id}
                                        className="group hover:bg-[#142043] transition-colors"
                                    >
                                        {/* Name */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-10 rounded-full overflow-hidden bg-gray-700">
                                                    {user.avatarUrl ? (
                                                        <img
                                                            src={user.avatarUrl}
                                                            alt={user.firstName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-blue-600 to-purple-600">
                                                            {user.firstName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-200">
                                                    {user.firstName} {user.lastName}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="py-4 px-6 text-gray-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-gray-600" />
                                                {user.email}
                                            </div>
                                        </td>




                                        {/* Workspace (static for now) */}
                                        <td className="py-4 px-6 text-gray-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-3.5 h-3.5 text-gray-600" />
                                                Default
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-6">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${user.isBlocked
                                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${user.isBlocked ? "bg-red-500" : "bg-emerald-500"
                                                        }`}
                                                />
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </td>


                                        {/* Actions */}
                                        <td className="py-4 px-6 text-right">
                                            <Button
                                                onClick={() => setModalConfig({
                                                    isOpen: true,
                                                    type: user.isBlocked ? 'unblock' : 'block',
                                                    user
                                                })}
                                                variant="outline"
                                                className={`h-8 px-3 text-xs ${user.isBlocked
                                                    ? "text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10"
                                                    : "text-red-400 border-red-500/20 hover:bg-red-500/10"
                                                    }`}
                                            >
                                                {user.isBlocked ? "Activate" : "Deactivate"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Pagination (Visual only) */}
                <div className="border-t border-gray-800/50 p-4 flex items-center justify-between text-xs text-gray-500">
                    <span>
                        {total === 0
                            ? "Showing 0 users"
                            : `Showing ${start}-${end} of ${total} users`}
                    </span>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="h-8 px-3 text-xs bg-transparent border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            disabled={!canGoPrev}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            className="h-8 px-3 text-xs bg-transparent border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            disabled={!canGoNext}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>

            </div>

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={onConfirmAction}
                title={modalConfig.type === 'block' ? "Block User" : "Unblock User"}
                message={modalConfig.type === 'block'
                    ? `Are you sure you want to block ${modalConfig.user?.firstName} `
                    : `Are you sure you want to unblock ${modalConfig.user?.firstName} `
                }
                confirmText={modalConfig.type === 'block' ? "Block" : "Activate"}
                type={modalConfig.type === 'block' ? "danger" : "success"}
                isLoading={modalConfig.type === 'block' ? isBlocking : isUnblocking}
            />
        </div>
    );
};

export default UserPage;
