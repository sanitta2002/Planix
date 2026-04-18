import { useState, useEffect } from "react";
import {  Loader2, User, ArrowLeft, ChevronDown} from "lucide-react";
import { useSelector } from "react-redux";
import { IssueStatus, IssueType } from "../../types/IssueType";
import type { IAttachement } from "../../types/IssueType";
import type { RootState } from "../../store/Store";
import { toast } from "sonner";

interface CreateIssueModalProps {
    isOpen: boolean;
    projectName?: string;
    onClose: () => void;
    onSubmit: (data: IssueFormData) => void;
    isLoading: boolean;
    projectKey?: string;
    parentIssueType?: string;
    parentIssueId?: string;
}

export interface IssueFormData {
    title: string;
    description: string;
    status: string;
    issueType: string;
    parentId?: string;
    startDate: string;
    endDate: string;
    attachments: IAttachement[];
    assigneeId?: string | null;
}

export const CreateIssueModal = ({ 
    isOpen, 
    projectName, 
    onClose, 
    onSubmit, 
    isLoading,
    parentIssueType,
    parentIssueId
}: CreateIssueModalProps) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { currentProject } = useSelector((state: RootState) => state.project);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const status = IssueStatus.TODO;
    
    // Determine allowed issue types based on parent
    const getAvailableTypes = () => {
        if (!parentIssueType) return [IssueType.TASK, IssueType.BUG];
        if (parentIssueType.toUpperCase() === "EPIC") return [IssueType.STORY];
        if (parentIssueType.toUpperCase() === "STORY") return [IssueType.TASK, IssueType.BUG];
        return [IssueType.SUBTASK];
    };

    const availableTypes = getAvailableTypes();
    const [issueType, setIssueType] = useState(availableTypes[0]);
    
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [assigneeId, setAssigneeId] = useState("");
    const [attachments, setAttachments] = useState<IAttachement[]>([]);


    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            const types = getAvailableTypes();
            setIssueType(types[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, parentIssueType]);

    if (!isOpen) return null;



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Issue title is required");
            return;
        }

        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            toast.error("Due date cannot be earlier than start date");
            return;
        }
        await onSubmit({ 
            title, 
            description, 
            status, 
            issueType, 
            parentId: parentIssueId, 
            startDate, 
            endDate, 
            attachments, 
            assigneeId: assigneeId || null 
        });
        handleClose();
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setAssigneeId("");
        setAttachments([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                        <h2 className="text-lg font-medium text-white">Create New {availableTypes.length === 1 ? availableTypes[0].charAt(0) + availableTypes[0].slice(1).toLowerCase() : "Issue"}</h2>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6 custom-scrollbar">

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">
                                    Project
                                </label>
                                <div className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200">
                                    {projectName || currentProject?.projectName || "Loading..."}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">
                                    Issue Type <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-10">
                                        <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 ${
                                            issueType.toUpperCase() === 'SUBTASK' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                            issueType.toUpperCase() === 'BUG' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                                            issueType.toUpperCase() === 'TASK' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                            issueType.toUpperCase() === 'STORY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                            <span className="text-[10px] font-bold">
                                                {issueType.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <select
                                        value={issueType}
                                        onChange={(e) => setIssueType(e.target.value as "STORY" | "TASK" | "BUG" | "SUBTASK")}
                                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg pl-11 pr-10 py-3 text-sm text-slate-200 appearance-none focus:outline-none focus:border-[#6366F1] transition-colors"
                                    >
                                        {availableTypes.map((type) => (
                                            <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={`What needs to be done?`}
                                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#6366F1] transition-colors"
                                autoFocus
                            />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add context and details..."
                                rows={4}
                                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#6366F1] resize-none transition-colors"
                            />
                        </div>

                        {/* Status and Assignee */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">Status</label>
                                <div className="relative opacity-60">
                                    <select disabled className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 appearance-none cursor-not-allowed">
                                        <option value={IssueStatus.TODO}>TODO</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">Assignee</label>
                                <div className="relative">
                                    <select
                                        value={assigneeId}
                                        onChange={(e) => setAssigneeId(e.target.value)}
                                        className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg pl-4 pr-10 py-3 text-sm text-slate-200 appearance-none focus:outline-none focus:border-[#6366F1] transition-colors"
                                    >
                                        <option value="">Unassigned</option>
                                        {currentProject?.members?.map((member) => (
                                            <option key={member.user.id} value={member.user.id}>
                                                {member.user.firstName} ({member.role.name})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Start Date and End Date Row */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#6366F1] transition-colors [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">Due Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#6366F1] transition-colors [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {/* Created By Row */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">Created By</label>
                                <div className="flex items-center gap-3 bg-[#0F172A] border border-[#1E293B] px-3 py-2 rounded-lg h-[46px]">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} className="w-7 h-7 rounded-full border border-[#1E293B]" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <User className="w-3.5 h-3.5 text-blue-400" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-white">{user?.firstName}</span>
                                    </div>
                                </div>
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
                            ) : "Create"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
