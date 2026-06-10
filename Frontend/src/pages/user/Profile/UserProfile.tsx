import {
    Building2,
    Crown,
    Users,
    Shield,
    User,
    Settings,
    ChevronRight,
    Pencil,
    Search,

} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import EditProfileModal from '../../../components/modal/EditProfileModal';
import ChangePasswordModal from '../../../components/modal/ChangePasswordModal';
import type { RootState } from '../../../store/Store';
import { useChangePassword, useGetProfile, useUpdateProfile, useUploadAvatar, useUserWorkspaces } from '../../../hooks/user/userHook';
import { useDebounce } from '../../../hooks/Admin/adminHook';
import { setAuthUser } from '../../../store/authSlice';
import { toast } from 'sonner';
import { queryClient } from '../../../main';
import RoleManagementModal from '../../../components/modal/RoleManagementModal';

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
    const [IsRoleandPreferences, setIsRoleandPreferences]=useState(false)
    const { mutate: updateProfile } = useUpdateProfile();
    const { mutate: changePassword } = useChangePassword();
    const dispatch = useDispatch()
    const { mutate: uploadAvatar } = useUploadAvatar();
    const { data: profileData } = useGetProfile();
    const workspace = useSelector((state:RootState)=>state.workspace.currentWorkspace)
    const [searchWorkspace, setSearchWorkspace] = useState('');
    const debouncedSearch = useDebounce(searchWorkspace, 500);
    const { data: workspacesData } = useUserWorkspaces(debouncedSearch);
    const workspaces = workspacesData?.data || [];
    const isOwner = workspace?.id===user?.id




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
        <div className="min-h-screen bg-[#0B1120] text-foreground p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="relative">
                    {/* Gradient Banner */}
                    <div className="h-32 rounded-t-2xl bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    </div>

                    {/* User Info Overlay */}
                    <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden bg-card">
                                {/* Placeholder for user image */}
                                <img src={user?.avatarUrl || "https://github.com/shadcn.png"} alt="Profile" className="h-full w-full object-cover" />
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors border-2 border-background shadow-lg shadow-primary/20">
                                <Pencil className="h-4 w-4 text-primary-foreground cursor-pointer" />
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
                            <h1 className="text-3xl font-bold text-foreground">{user?.firstName}</h1>
                            <p className="text-muted-foreground">{user?.email}</p>
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
                        <div key={index} className="card-hover bg-card p-6 rounded-xl border border-border flex items-center space-x-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <div className="text-muted-foreground text-sm">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                
                {/* Workspaces You're a Member Of */}
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-foreground">Workspaces You're a Member Of</h2>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search workspaces..."
                                value={searchWorkspace}
                                onChange={(e) => setSearchWorkspace(e.target.value)}
                                className="bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors w-64"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {workspaces.map((workspace, index) => (
                        <div key={workspace.id || index} className="card-hover bg-card p-4 rounded-xl border border-border flex items-center justify-between group transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{workspace.name}</h3>
                                    <p className="text-sm text-muted-foreground">{workspace.role === 'owner' || workspace.ownerId?.id === user?.id ? 'Workspace Owner' : 'Workspace Member'}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${workspace.role === 'owner' || workspace.ownerId?.id === user?.id
                                    ? 'bg-primary/10 text-primary border-primary/20'
                                    : 'bg-accent/10 text-accent border-accent/20'
                                }`}>
                                {workspace.role === 'owner' || workspace.ownerId?.id === user?.id ? 'Owner' : 'Member'}
                            </span>
                        </div>
                    ))}
                </div>
            </div> 

                {/* Account Settings */}
                <div className="space-y-4 pb-8">
                    <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>
                    <div className="bg-card rounded-xl border border-border divide-y divide-border overflow-hidden shadow-sm">
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
                                    }else if(item.label==='Role Preferences'){
                                        if(isOwner){
                                            toast.error("Only owner can manage roles")
                                            return
                                        }
                                        
                                       setIsRoleandPreferences(true)
                                    }
                                }}
                                className="p-4 flex items-center justify-between hover:bg-accent/5 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-foreground">{item.label}</h3>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
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
                <RoleManagementModal isOpen={IsRoleandPreferences} onClose={()=>setIsRoleandPreferences(false)}/>
                 
            </div>
        </div>
    );
};

export default UserProfile;
