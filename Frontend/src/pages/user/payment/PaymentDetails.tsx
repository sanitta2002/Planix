import { useSelector } from "react-redux";
import { CreditCard } from "lucide-react";
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
}
type SubscriptionItem = {
  subscriptionId: string;
  workspaceId: string;
  plan: string;
  amount: number;
  status: string;
  startDate: string;
  endDate?: string;
};

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  Failed: "bg-red-500/20 text-red-400 border border-red-500/30",
  Refunded: "bg-purple-500/20 text-purple-400 border border-purple-500/30",

  active: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  expired: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
};

const PaymentDetails = () => {
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace.currentWorkspace
  );

  const navigate = useNavigate();

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
      <div className="bg-gradient-to-r from-[#0D1230] to-[#111638] border border-[rgba(100,116,180,0.15)] rounded-2xl p-6 md:p-8 mb-8 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Plan Info */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-white">
                {subscription?.plan ?? "No Plan"}
              </h2>

              <span
                className={`px-3 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusStyles[subscription?.status] ?? statusStyles["pending"]
                  }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {subscription?.status
                  ? subscription.status.charAt(0).toUpperCase() +
                  subscription.status.slice(1)
                  : "Pending"}
              </span>
            </div>

            <p className="text-2xl font-bold text-emerald-400 mb-1">
              ₹{subscription?.amount ?? 0}/month
            </p>

            <p className="text-slate-500 text-xs">
              Started on{" "}
              <span className="text-slate-400">
                {subscription?.startDate
                  ? new Date(subscription.startDate).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )
                  : "-"}
              </span>
            </p>
          </div>

          {/* Upgrade Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                navigate(FRONTEND_ROUTES.PLAN, {
                  state: { workspaceId: currentWorkspace?.id },
                })
              }
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1F3D] border border-slate-700/50 text-slate-300 text-sm font-medium hover:bg-[#1E2445]"
            >
              <CreditCard className="w-4 h-4" />
              Upgrade Plan
            </button>
          </div>

        </div>
      </div>

      {/* Payment History */}
      <div className="bg-[#0D1230]/80 border border-[rgba(100,116,180,0.15)] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.3)] overflow-hidden">

        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-[rgba(100,116,180,0.1)]">
          <h3 className="text-base font-semibold text-white">
            Payment History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-[rgba(100,116,180,0.1)]">
                <th className="py-4 px-6 md:px-8 text-xs font-semibold text-slate-500 uppercase">
                  Date
                </th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase">
                  Plan
                </th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase">
                  Amount
                </th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[rgba(100,116,180,0.08)]">

              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading payment history...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No payment history found
                  </td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <tr key={index} className="group hover:bg-[#141A3A]">

                    <td className="py-4 px-6 md:px-8 text-sm text-slate-300">
                      {new Date(payment.startDate).toLocaleDateString("en-IN")}
                    </td>

                    <td className="py-4 px-4 text-sm text-slate-300">
                      {payment.plan}
                    </td>

                    <td className="py-4 px-4 text-sm text-white font-medium">
                      ₹{payment.amount}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[payment.status]
                          }`}
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </span>
                    </td>




                    {/* <td className="py-4 px-4 text-sm text-slate-500">
                      {payment.invoiceId ?? "-"}
                    </td> */}

                    {/* Action Column */}
                    <td className="py-4 px-4">
                      {payment.status === "pending" ? (
                        <button
                          onClick={handleRetryPayment}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs hover:bg-yellow-500/30"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Retry Payment
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">
                          No Action
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;