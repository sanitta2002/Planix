import { useState } from "react";
import { ArrowLeft, ChevronDown, Calendar } from "lucide-react";
import { toast } from "sonner";

interface StartSprintProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SprintFormData) => void;
  isLoading?: boolean;
  initialName?: string;
  initialGoal?: string;
}

export interface SprintFormData {
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
}

const StartSprint = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialName = "",
  initialGoal = ""
}: StartSprintProps) => {
  const [formData, setFormData] = useState<SprintFormData>({
    name: initialName,
    goal: initialGoal,
    startDate: "",
    endDate: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[650px] bg-[#0A0E27] border border-[#1E293B] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center gap-4 px-8 pt-8 pb-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-medium text-white">Start Sprint</h2>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">

            {/* Sprint Name */}
            <div className="space-y-2">
              <label className="text-[13px] text-zinc-400 font-medium">
                Sprint Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ECA-sprint 1"
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#6366F1] transition-colors"
                required
              />
            </div>

            {/* Sprint Goal */}
            <div className="space-y-2">
              <label className="text-[13px] text-zinc-400 font-medium">
                Sprint Goal(Optional)
              </label>
              <textarea
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="Sprint goal please enter...."
                rows={4}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-4 text-sm text-slate-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#6366F1] resize-none transition-colors leading-relaxed"
              />
            </div>

            {/* Grid Layout for Dates and Status */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">


              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-[13px] text-zinc-400 font-medium">Start Date</label>
                <div className="relative group">
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#6366F1] transition-colors [color-scheme:dark] appearance-none"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-[13px] text-zinc-400 font-medium">End Date</label>
                <div className="relative group">
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#6366F1] transition-colors [color-scheme:dark] appearance-none"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-8 px-10 py-8 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#6366F1] hover:bg-[#5558DD] active:scale-95 text-white px-10 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:scale-100 min-w-[120px]"
            >
              {isLoading ? "Starting..." : "Start"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default StartSprint;
