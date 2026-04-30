import { X, Check, MoreHorizontal, Plus, Loader2, ChevronDown, Paperclip, FileText, ImageIcon, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/Store";
import { useCreateIssue, useUpdateIssue, useAddAttachments } from "../../hooks/issue/issue";
import { CreateIssueModal } from "./CreateIssueModal";
import type { IssueFormData } from "./CreateIssueModal";
import { toast } from "sonner";

export interface Issue {
    id?: string;
    _id?: string;
    title: string;
    description?: string;
    issueType?: string;
    type?: string;
    status: string;
    projectId: string;
    parentId?: string;
    parentTitle?: string;
    startDate?: string;
    endDate?: string;
    tasks?: Issue[];
    projectName?: string;
    attachments?: any[];
}

interface IssueDetailProps {
    isOpen: boolean;
    onClose: () => void;
    issue: Issue | null;
    onIssueClick?: (issue: Issue) => void;
}

export default function IssueDetail({ isOpen, onClose, issue, onIssueClick }: IssueDetailProps) {
    // const [activeTab, setActiveTab] = useState("file");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { currentProject } = useSelector((state: RootState) => state.project);

    const { mutate: createIssue, isPending: isCreatingIssue } = useCreateIssue();
    const { mutate: updateMutation, isPending: isUpdating } = useUpdateIssue();

    // Local states for editing
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editEndDate, setEditEndDate] = useState("");

    // Attachment states
    const [attachmentTab, setAttachmentTab] = useState<'file' | 'image' | 'link'>('file');
    const [linkUrl, setLinkUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { mutate: addAttachments, isPending: isAddingAttachment } = useAddAttachments();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_FILE_SIZE) {
                toast.error("File size should not exceed 5MB");
                return;
            }

            if (attachmentTab === 'image' && !file.type.startsWith('image/')) {
                toast.error("Please select a valid image file");
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleAddAttachment = () => {
        if (attachmentTab === 'link') {
            if (!linkUrl.trim()) {
                toast.error("Please enter a link");
                return;
            }
            let formattedUrl = linkUrl.trim();
            if (!/^https?:\/\//i.test(formattedUrl)) {
                formattedUrl = 'https://' + formattedUrl;
            }

            try {
                new URL(formattedUrl);
            } catch (error: unknown) {
                toast.error("Please enter a valid URL");
                console.log(error)
                return;
            }

            addAttachments({
                issueId: issue?.id || issue?._id || "",
                files: [],
                link: [formattedUrl]
            }, {
                onSuccess: () => {
                    toast.success("Link added successfully");
                    setLinkUrl("");
                },
                onError: () => toast.error("Failed to add link")
            });

        } else {
            if (!selectedFile) {
                toast.error(`Please select ${attachmentTab === 'image' ? 'an image' : 'a file'} first`);
                return;
            }

            addAttachments({
                issueId: issue?.id || issue?._id || "",
                files: [selectedFile],
                link: []
            }, {
                onSuccess: () => {
                    toast.success("File added successfully");
                    setSelectedFile(null);
                },
                onError: () => toast.error("Failed to add file")
            });
        }
    };

    // Sync local state when issue changes
    useState(() => {
        if (issue) {
            setEditTitle(issue.title);
            setEditDescription(issue.description || "");
            setEditStartDate(issue.startDate ? new Date(issue.startDate).toISOString().split('T')[0] : "");
            setEditEndDate(issue.endDate ? new Date(issue.endDate).toISOString().split('T')[0] : "");
        }
    });

    // We also use useEffect to handle updates when the drawer is already open but issue changes (e.g. clicking child items)
    useEffect(() => {
        if (issue) {
            setEditTitle(issue.title);
            setEditDescription(issue.description || "");
            setEditStartDate(issue.startDate ? new Date(issue.startDate).toISOString().split('T')[0] : "");
            setEditEndDate(issue.endDate ? new Date(issue.endDate).toISOString().split('T')[0] : "");
        }
    }, [issue]);

    if (!isOpen || !issue) return null;

    const handleUpdate = () => {
        if (!editTitle.trim()) {
            toast.error("Issue title is required");
            return;
        }

        if (editStartDate && editEndDate && new Date(editEndDate) < new Date(editStartDate)) {
            toast.error("Due date cannot be earlier than start date");
            return;
        }

        const hasChanges =
            editTitle !== issue.title ||
            editDescription !== (issue.description || "") ||
            editStartDate !== (issue.startDate ? new Date(issue.startDate).toISOString().split('T')[0] : "") ||
            editEndDate !== (issue.endDate ? new Date(issue.endDate).toISOString().split('T')[0] : "");

        // if (!hasChanges) {
        //     toast.info("No changes detected");
        //     return;
        // }

        updateMutation({
            id: issue.id || (issue)._id || "",
            data: {
                title: editTitle,
                description: editDescription,
                startDate: editStartDate || null,
                endDate: editEndDate || null,
            }
        }, {
            onSuccess: () => {
                toast.success("Issue updated successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to update issue");
            }
        });
    };

    const handleCreateSubIssue = (data: IssueFormData) => {
        createIssue({
            title: data.title,
            description: data.description,
            status: data.status,
            issueType: data.issueType?.toUpperCase(),
            startDate: data.startDate,
            endDate: data.endDate,
            projectId: issue.projectId || currentProject?.id || "",
            workspaceId: currentProject?.workspaceId || "",
            assigneeId: data.assigneeId,
            parentId: data.parentId
        }, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
            }
        });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sliding Drawer Panel styled to perfectly match User Screenshot */}
            <div
                className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[800px] bg-[#0A0E17] border-l border-[#1E293B]/50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 text-zinc-300">

                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${(issue.type || issue.issueType || "").toUpperCase() === 'SUBTASK' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' :
                                (issue.type || issue.issueType || "").toUpperCase() === 'BUG' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                                    (issue.type || issue.issueType || "").toUpperCase() === 'TASK' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                        (issue.type || issue.issueType || "").toUpperCase() === 'STORY' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                }`}>
                                <span className="text-lg font-bold">
                                    {(issue.type || issue.issueType || (issue.projectName ? "E" : "T")).charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Issue title..."
                                className={`px-4 py-1.5 rounded-full bg-[#1A2542] text-blue-400 text-sm font-semibold border focus:outline-none min-w-[200px] transition-colors ${!editTitle.trim() ? 'border-red-500/50 hover:border-red-500' : 'border-[#23355B] focus:border-blue-500/50'
                                    }`}
                            />
                        </div>
                        {/* Keeping an X to close the drawer for UX */}
                        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Description Section */}
                    <div className="mb-10">
                        <h3 className="font-semibold text-white text-base mb-4">Description</h3>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Add a description..."
                            className="w-full bg-[#111827] rounded-2xl p-5 text-sm text-zinc-300 resize-none focus:outline-none border border-transparent focus:border-[#8B5CF6]/50 placeholder:text-zinc-600 min-h-[120px]"
                        />
                    </div>

                    {/* Child Work Items */}
                    {(issue.type || issue.issueType || "").toUpperCase() !== "SUBTASK" && (
                        <div className="mb-10">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-semibold text-white text-base">
                                    {(issue.type || issue.issueType || "").toUpperCase() === "EPIC" ? "Story" : "Subtasks"}
                                </h3>
                                {(issue.tasks && issue.tasks.length > 0) && (
                                    <span className="text-xs font-medium text-zinc-500 tracking-wide">
                                        {issue.tasks.filter((t: Issue) => t.status === "DONE").length}/{issue.tasks.length} completed
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                {issue.tasks && issue.tasks.map((task: Issue) => {
                                    const isCompleted = task.status === "DONE";
                                    return (
                                        <div
                                            key={task.id || task._id}
                                            onClick={() => onIssueClick && onIssueClick(task)}
                                            className="flex items-center gap-4 bg-[#111827] rounded-xl px-4 py-3.5 border border-transparent relative overflow-hidden group hover:border-[#1E293B] cursor-pointer"
                                        >
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 cursor-pointer transition-colors ${isCompleted ? 'bg-blue-500 hover:bg-blue-600 shadow-sm' : 'border border-zinc-600 hover:border-zinc-400'}`}
                                            >
                                                {isCompleted && <Check size={14} className="text-white" strokeWidth={3} />}
                                            </div>
                                            <span className={`flex-1 text-[13px] truncate transition-colors ${isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-300 group-hover:text-white'}`}>
                                                {task.title}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide shrink-0 border ${task.status === 'DONE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                task.status === 'IN_PROGRESS' || task.status === 'IN PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-zinc-800 text-zinc-400 border-zinc-700'
                                                }`}>
                                                {task.status?.replace('_', ' ').toUpperCase() || 'TODO'}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shrink-0 border ${(task.issueType || task.type || "").toUpperCase() === 'SUBTASK' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                (task.issueType || task.type || "").toUpperCase() === 'BUG' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    (task.issueType || task.type || "").toUpperCase() === 'TASK' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        (task.issueType || task.type || "").toUpperCase() === 'STORY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                {task.issueType || 'Task'}
                                            </span>
                                            <div className="w-7 h-7 rounded-full bg-[#1E293B] border border-zinc-700 flex items-center justify-center text-xs text-zinc-300 shrink-0">
                                                U
                                            </div>
                                            <button onClick={(e) => e.stopPropagation()} className="text-zinc-600 hover:text-zinc-300 transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="mt-5 px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl text-white font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/20 active:scale-95"
                            >
                                <Plus size={16} /> {(issue.type || issue.issueType || "").toUpperCase() === "EPIC" ? "Create story" : "Create subtask"}
                            </button>
                        </div>
                    )}

                    {/* Details & Timeline Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-10">
                        {/* Details Panel */}
                        <div className="bg-[#111827] rounded-2xl p-6">
                            <h4 className="text-xs font-bold text-zinc-300 mb-6 tracking-wide">Details</h4>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-[11px] font-medium text-zinc-500 block mb-2">Status</span>
                                    <div className="relative">
                                        <select
                                            value={issue?.status || "TODO"}
                                            onChange={(e) => {
                                                updateMutation({
                                                    id: issue.id || (issue)._id || "",
                                                    data: { status: e.target.value }
                                                }, {
                                                    onSuccess: () => {
                                                        toast.info(`Status updated`);
                                                    }
                                                });
                                            }}
                                            className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl pl-4 pr-10 py-2.5 text-[13px] font-semibold text-zinc-300 appearance-none focus:outline-none focus:border-[#8B5CF6] hover:border-[#334155] transition-colors cursor-pointer"
                                        >
                                            <option value="TODO">TODO</option>
                                            <option value="IN_PROGRESS">IN PROGRESS</option>
                                            <option value="DONE">DONE</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronDown size={16} className="text-zinc-600" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[11px] font-medium text-zinc-500 block mb-2">Assignee</span>
                                    <button className="w-full flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-[#1A2133] border border-zinc-700 font-medium text-xs flex items-center justify-center text-zinc-500">?</div>
                                            <span className="text-sm text-zinc-300 font-medium">Unassigned</span>
                                        </div>
                                        <ChevronDown size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                    </button>
                                </div>

                                <div>
                                    <span className="text-[11px] font-medium text-zinc-500 block mb-2">Parent</span>
                                    {issue?.parentTitle && issue?.parentId ? (
                                        <div
                                            onClick={() => onIssueClick && onIssueClick({ id: issue.parentId } as Issue)}
                                            className="bg-[#1A2542] border border-[#23355B] rounded-xl p-3 text-sm text-blue-400 font-semibold cursor-pointer hover:bg-[#1E2B4D] transition-colors truncate"
                                        >
                                            {issue.parentTitle}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-[#0A0E17] border border-[#1E293B] rounded-xl p-3 text-sm text-zinc-500 font-medium cursor-not-allowed">
                                                None
                                            </div>
                                            {(issue?.type || issue?.issueType || "").toUpperCase() === "EPIC" && (
                                                <span className="text-[10px] text-zinc-600 mt-2 block">Epic Type cannot have parent</span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Timeline Panel */}
                        <div className="bg-[#111827] rounded-2xl p-6">
                            <h4 className="text-xs font-bold text-zinc-300 mb-6 tracking-wide">Timeline</h4>

                            <div className="space-y-6">
                                <div>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={editStartDate}
                                            onChange={(e) => setEditStartDate(e.target.value)}
                                            className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl px-4 py-3 text-[13px] font-medium text-zinc-300 focus:outline-none focus:border-[#8B5CF6] hover:border-zinc-700 transition-colors [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={editEndDate}
                                            min={editStartDate}
                                            onChange={(e) => setEditEndDate(e.target.value)}
                                            className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl px-4 py-3 text-[13px] font-medium text-zinc-300 focus:outline-none focus:border-[#8B5CF6] hover:border-zinc-700 transition-colors [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attachments Section */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-white text-base mb-4">Attachments</h3>

                        {(!issue?.attachments || issue.attachments.length === 0) ? (
                            <div className="border border-dashed border-[#1E293B] bg-[#111827]/50 rounded-2xl py-10 flex flex-col items-center justify-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center">
                                    <Paperclip className="w-4 h-4 text-zinc-400" />
                                </div>
                                <span className="text-xs font-medium text-zinc-500">No attachments yet.</span>
                            </div>
                        ) : (
                            <div className="space-y-2 mb-4">
                                {issue.attachments.map((att, i: number) => (
                                    <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[#111827] border border-[#1E293B] rounded-xl group/item">
                                        {(att.type === 'image' || att.type === 'document' || att.type === 'file') ? <FileText className="w-4 h-4 text-blue-400" /> : <LinkIcon className="w-4 h-4 text-emerald-400" />}
                                        <a href={att.url || att.key} target="_blank" rel="noreferrer" className="flex-1 text-sm text-zinc-300 hover:text-white transition-colors truncate">
                                            {att.fileName || att.url || att.key}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-[#111827] rounded-2xl p-6 border border-transparent">
                            <div className="flex items-center gap-6 border-b border-[#1E293B] pb-3 mb-5">
                                <button
                                    onClick={() => setAttachmentTab("file")}
                                    className={`flex items-center gap-2 pb-3 -mb-[13px] text-xs font-bold transition-all border-b-2 ${attachmentTab === 'file' ? 'text-[#8B5CF6] border-[#8B5CF6]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                                >
                                    <FileText className="w-3.5 h-3.5" /> file
                                </button>
                                <button
                                    onClick={() => setAttachmentTab("image")}
                                    className={`flex items-center gap-2 pb-3 -mb-[13px] text-xs font-bold transition-all border-b-2 ${attachmentTab === 'image' ? 'text-[#8B5CF6] border-[#8B5CF6]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                                >
                                    <ImageIcon className="w-3.5 h-3.5" /> image
                                </button>
                                <button
                                    onClick={() => setAttachmentTab("link")}
                                    className={`flex items-center gap-2 pb-3 -mb-[13px] text-xs font-bold transition-all border-b-2 ${attachmentTab === 'link' ? 'text-[#8B5CF6] border-[#8B5CF6]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                                >
                                    <LinkIcon className="w-3.5 h-3.5" /> link
                                </button>
                            </div>

                            <div className="relative w-full mb-4">
                                <input
                                    type="text"
                                    className={`w-full h-11 bg-[#0A0E17] border border-[#1E293B] rounded-lg px-4 text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:border-[#8B5CF6] transition-colors ${attachmentTab !== 'link' ? 'cursor-pointer' : ''}`}
                                    placeholder={
                                        attachmentTab === 'link'
                                            ? "Paste a link here..."
                                            : `Click to select ${attachmentTab === 'image' ? 'an image' : 'a file'}...`
                                    }
                                    value={attachmentTab === 'link' ? linkUrl : (selectedFile?.name || '')}
                                    onChange={(e) => {
                                        if (attachmentTab === 'link') {
                                            setLinkUrl(e.target.value);
                                        }
                                    }}
                                    readOnly={attachmentTab !== 'link'}
                                />
                                {attachmentTab !== 'link' && (
                                    <input
                                        type="file"
                                        onChange={handleFileSelect}
                                        onClick={(e) => { (e.target as HTMLInputElement).value = '' }}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        accept={attachmentTab === 'image' ? "image/*" : "*"}
                                    />
                                )}
                            </div>

                            <button
                                onClick={handleAddAttachment}
                                disabled={isAddingAttachment}
                                className="w-full flex items-center justify-center py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[13px] font-bold rounded-xl transition-colors shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50"
                            >
                                {isAddingAttachment ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Attachment"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-[#0A0E17] border-t border-[#1E293B] flex flex-row items-center justify-end gap-6 shrink-0">
                    <button
                        onClick={onClose}
                        className="text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="px-6 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Update Issue
                    </button>
                </div>
            </div>

            {/* Create Nested Issue Modal */}
            <CreateIssueModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubIssue}
                isLoading={isCreatingIssue}
                parentIssueType={issue.type || issue.issueType}
                parentIssueId={issue.id || issue.id}
                projectName={issue.projectName}
            />
        </>
    );
}