import { useState } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useDeletePlan, useGetPlans } from "../../../hooks/Admin/adminHook";
import AddPlanModal, { type PlanData } from "./modal/AddPlanModal";
import ConfirmationModal from "../../../components/modal/ConfirmationModal";




interface Plan {
  _id: string;
  name: string;
  price: number;
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
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedPlans = plans.slice(start, end);
  const totalPages = Math.ceil(plans.length / limit);

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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {paginatedPlans.map((plan) => {


            return (
              <div
                key={plan._id}
                className="relative rounded-2xl p-8 flex flex-col text-center transition-all duration-300
                  
                    bg-[#0f1729] border-2 border-[#626FF6] shadow-[0_0_40px_rgba(98,111,246,0.12)] md:-translate-y-4"


              >


                {/* Plan Name */}
                <h2 className="text-xl font-bold mt-2">{plan.name}</h2>

                {/* Description */}
                <p className="text-slate-400 text-sm mt-1 mb-6">
                  {plan.description || `The ${plan.name} Plan`}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="text-slate-400 text-base ml-3">/month</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-1 text-left">
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
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditPlan(plan); setIsModalOpen(true); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#626FF6] to-[#818CF8] text-white hover:shadow-[0_4px_20px_rgba(98,111,246,0.4)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    <Pencil size={14} />
                    Update
                  </button>
                  <button onClick={() =>
                    setDeleteModal({
                      isOpen: true,
                      plan,
                    })
                  }
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/70 hover:shadow-[0_4px_20px_rgba(239,68,68,0.15)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer">
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Plan Modal */}
      <AddPlanModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditPlan(null); }}
        editPlan={editPlan}
      />
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
      <div className="flex justify-center gap-3 mt-10">
  <button
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
    className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
  >
    Previous
  </button>

  <span className="px-4 py-2 text-sm text-gray-400">
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage((p) => p + 1)}
    className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
  >
    Next
  </button>
</div>
    </div >
  );
}

export default SubPlan;
