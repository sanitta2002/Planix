import { Plus, Calendar, Tag, Users, Edit2, Trash2, } from "lucide-react";
import type { RootState } from "../../../store/Store";
import { useDispatch, useSelector } from "react-redux";
import ManageMembersModal from "../../../components/modal/ManageMembersModal";
import { useState } from "react";
import { useDeleteProject, useGetAllProjects } from "../../../hooks/project/projectHook";
import { setCurrentProject } from "../../../store/projectSlice";
import ConfirmationModal from "../../../components/modal/ConfirmationModal";
import { toast } from "sonner";
import ProjectModal from "../../../components/modal/ProjectModal";
import type { Project } from "../../../types/project";

const ProjectPage = () => {

  const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace)
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log('currentWorkspace ******', currentWorkspace)
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  );

  const userRole = currentProject?.members?.find(m => m.user.id === currentUser?.id)?.role?.name || "Member";
  const [openMembers, setOpenMembers] = useState(false);
  const { mutate: deleteProject } = useDeleteProject();
  const dispatch = useDispatch();
  const { data, } = useGetAllProjects({
    workspaceId: currentWorkspace?.id || "",
    limit: 50,
    page: 1,
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const projects = data?.data || [];

  const handleConfirmDelete = () => {
    if (!currentProject?.id) return
    deleteProject(currentProject.id, {
      onSuccess: () => {
        setIsDeleteOpen(false)
        dispatch(setCurrentProject(null));
        const remainingProjects = projects.filter((p: Project) => p.id !== currentProject.id)
        const nextProject = remainingProjects[0] || null;

        dispatch(setCurrentProject(nextProject));
        toast.success("Project deleted successfully")
      }
    })

  }
  return (
    <div className=" from-[#0A0E27] to-[#050816] text-white p-8">

      {/* 🔷 HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          {currentProject && (
            <p className="text-sm text-gray-400">
              Role: <span className="text-indigo-400 font-medium">{userRole}</span>
            </p>
          )}
        </div>

        <button onClick={() => {
          setEditingProject(null);
          setIsModalOpen(true);
        }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1a3584] to-[#1a3584] rounded-lg">
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/*  MAIN GRID */}
      <div className="grid grid-cols-2 gap-6 py-5">

        {/* LEFT SIDE */}
        <div className="col-span-2 space-y-6">

          {/* 🧾 PROJECT CARD */}
          <div
            className="bg-[#0F172A] p-6 rounded-xl border border-white/10"
          >
            <div className="flex justify-between items-start">

              {/* LEFT */}
              <div>
                <h2 className="text-lg font-semibold">
                  {currentProject?.projectName}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {currentProject?.description}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-end gap-2">

                {/* BUTTONS */}
                <div className="flex items-center gap-2">
                  <button onClick={() => {
                    setEditingProject(currentProject);
                    setIsModalOpen(true);
                  }} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition">
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button onClick={() => setIsDeleteOpen(true)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 🔑 PROJECT KEY */}
                <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Project Key</span>
                  <span className="text-xs font-mono text-indigo-400 font-bold">{currentProject?.key || "N/A"}</span>
                </div>

              </div>

            </div>


          </div>


          {/*  DETAILS CARD ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Created At */}
            <div className="bg-[#0F172A] p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:bg-white/[0.02] transition-colors duration-200">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Calendar className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium mb-1">Created At</p>
                <p className="text-sm font-semibold text-white">
                  {currentProject?.createdAt
                    ? new Date(currentProject.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Members */}
            <div onClick={() => setOpenMembers(true)} className="bg-[#0F172A] p-4 rounded-xl border border-white/10 flex items-center gap-4 cursor-pointer hover:bg-white/[0.02] hover:border-green-500/30 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium mb-1">Team Members</p>
                <div className="flex -space-x-2">
                  {currentProject?.members && currentProject.members.length > 0 ? (
                    <>
                      {currentProject.members.slice(0, 3).map((member, i) => (
                        <div key={i} className="w-7 h-7 rounded-full overflow-hidden border-2 border-[#0F172A] bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                          {member?.user?.avatarUrl ? (
                            <img src={member.user.avatarUrl} alt={member.user.firstName || "Member"} className="w-full h-full object-cover" />
                          ) : (
                            member?.user?.firstName?.charAt(0)?.toUpperCase() || "U"
                          )}
                        </div>
                      ))}
                      {currentProject.members.length > 3 && (
                        <div className="w-7 h-7 rounded-full border-2 border-[#0F172A] bg-gray-800 flex items-center justify-center text-[10px] text-gray-300 font-bold shadow-sm">
                          +{currentProject.members.length - 3}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">No members</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-[#0F172A] p-4 rounded-xl border border-white/10 flex items-start gap-4 hover:bg-white/[0.02] transition-colors duration-200">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shrink-0">
                <Tag className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium mb-2">Project Tags</p>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1a1f3c]/50 border border-indigo-500/30 rounded shadow-[0_0_10px_rgba(99,102,241,0.05)] hover:bg-[#1a1f3c] transition-colors cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
                    <span className="text-[10px] text-gray-300 font-medium tracking-wide">Frontend</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1a1f3c]/50 border border-purple-500/30 rounded shadow-[0_0_10px_rgba(168,85,247,0.05)] hover:bg-[#1a1f3c] transition-colors cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                    <span className="text-[10px] text-gray-300 font-medium tracking-wide">Design</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1a1f3c]/50 border border-red-500/30 rounded shadow-[0_0_10px_rgba(239,68,68,0.05)] hover:bg-[#1a1f3c] transition-colors cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                    <span className="text-[10px] text-gray-300 font-medium tracking-wide">Urgent</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>



      </div>
      <ManageMembersModal
        open={openMembers}
        onClose={() => setOpenMembers(false)}
        project={currentProject}
      />
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${currentProject?.projectName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
      />

    </div>

  );
};


export default ProjectPage;