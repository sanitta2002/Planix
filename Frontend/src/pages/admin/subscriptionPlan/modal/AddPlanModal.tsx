import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCreatePlan, useUpdatePlan } from "../../../../hooks/Admin/adminHook";
import { planSchema } from "../../../../lib/validations/planValidation";

export interface PlanData {
  id?: string;
  name: string;
  price: number;
  durationDays: number; 
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
    durationDays: "", // ✅ added
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
    durationDays: plan?.durationDays?.toString() ?? "",
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
      durationDays: Number(formData.durationDays), // ✅ added

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

    if (isEditMode && editPlan?.id) {
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
        className="w-full max-w-2xl bg-[#0f1729] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-white">
            {isEditMode ? "Update Plan" : "Add New Plan"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">

          {/* Plan Name + Price */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-xs text-slate-300 mb-1.5">
                Plan Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Pro"
                className="w-full px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700 text-white"
              />

              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="99"
                className="w-full px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700 text-white"
              />

              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs text-slate-300 mb-1.5">
              Duration (Days)
            </label>

            <input
              type="number"
              name="durationDays"
              value={formData.durationDays}
              onChange={handleChange}
              placeholder="30"
              className="w-full px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700 text-white"
            />

            {errors.durationDays && (
              <p className="text-red-500 text-xs mt-1">
                {errors.durationDays}
              </p>
            )}
          </div>

          {/* Members + Projects + Storage */}
          <div className="grid grid-cols-3 gap-4">

            <input
              type="number"
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleChange}
              placeholder="Max Members"
              className="px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700 text-white"
            />

            <input
              type="number"
              name="maxProjects"
              value={formData.maxProjects}
              onChange={handleChange}
              placeholder="Max Projects"
              className="px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700 text-white"
            />

            <input
              type="number"
              name="storage"
              value={formData.storage}
              onChange={handleChange}
              placeholder="Storage GB"
              className="px-4 py-2.5 rounded-lg bg-[#0c1221] border border-gray-700 text-white"
            />
          </div>

          {/* Features */}
          <textarea
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="Enter features, one per line"
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-[#0c1221] border border-gray-700 text-white"
          />

          {/* Active Checkbox */}
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Plan is active
          </label>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="py-3 rounded-xl border border-gray-700 text-slate-300 hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="py-3 rounded-xl bg-gradient-to-r from-[#626FF6] to-[#818CF8] text-white"
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