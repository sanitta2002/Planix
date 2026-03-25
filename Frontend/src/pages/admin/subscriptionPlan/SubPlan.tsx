import { useState } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useDeletePlan, useGetPlans } from "../../../hooks/Admin/adminHook";
import AddPlanModal, { type PlanData } from "./modal/AddPlanModal";
import ConfirmationModal from "../../../components/modal/ConfirmationModal";
import { Button } from "../../../components/ui/Button";

interface Plan {
  _id: string;
  name: string;
  price: number;
  durationDays: number;
  features: string[];
  isActive?: boolean;
  description?: string;
  isRecommended?: boolean;
}

function SubPlan() {
  const { data, isLoading } = useGetPlans();
  const plans: Plan[] = data?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);

  const { mutate: deletePlanMutate, isPending: isDeleting } = useDeletePlan();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    plan: PlanData | null;
  }>({
    isOpen: false,
    plan: null,
  });

  const [page, setPage] = useState(1);
  const limit = 3;

  const total = plans.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedPlans = plans.slice(startIndex, endIndex);

  const start = total === 0 ? 0 : startIndex + 1;
  const end = Math.min(endIndex, total);

  const canGoPrev = page > 1;
  const canGoNext = endIndex < total;

  if (isLoading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  const handleDeletePlan = () => {
    if (!deleteModal.plan) return;

    deletePlanMutate(deleteModal.plan.id!, {
      onSuccess: () => {
        setDeleteModal({ isOpen: false, plan: null });
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0c1221] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Subscription Plans
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Manage pricing tiers and features
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#626FF6] hover:bg-[#525ede] transition-colors text-white font-semibold px-5 py-2.5 rounded-lg text-sm cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add New Plan
          </button>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
  {paginatedPlans.map((plan) => (
    <div
      key={plan._id}
      className="rounded-2xl p-8 flex flex-col h-full text-center
      bg-[#0f1729] border-2 border-[#626FF6]
      shadow-[0_0_40px_rgba(98,111,246,0.12)] transition-all duration-300"
    >
      {/* Plan Name */}
      <h2 className="text-xl font-bold">{plan.name}</h2>

      {/* Description */}
      <p className="text-slate-400 text-sm mt-1 mb-6">
        {plan.description || `The ${plan.name} Plan`}
      </p>

      {/* Price */}
      <div className="mb-8">
        <span className="text-5xl font-extrabold tracking-tight">
          ${plan.price}
        </span>
        <span className="text-slate-400 text-base ml-3">
          /{plan.durationDays} days
        </span>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8 flex-grow text-left">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-3 text-sm text-slate-300"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 shrink-0">
              <Check
                size={12}
                className="text-emerald-400"
                strokeWidth={3}
              />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Buttons */}
      <div className="flex gap-3 mt-auto">
        <button
          onClick={() => {
            setEditPlan(plan);
            setIsModalOpen(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm
          bg-gradient-to-r from-[#626FF6] to-[#818CF8] text-white
          hover:shadow-[0_4px_20px_rgba(98,111,246,0.4)]
          hover:scale-[1.03] active:scale-[0.98]
          transition-all duration-200 cursor-pointer"
        >
          <Pencil size={14} />
          Update
        </button>

        <button
          onClick={() =>
            setDeleteModal({
              isOpen: true,
              plan,
            })
          }
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm
          border border-red-500/40 text-red-400
          hover:bg-red-500/10 hover:border-red-500/70
          hover:shadow-[0_4px_20px_rgba(239,68,68,0.15)]
          hover:scale-[1.03] active:scale-[0.98]
          transition-all duration-200 cursor-pointer"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
      </div>

      {/* Add/Edit Plan Modal */}
      <AddPlanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditPlan(null);
        }}
        editPlan={editPlan}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, plan: null })}
        onConfirm={handleDeletePlan}
        title="Delete Plan"
        message={`Are you sure you want to delete ${deleteModal.plan?.name}?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Pagination */}
      <div className="border-t border-gray-800/50 p-4 flex items-center justify-between text-xs text-gray-500 mt-12">
        <span>
          {total === 0
            ? "Showing 0 plans"
            : `Showing ${start}-${end} of ${total} plans`}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-8 px-3 text-xs bg-transparent border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            disabled={!canGoPrev}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            className="h-8 px-3 text-xs bg-transparent border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            disabled={!canGoNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SubPlan;