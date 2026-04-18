
import Table from "../../../components/ui/Table";
import { useGetAllpayments } from "../../../hooks/Admin/adminHook";
import { downloadReport } from "../../../Service/admin/adminService";

type AdminPayment = {
    id: string;
    user: string;
    plan: string;
    amount: number;
    status: string;
    startDate: string;
};

const AdminPayments = () => {
    const { data, isLoading } = useGetAllpayments();

    const payments: AdminPayment[] = data?.data || [];

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
            const blob = await downloadReport();

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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Payments</h1>

                <button
                    onClick={() => handleDownloadPDF()} 
                    className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 text-sm"
                >
                    Download PDF
                </button>
                
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={payments}
                isLoading={isLoading}
                emptyText="No payments found"
            />
        </div>
    );
};

export default AdminPayments;