import { X, Check, MoreHorizontal, Plus, Loader2, ChevronDown, Paperclip, FileText, ImageIcon, Link as LinkIcon, Trash2, Eye, ExternalLink, Download, Send, Smile, AtSign, MessageSquare, Reply, Pencil } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/Store";
import { useCreateIssue, useUpdateIssue, useAddAttachments, useDeleteAttachment } from "../../hooks/issue/issue";
import { useCreateComment, useGetComments, useDeleteComment, useUpdateComment } from "../../hooks/comment/commentHook";
import { useWorkspaceMembers } from "../../hooks/user/userHook";
import type { WorkspaceMember } from "../../types/workspaceMember";
import { CreateIssueModal } from "./CreateIssueModal";
import type { IssueFormData } from "./CreateIssueModal";
import type { Member } from "../../types/project";
import { toast } from "sonner";
import ConfirmationModal from "../modal/ConfirmationModal";
import { getAttachmentUrl } from "../../Service/issue/issue";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import type { CommentResponse } from "../../Service/comment/comment";

export interface Attachment {
    type: string;
    fileName?: string;
    url?: string;
    key: string;
}

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
    attachments?: Attachment[];
    assigneeId?: string;
}

interface EmojiData {
    native: string;
    [key: string]: unknown;
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
    const [deleteAttachmentKey, setDeleteAttachmentKey] = useState<string | null>(null);
    const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
    const [previewAttachment, setPreviewAttachment] = useState<{ url: string; fileName: string; type: string } | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    const { currentProject } = useSelector((state: RootState) => state.project);
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
    const currentUser = useSelector((state: RootState) => state.auth.user);

    // Fetch workspace members (which include signed avatarUrl) — same pattern as ManageMembersModal
    const { data: workspaceMembersData } = useWorkspaceMembers(currentWorkspace?.id || '');
    const workspaceMembers: WorkspaceMember[] = workspaceMembersData?.data?.members || workspaceMembersData?.data || [];

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
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const { mutate: addAttachments, isPending: isAddingAttachment } = useAddAttachments();
    const { mutate: deleteAttachmentMutation, isPending: isDeletingAttachment } = useDeleteAttachment();

    // Comment states
    const [commentText, setCommentText] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [showMentions, setShowMentions] = useState(false);
    const [mentionFilter, setMentionFilter] = useState("");
    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    const { mutate: submitComment, isPending: isSubmittingComment } = useCreateComment();
    const { data: comments, isLoading: isLoadingComments } = useGetComments(issue?.id || issue?._id || "");
    const { mutate: deleteCommentMutation, isPending: isDeletingComment } = useDeleteComment(issue?.id || issue?._id || "");
    const { mutate: updateCommentMutation, isPending: isUpdatingComment } = useUpdateComment(issue?.id || issue?._id || "");

    // Reply & Reaction states
    const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
    const [commentReactions, setCommentReactions] = useState<Record<string, Record<string, string[]>>>({});
    const [activeReactionPicker, setActiveReactionPicker] = useState<string | null>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    // Edit Comment State
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentText, setEditCommentText] = useState("");

    const REACTION_EMOJIS = ['👍', '❤️', '🔥', '😂', '😮', '😢'];

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setCommentText(value);

        // Simple mention detection
        const lastWord = value.split(' ').pop() || '';
        if (lastWord.startsWith('@')) {
            setShowMentions(true);
            setMentionFilter(lastWord.slice(1).toLowerCase());
            setShowEmojis(false); // Close emojis if typing mention
        } else {
            setShowMentions(false);
        }
    };

    const insertEmoji = (emojiData: EmojiData) => {
        setCommentText(prev => prev + emojiData.native);
        setShowEmojis(false);
        commentInputRef.current?.focus();
    };

    const insertMention = (name: string) => {
        const words = commentText.split(' ');
        words.pop(); // Remove the partial @mention
        const newText = [...words, `@${name} `].join(' ');
        setCommentText(newText);
        setShowMentions(false);
        commentInputRef.current?.focus();
    };

    const toggleReaction = (commentId: string, emoji: string) => {
        setCommentReactions(prev => {
            const commentReacts = { ...(prev[commentId] || {}) };
            const users = commentReacts[emoji] || [];
            if (users.includes('me')) {
                commentReacts[emoji] = users.filter(u => u !== 'me');
                if (commentReacts[emoji].length === 0) delete commentReacts[emoji];
            } else {
                commentReacts[emoji] = [...users, 'me'];
            }
            return { ...prev, [commentId]: commentReacts };
        });
        setActiveReactionPicker(null);
    };

    const handleDeleteComment = (commentId: string) => {
        setDeleteCommentId(commentId);
    };

    const confirmDeleteComment = () => {
        if (!deleteCommentId) return;
        deleteCommentMutation(deleteCommentId, {
            onSuccess: () => {
                toast.success("Comment deleted");
                setDeleteCommentId(null);
            },
            onError: () => {
                setDeleteCommentId(null);
            }
        });
    };

    const handleStartEditComment = (comment: CommentResponse) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.content);
    };

    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditCommentText("");
    };

    const handleUpdateComment = (commentId: string) => {
        if (!editCommentText.trim()) return;
        updateCommentMutation({ commentId, content: editCommentText }, {
            onSuccess: () => {
                toast.success("Comment updated");
                setEditingCommentId(null);
                setEditCommentText("");
            }
        });
    };

    const handleReply = (commentId: string, authorName: string) => {
        setReplyTo({ id: commentId, name: authorName });
        setCommentText(`@${authorName} `);
        commentInputRef.current?.focus();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            const newFiles: File[] = [];

            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];

                if (file.size > MAX_FILE_SIZE) {
                    toast.error(`"${file.name}" exceeds 5MB limit`);
                    continue;
                }

                if (attachmentTab === 'image' && !file.type.startsWith('image/')) {
                    toast.error(`"${file.name}" is not a valid image`);
                    continue;
                }

                newFiles.push(file);
            }

            if (newFiles.length > 0) {
                setSelectedFiles(prev => [...prev, ...newFiles]);
            }
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
            if (selectedFiles.length === 0) {
                toast.error(`Please select ${attachmentTab === 'image' ? 'an image' : 'a file'} first`);
                return;
            }

            addAttachments({
                issueId: issue?.id || issue?._id || "",
                files: selectedFiles,
                link: []
            }, {
                onSuccess: () => {
                    toast.success(`${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} added successfully`);
                    setSelectedFiles([]);
                },
                onError: () => toast.error("Failed to add files")
            });
        }
    };

    const handleDeleteAttachment = (attachmentKey: string) => {
        setDeleteAttachmentKey(attachmentKey);
    };

    const confirmDeleteAttachment = () => {
        if (!deleteAttachmentKey) return;
        deleteAttachmentMutation({
            issueId: issue?.id || issue?._id || "",
            attachmentKey: deleteAttachmentKey,
        }, {
            onSuccess: () => {
                toast.success("Attachment deleted successfully");
                setDeleteAttachmentKey(null);
            },
            onError: () => {
                toast.error("Failed to delete attachment");
                setDeleteAttachmentKey(null);
            }
        });
    };

    const handleViewAttachment = async (att: Attachment) => {
        // Links open directly in new tab
        if (att.type === 'link') {
            window.open(att.url || att.key, '_blank');
            return;
        }

        setIsLoadingPreview(true);
        try {
            const response = await getAttachmentUrl(
                issue?.id || issue?._id || "",
                att.key
            );
            const freshUrl = response?.data?.url;

            if (!freshUrl) {
                toast.error("Failed to load attachment");
                return;
            }

            // Images: show preview lightbox
            if (att.type === 'image') {
                setPreviewAttachment({
                    url: freshUrl,
                    fileName: att.fileName || att.key,
                    type: 'image',
                });
            } else {
                // Documents/files: open in new tab
                window.open(freshUrl, '_blank');
            }
        } catch {
            toast.error("Failed to load attachment");
        } finally {
            setIsLoadingPreview(false);
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

    // Auto-scroll to bottom when comments change
    useEffect(() => {
        if (comments && comments.length > 0) {
            commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [comments]);

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

    const handleCommentSubmit = () => {
        if (!commentText.trim()) return;
        submitComment({
            issueId: issue.id || (issue)._id || "",
            content: commentText.trim()
        }, {
            onSuccess: () => {
                toast.success("Comment added");
                setCommentText("");
                setReplyTo(null);
            },
            onError: () => toast.error("Failed to add comment")
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
                                    <div className="relative">
                                        <select
                                            value={issue?.assigneeId || ""}
                                            onChange={(e) => {
                                                const newAssigneeId = e.target.value;
                                                updateMutation({
                                                    id: issue.id || (issue)._id || "",
                                                    data: { assigneeId: newAssigneeId || null }
                                                }, {
                                                    onSuccess: () => {
                                                        toast.info(`Assignee updated`);
                                                    }
                                                });
                                            }}
                                            className="w-full bg-[#0A0E17] border border-[#1E293B] rounded-xl pl-12 pr-10 py-2.5 text-[13px] font-semibold text-zinc-300 appearance-none focus:outline-none focus:border-[#8B5CF6] hover:border-[#334155] transition-colors cursor-pointer"
                                        >
                                            <option value="">Unassigned</option>
                                            {currentProject?.members?.map((member: Member) => (
                                                <option key={member.user.id} value={member.user.id}>
                                                    {member.user.firstName}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                                            {issue?.assigneeId ? (
                                                (() => {
                                                    const assignedMember = currentProject?.members?.find((m: Member) => m.user.id === issue.assigneeId);
                                                    if (assignedMember?.user?.avatarUrl) {
                                                        return <img src={assignedMember.user.avatarUrl} alt="Assignee" className="w-6 h-6 rounded-full object-cover" />;
                                                    } else {
                                                        return <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[11px] flex items-center justify-center border border-blue-500/30">
                                                            {assignedMember ? assignedMember.user.firstName.charAt(0).toUpperCase() : '?'}
                                                        </div>;
                                                    }
                                                })()
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-[#1A2133] border border-zinc-700 font-medium text-[11px] flex items-center justify-center text-zinc-500">
                                                    ?
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronDown size={16} className="text-zinc-600" />
                                        </div>
                                    </div>
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
                                    <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[#111827] border border-[#1E293B] rounded-xl group/item hover:border-[#334155] transition-colors">
                                        {(att.type === 'image' || att.type === 'document' || att.type === 'file') ? <FileText className="w-4 h-4 text-blue-400" /> : <LinkIcon className="w-4 h-4 text-emerald-400" />}
                                        <button
                                            onClick={() => handleViewAttachment(att)}
                                            disabled={isLoadingPreview}
                                            className="flex-1 text-left text-sm text-zinc-300 hover:text-white transition-colors truncate disabled:opacity-50"
                                        >
                                            {att.fileName || att.url || att.key}
                                        </button>
                                        <button
                                            onClick={() => handleViewAttachment(att)}
                                            disabled={isLoadingPreview}
                                            title="View attachment"
                                            className="opacity-0 group-hover/item:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-50"
                                        >
                                            {att.type === 'link' ? <ExternalLink className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAttachment(att.key)}
                                            disabled={isDeletingAttachment}
                                            title="Delete attachment"
                                            className="opacity-0 group-hover/item:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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
                                    className={`w-full h-11 bg-[#0A0E17] border border-[#1E293B] rounded-lg px-4 ${attachmentTab !== 'link' && selectedFiles.length > 0 ? 'pr-10' : ''} text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:border-[#8B5CF6] transition-colors ${attachmentTab !== 'link' ? 'cursor-pointer' : ''}`}
                                    placeholder={
                                        attachmentTab === 'link'
                                            ? "Paste a link here..."
                                            : `Click to select ${attachmentTab === 'image' ? 'images' : 'files'}...`
                                    }
                                    value={attachmentTab === 'link' ? linkUrl : (selectedFiles.length > 0 ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected` : '')}
                                    onChange={(e) => {
                                        if (attachmentTab === 'link') {
                                            setLinkUrl(e.target.value);
                                        }
                                    }}
                                    readOnly={attachmentTab !== 'link'}
                                />
                                {attachmentTab !== 'link' && selectedFiles.length > 0 && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedFiles([]); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50 transition-colors"
                                        title="Clear selected files"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                                {attachmentTab !== 'link' && (
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        onClick={(e) => { (e.target as HTMLInputElement).value = '' }}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        accept={attachmentTab === 'image' ? "image/*" : "*"}
                                    />
                                )}
                            </div>

                            {/* Selected files preview */}
                            {attachmentTab !== 'link' && selectedFiles.length > 0 && (
                                <div className="mb-4 space-y-1.5 max-h-[120px] overflow-y-auto custom-scrollbar">
                                    {selectedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#0A0E17] border border-[#1E293B] rounded-lg group/file">
                                            {file.type.startsWith('image/') ? <ImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                                            <span className="flex-1 text-xs text-zinc-400 truncate">{file.name}</span>
                                            <span className="text-[10px] text-zinc-600 shrink-0">{(file.size / 1024).toFixed(0)}KB</span>
                                            <button
                                                onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                className="opacity-0 group-hover/file:opacity-100 p-0.5 text-zinc-600 hover:text-red-400 transition-all"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={handleAddAttachment}
                                disabled={isAddingAttachment}
                                className="w-full flex items-center justify-center py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[13px] font-bold rounded-xl transition-colors shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50"
                            >
                                {isAddingAttachment ? <Loader2 className="w-4 h-4 animate-spin" /> : `Add Attachment${attachmentTab !== 'link' && selectedFiles.length > 1 ? `s (${selectedFiles.length})` : ''}`}
                            </button>
                        </div>
                    </div>

                    {/* Comments Section — Contained Box */}
                    <div className="mb-4">
                        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '700px' }}>
                            {/* Box Header */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E293B] bg-[#0D1321]/80 shrink-0">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center">
                                        <MessageSquare className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                    </div>
                                    <h3 className="font-semibold text-white text-sm">Comments</h3>
                                    {comments && comments.length > 0 && (
                                        <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] text-[10px] font-bold">
                                            {comments.length}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Scrollable Comments Area */}
                            <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-4" style={{ maxHeight: '550px', minHeight: '200px' }}>

                                {/* Render Fetched Comments */}
                                {isLoadingComments ? (
                                    <div className="flex justify-center items-center py-10">
                                        <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin" />
                                    </div>
                                ) : comments && comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {comments.map((comment: CommentResponse) => {
                                            // Look up avatar from workspace members (has signed S3 URLs)
                                            const wsMember = workspaceMembers.find((m: WorkspaceMember) => m.id === comment.createdBy.id);
                                            const avatarUrl = wsMember?.avatarUrl || currentProject?.members?.find((m: Member) => m.user.id === comment.createdBy.id)?.user?.avatarUrl;
                                            const commentDate = new Date(comment.createdAt);
                                            const formattedDate = commentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' at ' + commentDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                                            const reactions = commentReactions[comment.id] || {};

                                            return (
                                                <div key={comment.id} className="group/comment animate-in fade-in slide-in-from-bottom-1 duration-200">
                                                    <div className="flex gap-3">
                                                        <div className="shrink-0 pt-0.5">
                                                            {avatarUrl ? (
                                                                <img src={avatarUrl} alt={comment.createdBy.name} className="w-8 h-8 rounded-full object-cover border-2 border-[#1E293B] shadow-sm" />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm flex items-center justify-center text-white font-bold text-[10px] border-2 border-[#1E293B]">
                                                                    {comment.createdBy.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[12px] font-bold text-zinc-200">{comment.createdBy.name}</span>
                                                                    <span className="text-[10px] text-zinc-500">{formattedDate}</span>
                                                                </div>
                                                                
                                                                {currentUser?.id === comment.createdBy.id && (
                                                                    <div className="flex items-center gap-1 opacity-0 group-hover/comment:opacity-100 transition-all duration-200">
                                                                        <button 
                                                                            onClick={() => handleStartEditComment(comment)}
                                                                            className="p-1 text-zinc-500 hover:text-blue-400"
                                                                            title="Edit comment"
                                                                        >
                                                                            <Pencil className="w-3 h-3" />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleDeleteComment(comment.id)}
                                                                            disabled={isDeletingComment}
                                                                            className="p-1 text-zinc-500 hover:text-red-400"
                                                                            title="Delete comment"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {editingCommentId === comment.id ? (
                                                                <div className="mt-2 space-y-2">
                                                                    <textarea
                                                                        value={editCommentText}
                                                                        onChange={(e) => setEditCommentText(e.target.value)}
                                                                        className="w-full bg-[#0A0E17] border border-[#8B5CF6]/30 rounded-xl px-3 py-2 text-[13px] text-zinc-200 focus:outline-none focus:border-[#8B5CF6] resize-none min-h-[60px]"
                                                                    />
                                                                    <div className="flex justify-end gap-2">
                                                                        <button 
                                                                            onClick={handleCancelEditComment}
                                                                            className="px-3 py-1 text-[11px] font-semibold text-zinc-400 hover:text-zinc-200"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleUpdateComment(comment.id)}
                                                                            disabled={isUpdatingComment || !editCommentText.trim()}
                                                                            className="px-3 py-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[11px] font-bold rounded-lg disabled:opacity-50"
                                                                        >
                                                                            {isUpdatingComment ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save Changes"}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-[#0A0E17]/60 border border-[#1E293B]/60 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-[13px] text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                                                                    {comment.content}
                                                                </div>
                                                            )}
                                                            {Object.keys(reactions).length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                                    {Object.entries(reactions).map(([emoji, users]) => (
                                                                        <button
                                                                            key={emoji}
                                                                            onClick={() => toggleReaction(comment.id, emoji)}
                                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${(users as string[]).includes('me')
                                                                                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#8B5CF6]'
                                                                                    : 'bg-[#1E293B]/50 border-[#1E293B] text-zinc-400 hover:border-zinc-500'
                                                                                }`}
                                                                        >
                                                                            <span>{emoji}</span>
                                                                            <span className="font-semibold text-[10px]">{(users as string[]).length}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover/comment:opacity-100 transition-opacity duration-150">
                                                                <button
                                                                    onClick={() => handleReply(comment.id, comment.createdBy.name)}
                                                                    className="flex items-center gap-1 px-2 py-1 text-[11px] text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                                >
                                                                    <Reply className="w-3 h-3" />
                                                                    Reply
                                                                </button>
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={() => setActiveReactionPicker(activeReactionPicker === comment.id ? null : comment.id)}
                                                                        className="flex items-center gap-1 px-2 py-1 text-[11px] text-zinc-500 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                                                                    >
                                                                        <Smile className="w-3 h-3" />
                                                                        React
                                                                    </button>
                                                                    {activeReactionPicker === comment.id && (
                                                                        <div className="absolute bottom-full left-0 mb-1 bg-[#1A2542] border border-[#23355B] rounded-xl shadow-2xl p-1.5 z-50 flex items-center gap-0.5">
                                                                            {REACTION_EMOJIS.map(emoji => (
                                                                                <button
                                                                                    key={emoji}
                                                                                    onClick={() => toggleReaction(comment.id, emoji)}
                                                                                    className="w-7 h-7 flex items-center justify-center hover:bg-[#2A3B66] rounded-lg transition-all hover:scale-125 text-sm"
                                                                                >
                                                                                    {emoji}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={commentsEndRef} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#1E293B]/80 flex items-center justify-center">
                                            <MessageSquare className="w-4 h-4 text-zinc-500" />
                                        </div>
                                        <p className="text-[13px] text-zinc-500">No comments yet. Start the conversation!</p>
                                    </div>
                                )}

                            </div>

                            {/* Pinned Comment Input — Bottom of Box */}
                            <div className="relative px-4 py-3 border-t border-[#1E293B] bg-[#0D1321]/80 shrink-0">
                                {/* Reply Indicator */}
                                {replyTo && (
                                    <div className="flex items-center gap-2 mb-2 px-1">
                                        <Reply className="w-3 h-3 text-[#8B5CF6]" />
                                        <span className="text-[11px] text-zinc-400">
                                            Replying to <span className="font-semibold text-[#8B5CF6]">{replyTo.name}</span>
                                        </span>
                                        <button
                                            onClick={() => { setReplyTo(null); setCommentText(""); }}
                                            className="ml-auto p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}

                                {/* Emoji Picker (emoji-mart) */}
                                {showEmojis && (
                                    <div className="absolute bottom-full right-0 mb-2 z-50">
                                        <Picker
                                            data={data}
                                            onEmojiSelect={insertEmoji}
                                            theme="dark"
                                            previewPosition="none"
                                            skinTonePosition="search"
                                            maxFrequentRows={2}
                                            perLine={8}
                                            emojiSize={22}
                                            emojiButtonSize={32}
                                            set="native"
                                        />
                                    </div>
                                )}

                                {/* Mentions Popover */}
                                {showMentions && (
                                    <div className="absolute bottom-full left-12 mb-2 bg-[#1A2542] border border-[#23355B] rounded-xl shadow-xl p-1 z-50 max-h-48 overflow-y-auto w-64">
                                        {currentProject?.members?.filter((m: Member) =>
                                            m.user.firstName.toLowerCase().includes(mentionFilter)
                                        ).length === 0 ? (
                                            <div className="p-3 text-xs text-zinc-500 text-center">No members found</div>
                                        ) : (
                                            currentProject?.members?.filter((m: Member) =>
                                                m.user.firstName.toLowerCase().includes(mentionFilter)
                                            ).map((member: Member) => (
                                                <button
                                                    key={member.user.id}
                                                    onClick={() => insertMention(member.user.firstName)}
                                                    className="w-full text-left px-3 py-2 text-[13px] text-zinc-300 hover:bg-[#2A3B66] hover:text-white rounded-lg transition-colors flex items-center gap-2"
                                                >
                                                    {member.user.avatarUrl ? (
                                                        <img src={member.user.avatarUrl} alt="avatar" className="w-5 h-5 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[9px] flex items-center justify-center">
                                                            {member.user.firstName.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    {member.user.firstName}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Input Row */}
                                <div className="flex items-center gap-2.5 bg-[#0A0E17] border border-[#1E293B] rounded-xl pl-2 pr-1.5 py-1.5 focus-within:border-[#8B5CF6]/50 focus-within:ring-1 focus-within:ring-[#8B5CF6]/20 transition-all">
                                    <div className="shrink-0">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm flex items-center justify-center text-white font-bold text-[9px] border border-[#1E293B]">
                                            ME
                                        </div>
                                    </div>
                                    <textarea
                                        ref={commentInputRef}
                                        value={commentText}
                                        onChange={handleCommentChange}
                                        placeholder="Write a comment..."
                                        className="flex-1 bg-transparent text-[13px] text-zinc-200 placeholder:text-zinc-500 resize-none focus:outline-none min-h-[20px] max-h-[80px] leading-relaxed py-1"
                                        rows={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleCommentSubmit();
                                            }
                                        }}
                                    />
                                    <div className="flex items-center gap-0.5 shrink-0 text-zinc-400">
                                        <button
                                            onClick={() => {
                                                setShowMentions(!showMentions);
                                                setShowEmojis(false);
                                                if (!showMentions) setMentionFilter("");
                                            }}
                                            className="p-1.5 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                            title="Mention someone"
                                        >
                                            <AtSign className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowEmojis(!showEmojis);
                                                setShowMentions(false);
                                            }}
                                            className="p-1.5 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                                            title="Add emoji"
                                        >
                                            <Smile className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={handleCommentSubmit}
                                            disabled={isSubmittingComment || !commentText.trim()}
                                            className={`ml-0.5 p-1.5 rounded-lg flex items-center justify-center transition-all ${commentText.trim()
                                                    ? 'text-[#8B5CF6] hover:bg-[#8B5CF6]/10 cursor-pointer'
                                                    : 'text-zinc-600 opacity-50 cursor-not-allowed'
                                                }`}
                                        >
                                            {isSubmittingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
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

            {/* Delete Attachment Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteAttachmentKey !== null}
                onClose={() => setDeleteAttachmentKey(null)}
                onConfirm={confirmDeleteAttachment}
                title="Delete Attachment"
                message="Are you sure you want to delete this attachment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeletingAttachment}
            />

            {/* Delete Comment Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteCommentId !== null}
                onClose={() => setDeleteCommentId(null)}
                onConfirm={confirmDeleteComment}
                title="Delete Comment"
                message="Are you sure you want to delete this comment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeletingComment}
            />

            {/* Attachment Preview Lightbox */}
            {previewAttachment && (
                <div
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md"
                    onClick={() => setPreviewAttachment(null)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        {/* Header bar */}
                        <div className="w-full flex items-center justify-between px-4 py-3 bg-[#0A0E17]/90 rounded-t-xl border border-[#1E293B] border-b-0">
                            <span className="text-sm text-zinc-300 font-medium truncate max-w-[60%]">
                                {previewAttachment.fileName}
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={previewAttachment.url}
                                    download={previewAttachment.fileName}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1E293B] transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                                <a
                                    href={previewAttachment.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1E293B] transition-colors"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <button
                                    onClick={() => setPreviewAttachment(null)}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1E293B] transition-colors"
                                    title="Close"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {/* Image */}
                        <div className="bg-[#0A0E17]/90 rounded-b-xl border border-[#1E293B] border-t-0 p-4 flex items-center justify-center overflow-auto">
                            <img
                                src={previewAttachment.url}
                                alt={previewAttachment.fileName}
                                className="max-w-full max-h-[75vh] object-contain rounded-lg"
                                onError={() => {
                                    toast.error("Failed to load image");
                                    setPreviewAttachment(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Loading overlay for attachment preview */}
            {isLoadingPreview && (
                <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
                        <span className="text-sm text-zinc-400">Loading attachment...</span>
                    </div>
                </div>
            )}
        </>
    );
}