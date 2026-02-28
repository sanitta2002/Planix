import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCreatePlan, useUpdatePlan } from "../../../../hooks/Admin/adminHook";
import { planSchema } from "../../../../lib/validations/planValidation";

export interface PlanData {
    id?: string;
    name: string;
    price: number;
    features: string[];
    isActive?: boolean;
    maxMembers?: number;
    maxProjects?: number;
    storage?: number;
}

interface AddPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    editPlan?: PlanData | null;
}

const AddPlanModal: React.FC<AddPlanModalProps> = ({
    isOpen,
    onClose,
    editPlan,
}) => {
    const isEditMode = !!editPlan;

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        maxMembers: "",
        maxProjects: "",
        storage: "",
        features: "",
        isActive: false,
    });

    const createPlanMutation = useCreatePlan();
    const updatePlanMutation = useUpdatePlan();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const getFormData = (plan?: PlanData | null) => ({
        name: plan?.name ?? "",
        price: plan?.price?.toString() ?? "",
        maxMembers: plan?.maxMembers?.toString() ?? "",
        maxProjects: plan?.maxProjects?.toString() ?? "",
        storage: plan?.storage?.toString() ?? "",
        features: plan?.features?.join("\n") ?? "",
        isActive: plan?.isActive ?? false,
    });


    useEffect(() => {
        if (!isOpen) return;
        setFormData(getFormData(editPlan));

    }, [isOpen, editPlan]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            price: Number(formData.price),

            maxMembers: formData.maxMembers
                ? Number(formData.maxMembers)
                : undefined,

            maxProjects: formData.maxProjects
                ? Number(formData.maxProjects)
                : undefined,

            storage: formData.storage
                ? Number(formData.storage)
                : undefined,

            features: formData.features
                .split("\n")
                .map((f) => f.trim())
                .filter(Boolean),

            isActive: formData.isActive,


        };
        const result = planSchema.safeParse(payload);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((err) => {
                const field = String(err.path[0]);
                if (!fieldErrors[field]) {
                    fieldErrors[field] = err.message;
                }
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        console.log("EDIT PLAN:", editPlan);
        console.log("PLAN ID SENT:", editPlan?.id, editPlan?.id);
        if (isEditMode && editPlan.id) {
            updatePlanMutation.mutate(
                { planId: editPlan.id, data: payload },
                {
                    onSuccess: () => {
                        onClose();
                    },
                }
            );
        } else {
            createPlanMutation.mutate(payload, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="w-full max-w-2xl bg-[#0f1729] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <h2 className="text-lg font-bold text-white">
                        {isEditMode ? "Update Plan" : "Add New Plan"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
                    {/* Row 1: Plan Name & Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Plan Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Pro"
                                className="w-full px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700/60 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#626FF6] focus:ring-1 focus:ring-[#626FF6]/30 transition-colors"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Price Per Month
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="99"
                                className="w-full px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700/60 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#626FF6] focus:ring-1 focus:ring-[#626FF6]/30 transition-colors"
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>
                    </div>

                    {/* Row 2: Max Members, Max Projects, Storage */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Max Members
                            </label>
                            <input
                                type="number"
                                name="maxMembers"
                                value={formData.maxMembers}
                                onChange={handleChange}
                                placeholder="25"
                                className="w-full px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700/60 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#626FF6] focus:ring-1 focus:ring-[#626FF6]/30 transition-colors"
                            />
                            {errors.maxMembers && (
  <p className="text-red-500 text-xs mt-1">{errors.maxMembers}</p>
)}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Max Projects
                            </label>
                            <input
                                type="number"
                                name="maxProjects"
                                value={formData.maxProjects}
                                onChange={handleChange}
                                placeholder="50"
                                className="w-full px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700/60 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#626FF6] focus:ring-1 focus:ring-[#626FF6]/30 transition-colors"
                            />
                            {errors.maxProjects && (
  <p className="text-red-500 text-xs mt-1">{errors.maxProjects}</p>
)}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Storage (GB)
                            </label>
                            <input
                                type="number"
                                name="storage"
                                value={formData.storage}
                                onChange={handleChange}
                                placeholder="100"
                                className="w-full px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700/60 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#626FF6] focus:ring-1 focus:ring-[#626FF6]/30 transition-colors"
                            />
                            {errors.storage && (
  <p className="text-red-500 text-xs mt-1">{errors.storage}</p>
)}
                        </div>
                    </div>

                    {/* Features Textarea */}
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Features
                        </label>
                        <textarea
                            name="features"
                            value={formData.features}
                            onChange={handleChange}
                            placeholder="Enter features, one per line"
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg bg-[#0c1221] border border-gray-700/60 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#626FF6] focus:ring-1 focus:ring-[#626FF6]/30 transition-colors resize-none"
                        />
                        {errors.features && (
  <p className="text-red-500 text-xs mt-1">{errors.features}</p>
)}
                    </div>

                    {/* Checkbox */}
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-600 bg-[#0c1221] text-[#626FF6] focus:ring-[#626FF6]/30 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-slate-300">Plan is active</span>
                    </label>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 pt-2 pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-3 rounded-xl font-semibold text-sm border border-gray-700/60 text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#626FF6] to-[#818CF8] text-white hover:shadow-[0_4px_20px_rgba(98,111,246,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                        >
                            {isEditMode ? "Update Plan" : "Create Plan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlanModal;
