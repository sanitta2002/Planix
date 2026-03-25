import { useState } from "react";
import { useDebounce, useGetWorkspaces } from "../../../hooks/Admin/adminHook"
import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";

export interface Workspace {
  id: string;
  name: string;
  ownerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  members: string[];
  createdAt: string;
  isBlocked: boolean;
  subscriptionStatus?: "active" | "pending" | "expired";
}

function WorkspacesPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 6;
  const { data, isLoading } = useGetWorkspaces({
    page,
    limit,
    search: debouncedSearch  || undefined,
  })
 console.log("Search sent:", debouncedSearch);

  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1;
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  const workspaces: Workspace[] = data?.data || [];
  console.log(data)


  const columns = [
    {
      header: "Workspace",
      accessor: (row: Workspace) => row.name,
    },
    {
      header: "Owner",
      accessor: (row: Workspace) => `${row.ownerId?.firstName || ""}`,
    },
    {
      header: "Status",
      accessor: (row: Workspace) => {
        let label = "Active";
        let style = "bg-green-500/20 text-green-400";

        if (row.isBlocked) {
          label = "Blocked";
          style = "bg-red-500/20 text-red-400";
        } else if (row.subscriptionStatus === "pending") {
          label = "Pending";
          style = "bg-yellow-500/20 text-yellow-400";
        }

        return (
          <span className={`px-2 py-1 rounded text-xs ${style}`}>
            {label}
          </span>
        );
      },
    },
    {
      header: "Created",
      accessor: (row: Workspace) =>
        new Date(row.createdAt).toISOString().slice(0, 10),
    },
    {
      header: "View Details",
      accessor: (row: Workspace) => (
        <button onClick={() => setSelectedWorkspace(row)} className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30">
          View
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">Workspaces</h1>

        <input
          placeholder="Search workspace..."
          value={search}
          onChange={(e) =>{setPage(1) ;setSearch(e.target.value)}}
          className="bg-[#0f1729] border border-gray-700 rounded px-4 py-2 text-sm text-white focus:outline-none"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={workspaces}
        isLoading={isLoading}
        emptyText="No workspaces found"
      />
      {selectedWorkspace && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f1729] w-[420px] rounded-xl shadow-xl border border-gray-700 p-6 relative">

            {/* Close icon */}
            <button
              onClick={() => setSelectedWorkspace(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-lg font-semibold text-white mb-4">
              Workspace Details
            </h2>

            {/* Info grid */}
            <div className="space-y-3 text-sm text-gray-300">

              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Workspace</span>
                <span className="text-white font-medium">{selectedWorkspace.name}</span>
              </div>

              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Owner</span>
                <span className="text-white font-medium">
                  {selectedWorkspace.ownerId.firstName} {selectedWorkspace.ownerId.lastName}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Members</span>
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">
                  {selectedWorkspace.members.length} members
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Created</span>
                <span className="text-white font-medium">
                  {new Date(selectedWorkspace.createdAt).toISOString().slice(0, 10)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${selectedWorkspace.isBlocked
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                    }`}
                >
                  {selectedWorkspace.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-5 flex justify-center gap-2">

              <button
                onClick={() => setSelectedWorkspace(null)}
                className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Pagination
        total={total}
        start={start}
        end={end}
        page={page}
        setPage={setPage}
        canGoPrev={page > 1}
        canGoNext={page < totalPages}
        label="workspaces"
      />
    </div>
  )

}

export default WorkspacesPage
