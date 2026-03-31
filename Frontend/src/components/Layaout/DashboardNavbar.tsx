import {
    Search,
    Bell,
    Settings,
    ChevronDown,
    Menu
} from "lucide-react";
import LogoutButton from "../ui/LogoutButton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/Store";
import { useEffect, useState } from "react";
import { useUserWorkspaces } from "../../hooks/user/userHook";
import { useNavigate } from "react-router";
import { FRONTEND_ROUTES } from "../../constants/frontRoutes";
import {
    setCurrentWorkspace,
    setWorkspaces,
} from "../../store/workspaceSlice";
import { useGetAllProjects } from "../../hooks/project/projectHook";
import { setCurrentProject } from "../../store/projectSlice";


interface DashboardNavbarProps {
    onMenuClick?: () => void;
}

interface Workspace {
    id: string;
    name: string;
}

export const DashboardNavbar = ({ onMenuClick }: DashboardNavbarProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    


    const user = useSelector((state: RootState) => state.auth.user);
    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
        : "U";

    const workspace = useSelector(
        (state: RootState) => state.workspace.workspaces
    );
    const currentWorkspace = useSelector(
        (state: RootState) => state.workspace.currentWorkspace
    );

    const currentProject = useSelector(
        (state: RootState) => state.project.currentProject
    );

    const isOwner = currentWorkspace?.ownerId?.id === user?.id;

    const [open, setOpen] = useState(false);
    const [projectOpen, setProjectOpen] = useState(false);

    const { data ,} = useGetAllProjects({
        workspaceId: currentWorkspace?.id || "",
        limit: 50,
        page: 1,
    });

    const projects = data?.data?.data || [];

    const { data: workspacesData } = useUserWorkspaces();

    const handleWorkspaceSwitch = (workspace: Workspace) => {
        dispatch(setCurrentWorkspace(workspace));
        dispatch(setCurrentProject(null));
        localStorage.setItem("workspaceId", workspace.id);
        setOpen(false);
    };

    useEffect(() => {
        if (workspacesData?.data) {
            dispatch(setWorkspaces(workspacesData.data));

            const savedId = localStorage.getItem("workspaceId");

            if (savedId) {
                const savedWorkspace = workspacesData.data.find(
                    (ws: Workspace) => ws.id === savedId
                );
                if (savedWorkspace) {
                    dispatch(setCurrentWorkspace(savedWorkspace));
                    return;
                }
            }

            if (workspacesData.data.length > 0) {
                dispatch(setCurrentWorkspace(workspacesData.data[0]));
            }
        }
    }, [workspacesData, dispatch]);

    useEffect(() => {
        if (projects.length && !currentProject) {
            dispatch(setCurrentProject(projects[0]));
        }
    }, [projects]);

    useEffect(() => {
        const handleClick = () => {
            setOpen(false);
            setProjectOpen(false);
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        
        <header className="h-16 px-6 border-b border-border bg-background flex items-center justify-between sticky top-0 z-10">

            {/* LEFT */}
            <div className="flex items-center gap-6">

                <button onClick={onMenuClick} className="md:hidden p-2">
                    <Menu className="w-5 h-5" />
                </button>

                {/* 🔷 Workspace */}
                <div className="flex items-center gap-4">

                    {/* 🔷 Workspace */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 px-4 py-1 rounded-xl bg-[#000000] backdrop-blur border border-white/10 hover:border-indigo-500 hover:bg-white/10 transition-all"
                        >
                            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                                {currentWorkspace?.name?.[0] || "W"}
                            </div>

                            <div className="flex flex-col text-left">
                                <span className="text-[10px] text-gray-400">Workspace</span>
                                <span className="text-sm font-medium">
                                    {currentWorkspace?.name || "Select"}
                                </span>
                            </div>

                            <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                        </button>

                        {open && (
                            <div className="absolute mt-3 w-60 bg-[#0F172A] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">

                                <div className="px-3 py-2 text-xs text-gray-400 border-b border-white/10">
                                    Workspaces
                                </div>

                                {workspace.map((ws) => (
                                    <div
                                        key={ws.id}
                                        onClick={() => handleWorkspaceSwitch(ws)}
                                        className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-white/5 transition
            ${currentWorkspace?.id === ws.id ? "bg-white/10" : ""}`}
                                    >
                                        <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-xs">
                                            {ws.name[0]}
                                        </div>
                                        {ws.name}
                                    </div>
                                    
                                ))}
                        
                                

                                {isOwner && (
                                    <div
                                        onClick={() => navigate(FRONTEND_ROUTES.WORKSPACE)}
                                        className="px-3 py-2 text-sm text-green-400 hover:bg-white/5 cursor-pointer"
                                    >
                                        + Create Workspace
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-white/10" />

                    {/* 🔷 Project */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setProjectOpen(!projectOpen)}
                            className="flex items-center gap-2 px-4 py-1 rounded-xl bg-[#000000] backdrop-blur border border-white/10 hover:border-indigo-500 hover:bg-white/10 transition-all"
                        >
                            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-purple-500/20 text-indigo-400 text-xs font-bold">
                                {currentProject?.projectName?.[0] || "P"}
                            </div>

                            <div className="flex flex-col text-left">
                                <span className="text-[10px] text-gray-400">Project</span>
                                <span className="text-sm font-medium">
                                    {currentProject?.projectName || "Select"}
                                </span>
                            </div>

                            <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                        </button>

                        {projectOpen && (
                            <div className="absolute mt-3 w-60 bg-[#0F172A] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">

                                <div className="px-3 py-2 text-xs text-gray-400 border-b border-white/10">
                                    Projects
                                </div>

                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        onClick={() => {
                                            dispatch(setCurrentProject(project));
                                            setProjectOpen(false);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-white/5 transition
            ${currentProject?.id === project.id ? "bg-white/10" : ""}`}
                                    >
                                        <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-xs">
                                            {project.projectName[0]}
                                        </div>
                                        {project.projectName}
                                    </div>
                                ))}

                                

                                
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                    <input
                        placeholder="Search..."
                        className="w-64 pl-9 pr-4 py-2 bg-black border border-border rounded-full text-sm"
                    />
                </div>

                <button>
                    <Bell className="w-5 h-5" />
                </button>

                <button onClick={() => navigate(FRONTEND_ROUTES.SETTING)}>
                    <Settings className="w-5 h-5" />
                </button>

                <button onClick={() => navigate(FRONTEND_ROUTES.PROFILE)}>
                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-white">
                        {initials}
                    </div>
                </button>

                <LogoutButton />
            </div>
            
        </header>
        
    );
};