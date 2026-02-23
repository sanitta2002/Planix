import React, { useState } from "react";
import { ArrowRight, User, Building2 } from "lucide-react";

type WorkspaceType = "individual" | "company";

interface WorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: {
        name: string;
        description: string;
        type: WorkspaceType;
    }) => void;
}

const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [name, setName] = useState("MySpace");
    const [description, setDescription] = useState("");
    const [workspaceType, setWorkspaceType] =
        useState<WorkspaceType>("company");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.({ name, description, type: workspaceType });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-[#0c1225] border border-gray-800/60 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top accent bar */}
                <div className="flex flex-col items-center pt-8 pb-4">
                    {/* Green circle icon */}
                    <div className="w-14 h-14 rounded-full bg-[#00e676] shadow-[0_0_24px_rgba(0,230,118,0.35)] mb-5" />

                    {/* Title */}
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        Workspace Details
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Set up your workspace to get started
                    </p>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-gray-700/50" />

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-5">
                    {/* Workspace Name */}
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Workspace Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter workspace name"
                            className="w-full px-4 py-3 rounded-lg bg-[#111a30] border border-gray-700/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your workspace"
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg bg-[#111a30] border border-gray-700/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors resize-none"
                        />
                    </div>

                    {/* Workspace Type */}
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2.5">
                            Workspace Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Individual */}
                            <button
                                type="button"
                                onClick={() => setWorkspaceType("individual")}
                                className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${workspaceType === "individual"
                                        ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_16px_rgba(0,200,255,0.12)]"
                                        : "border-gray-700/50 bg-[#111a30] hover:border-gray-600"
                                    }`}
                            >
                                <User
                                    size={22}
                                    className={
                                        workspaceType === "individual"
                                            ? "text-cyan-400"
                                            : "text-slate-400"
                                    }
                                />
                                <span
                                    className={`text-sm font-medium ${workspaceType === "individual"
                                            ? "text-cyan-300"
                                            : "text-slate-400"
                                        }`}
                                >
                                    Individual
                                </span>
                            </button>

                            {/* Company */}
                            <button
                                type="button"
                                onClick={() => setWorkspaceType("company")}
                                className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${workspaceType === "company"
                                        ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_16px_rgba(0,200,255,0.12)]"
                                        : "border-gray-700/50 bg-[#111a30] hover:border-gray-600"
                                    }`}
                            >
                                <Building2
                                    size={22}
                                    className={
                                        workspaceType === "company"
                                            ? "text-cyan-400"
                                            : "text-slate-400"
                                    }
                                />
                                <span
                                    className={`text-sm font-medium ${workspaceType === "company"
                                            ? "text-cyan-300"
                                            : "text-slate-400"
                                        }`}
                                >
                                    Company
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Create Workspace Button */}
                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#00e676] to-[#00c853] text-[#0c1225] hover:shadow-[0_4px_24px_rgba(0,230,118,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                        Create Workspace
                        <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WorkspaceModal;
