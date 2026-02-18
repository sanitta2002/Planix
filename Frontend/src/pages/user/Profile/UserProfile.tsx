import {
    Building2,
    Crown,
    Users,
    // MoreVertical,
    // Search,
    // Filter,
    Shield,
    User,
    Settings,
    ChevronRight,
    Pencil,

} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import EditProfileModal from '../../../components/modal/EditProfileModal';
import ChangePasswordModal from '../../../components/modal/ChangePasswordModal';
import type { RootState } from '../../../store/Store';
import { useChangePassword, useGetProfile, useUpdateProfile, useUploadAvatar } from '../../../hooks/user/userHook';
import { setAuthUser } from '../../../store/authSlice';
import { toast } from 'sonner';
import { queryClient } from '../../../main';

type UserData = {
    firstName: string;
    lastName: string;
    phone: string;
}

type UserPass = {
    currentPassword: string;
    newPassword: string;
}

const UserProfile = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const { mutate: updateProfile } = useUpdateProfile();
    const { mutate: changePassword } = useChangePassword();
    const dispatch = useDispatch()
    const { mutate: uploadAvatar } = useUploadAvatar();
    const { data: profileData } = useGetProfile();




    const fileInputRef = useRef<HTMLInputElement | null>(null);



    const handleSaveProfile = (data: UserData): void => {
        updateProfile(data, {
            onSuccess: () => {
                dispatch(setAuthUser({ ...user!, ...data }))
                setIsEditProfileModalOpen(false)
                toast.success('profile updated successfully')
            },
            onError: () => {
                toast.error('failed to update profile')
            }
        })

    };

    const handleChangePassword = (data: UserPass) => {
        changePassword(data, {
            onSuccess: () => {
                toast.success("Password changed successfully")
                setIsChangePasswordModalOpen(false);
            },
            onError: () => {
                toast.error("Failed to change password")
            }
        })

    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        uploadAvatar(file, {
            onSuccess: () => {

                toast.success("Avatar updated successfully");
                queryClient.invalidateQueries({ queryKey: ["user-profile"] })
            },
            onError: () => {
                toast.error("Failed to upload avatar");
            }
        })

    }
    useEffect(() => {
        if (profileData && user?.id) {
            dispatch(
                setAuthUser({
                    ...user,
                    ...profileData.data,
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileData]);


    return (
        <div className="mi-h-screen  bg-[#0A0E27] text-slate-200 p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="relative">
                    {/* Gradient Banner */}
                    <div className="h-28 rounded-t-2xl bg-gradient-to-r from-[#7E3FF2] via-[#7542d4] opacity-90"></div>

                    {/* User Info Overlay */}
                    <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full border-4 border-[#131729] overflow-hidden bg-slate-700">
                                {/* Placeholder for user image */}
                                <img src={user?.avatarUrl || "https://github.com/shadcn.png"} alt="Profile" className="h-full w-full object-cover" />
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 p-2 bg-[#626FF6]  rounded-full hover:bg-[#626FF6] transition-colors border border-[#0F172A]">
                                <Pencil className="h-4 w-4 text-white cursor-pointer" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                hidden
                            />
                        </div>
                        <div className="mb-4">
                            <h1 className="text-3xl font-bold text-white">{user?.firstName}</h1>
                            <p className="text-slate-400">{user?.email}</p>
                            <div className="flex items-center mt-2 space-x-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-sm text-green-500 font-medium">Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Workspaces', value: '', icon: Building2 },
                        { label: 'Owned', value: '', icon: Crown },
                        { label: 'Member Of', value: '', icon: Users },
                    ].map((stat, index) => (
                        <div key={index} className="bg-[#131729] p-6 rounded-xl border border-slate-800/50 flex items-center space-x-4">
                            <div className="p-3 bg-slate-800/50 rounded-lg text-blue-400">
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-slate-400 text-sm">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Workspaces You Own */}
                {/* <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-100">Workspaces You Own</h2>
                <div className="bg-[#131729] rounded-xl border border-slate-800/50 p-6">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-bold text-white">MySpace</h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                                Active
                            </span>
                        </div>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div> */}

                {/* <p className="text-slate-500 text-xs mb-6 -mt-6">Created: Jan 15, 2024</p>

                    <div className="bg-[#1E293B]/50 rounded-lg p-6 border border-slate-700/30">
                        <h4 className="text-sm font-medium text-slate-300 mb-4">Plan Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Plan</div>
                                <div className="font-semibold text-white">Professional</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Renewal</div>
                                <div className="font-semibold text-white">Monthly</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Expires</div>
                                <div className="font-semibold text-white">Feb 15, 2025</div>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors">
                            Cancel Plan
                        </button>
                    </div>
                </div>
            </div> */}

                {/* Workspaces You're a Member Of */}
                {/* <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-100">Workspaces You're a Member Of</h2>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search workspaces..."
                                className="bg-[#0F172A] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors w-64"
                            />
                        </div>
                        <button className="p-2 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { name: 'Design Team', members: '24 members', role: 'Owner' },
                        { name: 'Marketing Hub', members: '8 members', role: 'Manager' },
                    ].map((workspace, index) => (
                        <div key={index} className="bg-[#0F172A] p-4 rounded-xl border border-slate-800/50 flex items-center justify-between group hover:border-slate-700 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">{workspace.name}</h3>
                                    <p className="text-sm text-slate-500">{workspace.members}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${workspace.role === 'Owner'
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                                }`}>
                                {workspace.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div> */}

                {/* Account Settings */}
                <div className="space-y-4 pb-8">
                    <h2 className="text-lg font-semibold text-slate-100">Account Settings</h2>
                    <div className="bg-[#0F172A] rounded-xl border border-slate-800/50 divide-y divide-slate-800/50 overflow-hidden">
                        {[
                            { icon: Shield, label: 'Security', desc: 'Change password' },
                            { icon: User, label: 'Edit Profile', desc: 'Name, email, phone number' },
                            { icon: Settings, label: 'Role Preferences', desc: 'Permissions and access control' },
                        ].map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    if (item.label === 'Edit Profile') {
                                        setIsEditProfileModalOpen(true);
                                    } else if (item.label === 'Security') {
                                        if (!user?.hasPassword) {
                                            toast.error("Google users cannot change password");
                                            return;
                                        }
                                        setIsChangePasswordModalOpen(true);
                                    }
                                }}
                                className="p-4 flex items-center justify-between hover:bg-slate-800/30 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-lg bg-[#020617] border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-200">{item.label}</h3>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-slate-300 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>


                <EditProfileModal
                    isOpen={isEditProfileModalOpen}
                    onClose={() => setIsEditProfileModalOpen(false)}
                    // user={user}
                    onSave={handleSaveProfile}
                />

                <ChangePasswordModal
                    isOpen={isChangePasswordModalOpen}
                    onClose={() => setIsChangePasswordModalOpen(false)}
                    onSave={handleChangePassword}
                />
            </div>
        </div>
    );
};

export default UserProfile;
