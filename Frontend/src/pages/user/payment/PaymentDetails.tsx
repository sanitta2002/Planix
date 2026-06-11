import { useState } from "react";
import { useSelector } from "react-redux";
import { CreditCard, FileText, X, Download } from "lucide-react";
import jsPDF from "jspdf";
import { useRetryPayment, useWorkspacePaymentDetails } from "../../../hooks/user/userHook";
import type { RootState } from "../../../store/Store";
import { useNavigate } from "react-router";
import { FRONTEND_ROUTES } from "../../../constants/frontRoutes";




interface Payment {
  id: string;
  workspaceId: string;
  plan: string;
  amount: number;
  status: string;
  startDate: string;
  endDate?: string; 
  method?: string;
  invoiceId?: string;
  cardLast4?: string;
  cardBrand?: string;
  stripeSubscriptionId?: string;
  latestInvoiceId?: string;
}
type SubscriptionItem = {
  subscriptionId: string;
  workspaceId: string;
  plan: string;
  amount: number;
  status: string;
  startDate: string;
  endDate?: string;
  maxMembers?: number;
  maxProjects?: number;
  stripeSubscriptionId?: string;
  latestInvoiceId?: string;
};



const PaymentDetails = () => {
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace.currentWorkspace
  );

  const navigate = useNavigate();
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  const { data, isLoading } = useWorkspacePaymentDetails(
    currentWorkspace?.id ?? ""
  );
  const subscriptions = data?.data || [];
  const subscription = subscriptions[0] || null;

  const payments: Payment[] = subscriptions.map((item:SubscriptionItem) => ({
    id: item.subscriptionId,
    workspaceId: item.workspaceId,
    plan: item.plan,
    amount: item.amount,
    status: item.status,
    startDate: item.startDate,
    endDate: item.endDate, 
    stripeSubscriptionId: item.stripeSubscriptionId,
    latestInvoiceId: item.latestInvoiceId,
  }));

  const { mutate: retryPayment } = useRetryPayment();



  const handleRetryPayment = () => {
    console.log(data)
    retryPayment({ subscriptionId: data.data.subscriptionId }, {
      onSuccess: (res) => {
        const url = res.data.url;

        if (url) {
          window.location.href = url;
        }
      },
      onError: (error) => {
        console.error("Retry payment failed", error);
      },
    });
  };

  const handleExportPDF = (receipt: Payment) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("Transaction Receipt", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Receipt details for your subscription", 14, 30);

    // Divider
    doc.setDrawColor(203, 213, 225);
    doc.line(14, 35, pageWidth - 14, 35);

    // Amount section
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text("Total Paid Amount", 14, 48);
    doc.setFontSize(28);
    doc.setTextColor(16, 185, 129);
    doc.text(`Rs.${receipt.amount}`, 14, 60);

    // Status
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`Status: ${receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}`, 14, 72);

    // Divider
    doc.setDrawColor(203, 213, 225);
    doc.line(14, 78, pageWidth - 14, 78);

    // Details
    let y = 90;
    const addRow = (label: string, value: string) => {
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(label, 14, y);
      doc.setTextColor(30, 41, 59);
      doc.text(value, pageWidth - 14, y, { align: "right" });
      y += 10;
    };

    addRow("Transaction ID", receipt.id);
    addRow("Plan Name", receipt.plan);
    addRow("Date Issued", new Date(receipt.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }));
    if (receipt.endDate) {
      addRow("End Date", new Date(receipt.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }));
    }
    addRow("Payment Channel", "Stripe Gateway");
    if (receipt.stripeSubscriptionId) {
      addRow("Stripe Sub ID", receipt.stripeSubscriptionId);
    }
    if (receipt.latestInvoiceId) {
      addRow("Stripe Invoice ID", receipt.latestInvoiceId);
    }

    // Footer
    y += 10;
    doc.setDrawColor(203, 213, 225);
    doc.line(14, y, pageWidth - 14, y);
    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, y);

    doc.save(`receipt-${receipt.id.slice(-8)}-${new Date().toISOString().split("T")[0]}.pdf`);
  };


  return (
    <div className="text-slate-200 p-6 md:p-10 font-['Inter','Segoe_UI',sans-serif]">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Billing & Payment History
        </h1>
        <p className="text-slate-400 text-sm">
          Manage your subscription and view past transactions.
        </p>
      </div>

      {/* Current Plan */}
      <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#6366F1]/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* LEFT: Plan Meta & Brand */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                  Active Subscription
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {subscription?.plan ?? "No Active Plan"}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      subscription?.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${subscription?.status === "active" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${subscription?.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                    </span>
                    {subscription?.status
                      ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)
                      : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                ₹{subscription?.amount ?? 0}
              </span>
              <span className="text-slate-400 text-sm font-medium">/ month</span>
            </div>

            <p className="text-slate-400 text-xs flex items-center gap-2">
              <span>Billing Cycle:</span>
              <span className="text-slate-200 font-medium">
                {subscription?.startDate
                  ? new Date(subscription.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>
              {subscription?.endDate && (
                <>
                  <span className="text-slate-600">•</span>
                  <span>Renews on:</span>
                  <span className="text-slate-200 font-medium">
                    {new Date(subscription.endDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* RIGHT: High-tech Usage Spec Cards */}
          {subscription && subscription.status === "active" && (
            <div className="flex flex-wrap sm:flex-nowrap gap-4 lg:w-auto">
              {/* Members Spec Card */}
              <div className="flex-1 sm:w-40 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Team Members
                </span>
                <p className="text-xl font-extrabold text-white tracking-tight">
                  {subscription.maxMembers !== null && subscription.maxMembers !== undefined ? `${subscription.maxMembers} Limit` : "Unlimited"}
                </p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: "60%" }} />
                </div>
              </div>

              {/* Projects Spec Card */}
              <div className="flex-1 sm:w-40 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Workspace Projects
                </span>
                <p className="text-xl font-extrabold text-white tracking-tight">
                  {subscription.maxProjects !== null && subscription.maxProjects !== undefined ? `${subscription.maxProjects} Limit` : "Unlimited"}
                </p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "40%" }} />
                </div>
              </div>
            </div>
          )}

          {/* Upgrade & Manage Section */}
          <div className="flex lg:flex-col gap-3 shrink-0 lg:w-48">
            <button
              onClick={() =>
                navigate(FRONTEND_ROUTES.PLAN, {
                  state: { workspaceId: currentWorkspace?.id },
                })
              }
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200"
            >
              <CreditCard className="w-4 h-4" />
              {subscription?.plan ? "Upgrade Plan" : "Choose Plan"}
            </button>
          </div>

        </div>
      </div>

      {/* Payment History */}
      <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5">
          <h3 className="text-base font-semibold text-white tracking-wide">
            Payment History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="py-4 px-6 md:px-8 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Date
                </th>
                <th className="py-4 px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Plan Name
                </th>
                <th className="py-4 px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Amount
                </th>
                <th className="py-4 px-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Billing Status
                </th>
                <th className="py-4 px-6 md:px-8 text-[10px] font-bold tracking-widest text-slate-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">

              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    <span className="inline-flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-500 border-t-transparent" />
                      Loading payment history...
                    </span>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                    No transactions found in this workspace.
                  </td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <tr key={index} className="group hover:bg-white/[0.02] transition-colors duration-150">

                    <td className="py-4 px-6 md:px-8 text-sm text-slate-300 font-medium">
                      {new Date(payment.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>

                    <td className="py-4 px-4 text-sm text-slate-300">
                      <span className="font-semibold text-white">{payment.plan}</span>
                    </td>

                    <td className="py-4 px-4 text-sm text-emerald-400 font-bold">
                      ₹{payment.amount}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          payment.status === "Paid" || payment.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.08)]"
                            : payment.status === "Failed"
                            ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.08)]"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          payment.status === "Paid" || payment.status === "active" ? "bg-emerald-400" : payment.status === "Failed" ? "bg-red-400" : "bg-amber-400"
                        }`} />
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>

                    <td className="py-4 px-6 md:px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status === "pending" && (
                          <button
                            onClick={handleRetryPayment}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/20 shadow-md shadow-yellow-500/5 transition-all duration-200"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Retry Payment
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedReceipt(payment)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/5 text-slate-300 text-xs font-semibold hover:bg-white/[0.08] hover:text-white transition-all duration-150"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Receipt
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
    </div>

      {/* Receipt Details Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090D1A]/80 backdrop-blur-md transition-all duration-300 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Ambient Modal Glow */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight">Transaction Receipt</h4>
                  <p className="text-xs text-slate-500">Receipt details for your active plan subscription</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Details Body */}
            <div className="space-y-6">
              
              {/* Receipt Visual Header */}
              <div className="text-center py-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Total Paid Amount</span>
                <p className="text-3xl font-extrabold text-emerald-400">₹{selectedReceipt.amount}</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full text-[10px] font-semibold border ${
                  selectedReceipt.status === "Paid" || selectedReceipt.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedReceipt.status === "Paid" || selectedReceipt.status === "active" ? "bg-emerald-400" : "bg-amber-400"
                  }`} />
                  {selectedReceipt.status.charAt(0).toUpperCase() + selectedReceipt.status.slice(1)}
                </span>
              </div>

              {/* Transaction Specs List */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="text-white font-mono text-xs">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Plan Name</span>
                  <span className="text-white font-semibold">{selectedReceipt.plan}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Date Issued</span>
                  <span className="text-slate-200">
                    {new Date(selectedReceipt.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {selectedReceipt.endDate && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">End Date</span>
                    <span className="text-slate-200">
                      {new Date(selectedReceipt.endDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3.5">
                  <span className="text-slate-400">Payment Channel</span>
                  <span className="text-slate-200 font-medium">Stripe Gateway</span>
                </div>
                {selectedReceipt.stripeSubscriptionId && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Stripe Sub ID</span>
                    <span className="text-white font-mono text-[10px] break-all max-w-[240px] text-right">{selectedReceipt.stripeSubscriptionId}</span>
                  </div>
                )}
                {selectedReceipt.latestInvoiceId && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Stripe Invoice ID</span>
                    <span className="text-white font-mono text-[10px] break-all max-w-[240px] text-right">{selectedReceipt.latestInvoiceId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-8 border-t border-white/5 pt-5 border-none">
              <button
                onClick={() => handleExportPDF(selectedReceipt)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/5 text-slate-300 hover:text-white hover:bg-white/[0.08] text-sm font-semibold transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 flex items-center justify-center px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-200"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;