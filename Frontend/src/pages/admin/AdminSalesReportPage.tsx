import React, { useState } from "react"; // Forcing Vite rebuild
import { useQuery } from "@tanstack/react-query";
import { getAdminSalesReportData } from "../../Service/admin/adminService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

interface RevenueTimeline {
  week: string;
  revenue: number;
}

interface MonthlyRecurringRevenue {
  month: string;
  revenue: number;
}

interface SubscriptionGrowth {
  plan: string;
  subscriptions: number;
}

interface RecentPayment {
  id: string;
  user: string;
  workspace: string;
  amount: number;
  status: string;
  date: string;
}

interface SalesReportData {
  revenueTimeline: RevenueTimeline[];
  monthlyRecurringRevenue: MonthlyRecurringRevenue[];
  subscriptionGrowth: SubscriptionGrowth[];
  recentPayments: RecentPayment[];
}

const AdminSalesReportPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { data, isLoading, isError } = useQuery<{ data: SalesReportData }>({
    queryKey: ["admin-sales-report"],
    queryFn: getAdminSalesReportData,
    select: (res: { data: SalesReportData }) => res,
  });

  const report = data?.data;

  const handleExport = () => {
    try {
      setIsExporting(true);
      if (!report) return;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Title
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59);
      doc.text("Sales & Reports", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text("Revenue analytics and subscription performance", 14, 36);

      // Divider line
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 40, pageWidth - 14, 40);

      // ── Section 1: Revenue Timeline (Weekly) ──
      let currentY = 48;
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("Revenue Timeline (Weekly)", 14, currentY);
      currentY += 4;

      const totalWeeklyRevenue = report.revenueTimeline.reduce((sum, w) => sum + w.revenue, 0);

      autoTable(doc, {
        head: [["Week", "Revenue"]],
        body: report.revenueTimeline.map(item => [
          item.week,
          `$${item.revenue.toLocaleString()}`
        ]),
        foot: [["Total", `$${totalWeeklyRevenue.toLocaleString()}`]],
        startY: currentY,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [16, 185, 129] },
        footStyles: { fillColor: [240, 253, 244], textColor: [30, 41, 59], fontStyle: "bold" },
      });

      currentY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

      // ── Section 2: Monthly Recurring Revenue (MRR) ──
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("Monthly Recurring Revenue (MRR)", 14, currentY);
      currentY += 4;

      const totalMRR = report.monthlyRecurringRevenue.reduce((sum, m) => sum + m.revenue, 0);

      autoTable(doc, {
        head: [["Month", "Revenue"]],
        body: report.monthlyRecurringRevenue.map(item => [
          item.month,
          `$${item.revenue.toLocaleString()}`
        ]),
        foot: [["Total MRR", `$${totalMRR.toLocaleString()}`]],
        startY: currentY,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [139, 92, 246] },
        footStyles: { fillColor: [245, 243, 255], textColor: [30, 41, 59], fontStyle: "bold" },
      });

      currentY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

      // ── Section 3: Subscription Growth Analytics ──
      // Check if we need a new page
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("Subscription Growth Analytics", 14, currentY);
      currentY += 4;

      const totalSubs = report.subscriptionGrowth.reduce((sum, s) => sum + s.subscriptions, 0);

      autoTable(doc, {
        head: [["Plan", "Active Subscriptions"]],
        body: report.subscriptionGrowth.map(item => [
          item.plan,
          item.subscriptions.toString()
        ]),
        foot: [["Total", totalSubs.toString()]],
        startY: currentY,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [139, 92, 246] },
        footStyles: { fillColor: [245, 243, 255], textColor: [30, 41, 59], fontStyle: "bold" },
      });

      currentY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

      // ── Section 4: Recent Payments ──
      if (currentY > 200) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("Recent Payments", 14, currentY);
      currentY += 4;

      autoTable(doc, {
        head: [["User", "Workspace", "Amount", "Status", "Date"]],
        body: report.recentPayments.map(payment => [
          payment.user,
          payment.workspace,
          `$${payment.amount.toFixed(2)}`,
          payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
          payment.date
        ]),
        startY: currentY,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 70, 229] },
      });

      // Save PDF
      doc.save(`sales-report-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Failed to export report", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="p-8 min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
        <div className="text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20">
          Error loading sales report data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-slate-900 text-slate-50">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Sales & Reports
          </h1>
          <p className="text-slate-400 text-sm">
            Revenue analytics and subscription performance
          </p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className={`flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 px-4 py-2 rounded-full transition-colors font-medium text-sm ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isExporting ? (
            <div className="animate-spin h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full" />
          ) : (
            <Download size={16} />
          )}
          {isExporting ? "Exporting..." : "Export Report"}
        </button>
      </div>

      {/* Top Row: Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Timeline */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold mb-6">Revenue Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={report.revenueTimeline} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="week" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#475569" }} tickLine={false} dy={10} />
                <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                  itemStyle={{ color: "#10b981" }}
                  formatter={(value: number | string | readonly (string | number)[] | undefined) => [`$${value || 0}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#1e293b" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold mb-6">Monthly Recurring Revenue (MRR)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={report.monthlyRecurringRevenue} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#475569" }} tickLine={false} dy={10} />
                <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                  itemStyle={{ color: "#8b5cf6" }}
                  formatter={(value: number | string | readonly (string | number)[] | undefined) => [`$${value || 0}`, "MRR"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#1e293b" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Row: Bar Chart */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-10">
        <h3 className="text-lg font-semibold mb-6">Subscription Growth Analytics</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report.subscriptionGrowth} margin={{ top: 5, right: 20, bottom: 5, left: -20 }} barSize={160}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="plan" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#475569" }} tickLine={false} dy={10} />
              <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "#334155", opacity: 0.2 }}
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                itemStyle={{ color: "#8b5cf6" }}
                formatter={(value: number | string | readonly (string | number)[] | undefined) => [value as string | number || 0, "Subscriptions"]}
              />
              <Bar dataKey="subscriptions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: Recent Payments Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Payments</h2>
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Workspace</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {report.recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No recent payments found.
                    </td>
                  </tr>
                ) : (
                  report.recentPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-slate-300">{payment.user}</td>
                      <td className="px-6 py-4 text-slate-400">{payment.workspace}</td>
                      <td className="px-6 py-4 text-slate-300 font-medium">${(payment.amount).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status.toLowerCase() === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : payment.status.toLowerCase() === "pending"
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{payment.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesReportPage;
