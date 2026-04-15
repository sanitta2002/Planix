import { useState } from "react";
import { X, Loader2, FileText, Link as LinkIcon, Image as ImageIcon, User, ArrowLeft, ChevronDown, Check, Paperclip } from "lucide-react";
import { useSelector } from "react-redux";
// import { getAttachmentUploadUrl, uploadFileToS3 } from "../../Service/issue/issue";
import { IssueStatus } from "../../types/IssueType";
import type { IAttachement } from "../../types/IssueType";
import type { RootState } from "../../store/Store";
import { toast } from "sonner";

interface CreateEpicModalProps {
    isOpen: boolean;
    projectName: string;
    onClose: () => void;
    onSubmit: (data: EpicFormData) => void;
    isLoading: boolean;
    projectKey: string;
}

export interface EpicFormData {
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    attachments: IAttachement[];
    assigneeId?: string | null;
}


export const CreateEpicModal = ({ isOpen, projectName, onClose, onSubmit, isLoading, projectKey }: CreateEpicModalProps) => {
    const { user } = useSelector((state: RootState) => state.auth);
    // const currentProject = useSelector((state: RootState) => state.project.currentProject);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const status = IssueStatus.TODO;
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [assigneeId, setAssigneeId] = useState("");
    const [attachments, setAttachments] = useState<IAttachement[]>([]);

    // Attachments section state
    const [attachmentTab, setAttachmentTab] = useState<'file' | 'image' | 'link'>('file');
    const [linkUrl, setLinkUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleAddAttachment = () => {
        if (attachmentTab === 'link') {
            if (!linkUrl.trim()) return;
            let formattedUrl = linkUrl.trim();
            if (!/^https?:\/\//i.test(formattedUrl)) {
                formattedUrl = 'https://' + formattedUrl;
            }
            setAttachments(prev => [...prev, { type: 'link', url: formattedUrl, fileName: linkUrl }]);
            setLinkUrl("");
        } else {
            if (!selectedFile) return;
            setAttachments(prev => [...prev, { type: 'file', url: URL.createObjectURL(selectedFile), fileName: selectedFile.name }]);
            setSelectedFile(null);
        }
        toast.success("Attachment added");
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Epic name is required");
            return;
        }

        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            toast.error("End date cannot be earlier than start date");
            return;
        }
        await onSubmit({ title, description, status, startDate, endDate, attachments, assigneeId: assigneeId || null });
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setAssigneeId("");
        setAttachments([]);
        setLinkUrl("");
        setSelectedFile(null);
        onClose();
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setAssigneeId("");
        setAttachments([]);
        setLinkUrl("");
        setSelectedFile(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-[700px] bg-[#0A0E27] border border-[#1E293B] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">

                    {/* Header */}
                    <div className="flex items-center gap-4 px-8 pt-8 pb-4 shrink-0 border-b border-[#1E293B]">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-medium text-white">Create New Epic</h2>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6 custom-scrollbar">

                        {/* Project Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">
                                Project <span className="text-red-500">*</span>
                            </label>
                            <div className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200">
                                {projectName}
                            </div>
                        </div>

                        {/* Epic Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">
                                Epic Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g : Wishlist"
                                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#6366F1] transition-colors"
                                autoFocus
                            />
                        </div>

                        {/* Key Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">
                                Key
                            </label>
                            <div className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 opacity-60 cursor-not-allowed">
                                {projectKey}
                            </div>
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the goals and scope of this epic..."
                                rows={4}
                                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#6366F1] resize-none transition-colors"
                            />
                        </div>

                        {/* Status and Epic Color Row */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">Status</label>
                                <div className="relative opacity-60">
                                    <select
                                        value={status}
                                        disabled
                                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg pl-12 pr-4 py-3 text-sm text-slate-200 appearance-none cursor-not-allowed focus:outline-none"
                                    >
                                        <option value={IssueStatus.TODO}>TODO</option>
                                    </select>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-end justify-between gap-8">

                                {/* LEFT → Created By */}
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-300">Created By</label>

                                    <div className="flex items-center gap-3 bg-[#0F172A] border border-[#1E293B] px-3 py-2 rounded-lg">
                                        {user?.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                className="w-8 h-8 rounded-full border border-[#1E293B]"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                <User className="w-4 h-4 text-blue-400" />
                                            </div>
                                        )}

                                        <div className="flex flex-col">
                                            <span className="text-sm text-white">
                                                {user?.firstName} {user?.lastName}
                                            </span>
                                            <span className="text-xs text-zinc-500">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT → Epic Color */}
                                <div className="space-y-2 text-right">
                                    <label className="text-sm text-zinc-300">Epic Color</label>

                                    <div className="flex justify-end gap-1 pt-1">
                                        <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>





                        {/* Start Date and End Date Row */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">Start Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        placeholder="DD-MM-YYYY"
                                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#6366F1] transition-colors [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">End Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={endDate}
                                        min={startDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        placeholder="DD-MM-YYYY"
                                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#6366F1] transition-colors [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Attachments Section */}
                        <div className="space-y-6 pt-4">
                            <h3 className="text-base font-semibold text-white">Attachments</h3>

                            {attachments.length === 0 ? (
                                <div className="border border-dashed border-[#1E293B] rounded-2xl py-12 flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#0F172A] flex items-center justify-center">
                                        <Paperclip className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <span className="text-sm text-zinc-500">No attachments yet.</span>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {attachments.map((att, i) => (
                                        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl group/item">
                                            {att.type === 'file' ? <FileText className="w-4 h-4 text-blue-400" /> : <LinkIcon className="w-4 h-4 text-emerald-400" />}
                                            <span className="flex-1 text-sm text-zinc-300">{att.fileName || att.url}</span>
                                            <button type="button" onClick={() => removeAttachment(i)} className="opacity-0 group-hover/item:opacity-100 text-zinc-500 hover:text-red-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Attachment Tool */}
                            <div className="bg-[#0F172A] rounded-xl p-6 border border-[#1E293B] space-y-6">
                                <div className="flex items-center gap-6 border-b border-[#1E293B] pb-3">
                                    <button
                                        type="button"
                                        onClick={() => setAttachmentTab('file')}
                                        className={`flex items-center gap-2 pb-3 -mb-[13px] text-sm font-medium transition-colors border-b-2 ${attachmentTab === 'file' ? 'text-[#6366F1] border-[#6366F1]' : 'text-zinc-500 border-transparent hover:text-slate-300'}`}
                                    >
                                        <FileText className="w-4 h-4" /> file
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAttachmentTab('image')}
                                        className={`flex items-center gap-2 pb-3 -mb-[13px] text-sm font-medium transition-colors border-b-2 ${attachmentTab === 'image' ? 'text-[#6366F1] border-[#6366F1]' : 'text-zinc-500 border-transparent hover:text-slate-300'}`}
                                    >
                                        <ImageIcon className="w-4 h-4" /> image
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAttachmentTab('link')}
                                        className={`flex items-center gap-2 pb-3 -mb-[13px] text-sm font-medium transition-colors border-b-2 ${attachmentTab === 'link' ? 'text-[#6366F1] border-[#6366F1]' : 'text-zinc-500 border-transparent hover:text-slate-300'}`}
                                    >
                                        <LinkIcon className="w-4 h-4" /> link
                                    </button>
                                </div>

                                <div className="relative w-full h-[46px] bg-white rounded-md cursor-pointer overflow-hidden">
                                    <input
                                        type="text"
                                        className="w-full h-full bg-white px-3 text-black text-sm focus:outline-none"
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
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            accept={attachmentTab === 'image' ? "image/*" : "*"}
                                        />
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddAttachment}
                                    className="w-full py-3 bg-[#6366F1] hover:bg-[#5558DD] text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Add Attachment
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Footer / Actions */}
                    <div className="flex items-center justify-end gap-6 px-8 py-6 shrink-0 border-t border-[#1E293B] bg-[#0A0E27] mt-2 rounded-b-2xl">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#6366F1] hover:bg-[#5558DD] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : "Create Epic"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
