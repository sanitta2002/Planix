
import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import { useGetAllpayments, useGetPlans } from "../../../hooks/Admin/adminHook";
import { downloadReport } from "../../../Service/admin/adminService";
import { useState } from "react";

type AdminPayment = {
    id: string;
    user: string;
    plan: string;
    amount: number;
    status: string;
    startDate: string;
};

type Plan = {
    _id: string;
    name: string;
};

const AdminPayments = () => {
    const [page, setPage] = useState(1);
    const limit = 8;
    const [filters, setFilters] = useState({
        planId: "",
        startDate: "",
        endDate: "",
        status: "",
    });

    const { data, isLoading } = useGetAllpayments({
        ...filters,
        page,
        limit,
    });
    const { data: plansData } = useGetPlans();

    const total = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    const payments: AdminPayment[] = data?.data || [];
    const plans = plansData?.data || [];

    const columns = [
        {
            header: "User",
            accessor: "user" as keyof AdminPayment,
        },
        {
            header: "Plan",
            accessor: "plan" as keyof AdminPayment,
        },
        {
            header: "Amount",
            accessor: (row: AdminPayment) => `₹${row.amount}`,
        },
        {
            header: "Status",
            accessor: (row: AdminPayment) => {
                const styles =
                    row.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : row.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-slate-500/20 text-slate-400";

                return (
                    <span className={`px-3 py-1 rounded-full text-xs ${styles}`}>
                        {row.status}
                    </span>
                );
            },
        },
        {
            header: "Date",
            accessor: (row: AdminPayment) =>
                new Date(row.startDate).toLocaleDateString("en-IN"),
        },
    ];



    const handleDownloadPDF = async () => {
        try {
            const blob = await downloadReport(filters);

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "payments-report.pdf";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    return (
        <div className="p-6 text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Payment History</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage and track all system subscriptions</p>
                </div>

                <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Plan</label>
                        <select
                            value={filters.planId}
                            onChange={(e) => {
                                setFilters({ ...filters, planId: e.target.value });
                                setPage(1);
                            }}
                            className="bg-slate-900 border border-slate-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200 min-w-[140px]"
                        >
                            <option value="">All Plans</option>
                            {plans.map((plan: Plan) => (
                                <option key={plan._id} value={plan._id}>
                                    {plan.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">From</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => {
                                setFilters({ ...filters, startDate: e.target.value });
                                setPage(1);
                            }}
                            className="bg-slate-900 border border-slate-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">To</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => {
                                setFilters({ ...filters, endDate: e.target.value });
                                setPage(1);
                            }}
                            className="bg-slate-900 border border-slate-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => {
                                setFilters({ ...filters, status: e.target.value });
                                setPage(1);
                            }}
                            className="bg-slate-900 border border-slate-800 text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200 min-w-[120px]"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="expired">Expired</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setFilters({ planId: "", startDate: "", endDate: "", status: "" });
                                setPage(1);
                            }}
                            className="px-4 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 transition-colors text-sm font-medium"
                            title="Reset filters"
                        >
                            Reset
                        </button>
                        <button
                            onClick={() => handleDownloadPDF()}
                            className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20"
                        >
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <Table
                    columns={columns}
                    data={payments}
                    isLoading={isLoading}
                    emptyText="No payments found matching your criteria"
                />
                
                <Pagination
                    total={total}
                    start={start}
                    end={end}
                    page={page}
                    setPage={setPage}
                    canGoPrev={page > 1}
                    canGoNext={page < totalPages}
                    label="payments"
                />
            </div>
        </div>
    );
};

export default AdminPayments;