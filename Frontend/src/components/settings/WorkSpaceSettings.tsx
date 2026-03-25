import { ChevronRight, Pencil, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUpdateWorkspace, useUploadWorkspaceLogo, useWorkspaceProfile } from "../../hooks/user/userHook";
import type { RootState } from "../../store/Store";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { queryClient } from "../../main";

export const WorkSpaceSettings = () => {
    const [open, setOpen] = useState(false);
    const { mutate: uploadLogo } = useUploadWorkspaceLogo()
    const { mutate: updateWorkspace } = useUpdateWorkspace();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const currentWorkspace = useSelector(
        (state: RootState) => state.workspace.currentWorkspace
    );
    const user = useSelector((state: RootState) => state.auth.user);
    const isOwner = currentWorkspace?.ownerId?.id === user?.id;

    const { data, isLoading } = useWorkspaceProfile(currentWorkspace?.id ?? "");

    const workspace = data?.data;
    const workspaceId = currentWorkspace?.id ?? "";
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        uploadLogo(
            {
                workspaceId,
                file,
            },
            {
                onSuccess: () => {
                    toast.success("Workspace logo updated");
                    queryClient.invalidateQueries({
                        queryKey: ["workspace-profile", workspaceId],
                    });
                },
                onError: () => {
                    toast.error("Upload failed");
                },
            }
        );
    };

    const handleSaveWorkspace = () => {
        updateWorkspace(
            {
                workspaceId,
                name,
                description,
            },
            {
                onSuccess: () => {
                    toast.success("Workspace updated");
                    setIsEditing(false);

                    queryClient.invalidateQueries({
                        queryKey: ["workspace-profile", workspaceId],
                    });
                },
                onError: () => {
                    toast.error("Update failed");
                },
            }
        );
    };


    useEffect(() => {
        if (workspace) {
            setName(workspace.name ?? "");
            setDescription(workspace.description ?? "");
        }
    }, [workspace]);



    return (
        <div className="space-y-4 pb-8">
            <h2 className="text-lg font-semibold text-slate-100">Settings</h2>

            <div className="bg-[#0F172A] rounded-xl border border-slate-800/50 overflow-hidden">

                {/* Header */}
                <div
                    onClick={() => setOpen(!open)}
                    className="p-4 flex items-center justify-between hover:bg-slate-800/30 cursor-pointer transition-colors group"
                >
                    <div className="flex items-center space-x-4">

                        <div className="h-10 w-10 rounded-lg bg-[#020617] border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400">
                            <Settings className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-medium text-slate-200">
                                Workspace Settings
                            </h3>

                            <p className="text-sm text-slate-500">
                                Name, Logo
                            </p>
                        </div>

                    </div>

                    <ChevronRight
                        className={`h-5 w-5 text-slate-600 transition-transform duration-300 ${open ? "rotate-90 text-slate-300" : ""
                            }`}
                    />
                </div>

                {/* Content */}
                <div
                    className={`transition-all duration-300 overflow-hidden ${open ? "max-h-96 p-6 bg-[#020617]" : "max-h-0"
                        }`}
                >
                    {isLoading ? (
                        <p className="text-slate-400">Loading workspace...</p>
                    ) : (
                        <div className="space-y-6">

                            {/* Logo */}
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full  border-4 border-[#131729] overflow-hidden bg-slate-700">
                                    {/* Placeholder for user image */}
                                    <img src={workspace?.logoUrl || "https://github.com/shadcn.png"} alt="Profile" className="h-full w-full object-cover" />
                                </div>
                                {isOwner && (
                                    <button
                                        onClick={handleClickUpload}
                                        className="absolute bottom-2 p-2 bg-[#626FF6] rounded-full hover:bg-[#626FF6] transition-colors border border-[#0F172A]"
                                    >
                                        <Pencil className="h-4 w-4 text-white cursor-pointer" />
                                    </button>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    hidden
                                />
                            </div>

                            {/* Name */}
                            <div className="space-y-4">

                                <div className="flex items-center justify-between">
                                    <p className="text-slate-300 font-medium">
                                        Workspace Details
                                    </p>

                                    {isOwner && !isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {/* Workspace Name */}
                                <div className="flex items-center gap-3">
                                    <p className="text-slate-400 text-sm font-medium w-36">
                                        Workspace Name :
                                    </p>

                                    {isEditing ? (
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-[#0F172A] border border-slate-700 rounded-md px-3 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        <p className="text-slate-100 text-sm">
                                            {workspace?.name}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="flex items-start gap-3">
                                    <p className="text-slate-400 text-sm font-medium w-36">
                                        Description :
                                    </p>

                                    {isEditing ? (
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={2}
                                            className="bg-[#0F172A] border border-slate-700 rounded-md px-3 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        <p className="text-slate-300 text-sm">
                                            {workspace?.description || "No description added"}
                                        </p>
                                    )}
                                </div>

                                {/* Buttons */}
                                {isEditing && (
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={handleSaveWorkspace}
                                            className="px-3 py-1 bg-[#626FF6] text-white rounded-md text-sm"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-3 py-1 border border-slate-700 rounded-md text-sm text-slate-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                            </div>


                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};