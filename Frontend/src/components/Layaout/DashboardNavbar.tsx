import {
    Search,
    Bell,
    Settings,
    ChevronDown,
    Menu
} from 'lucide-react';
import LogoutButton from '../ui/LogoutButton';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/Store';
import { useEffect, useState } from 'react';
import { useUserWorkspaces } from '../../hooks/user/userHook';
import { useNavigate, } from 'react-router';
import { FRONTEND_ROUTES } from '../../constants/frontRoutes';
import { setCurrentWorkspace, setWorkspaces } from '../../store/workspaceSlice';

interface DashboardNavbarProps {
    onMenuClick?: () => void;
    isSidebarOpen?: boolean;
}

interface Workspace {
    id: string;
    name: string;
}

export const DashboardNavbar = ({ onMenuClick, }: DashboardNavbarProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "User"

    const workspace = useSelector((state: RootState) => state.workspace.workspaces);
    const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate()
    const dispatch = useDispatch();



    const { data: workspacesData } = useUserWorkspaces();
    const handleWorkspaceSwitch = (workspace: Workspace) => {
        dispatch(setCurrentWorkspace(workspace))
        localStorage.setItem("workspaceId", workspace.id)
        setOpen(false);
    }
    useEffect(() => {
        if (workspacesData?.data) {
            dispatch(setWorkspaces(workspacesData.data));
            const savedId = localStorage.getItem("workspaceId");
            if (savedId) {
                const savedWorkspace = workspacesData.data.find((ws: Workspace) => ws.id === savedId);
                if (savedWorkspace) {
                    dispatch(setCurrentWorkspace(savedWorkspace));
                    return;
                }
            }
            if (workspacesData.data.length > 0) {
                dispatch(setCurrentWorkspace(workspacesData.data[0]));
            }
        }
    }, [workspacesData, dispatch, currentWorkspace]);



    return (
        <header className="h-16 px-6 border-b border-border bg-background flex items-center justify-between sticky top-0 z-10 transition-all duration-300">
            {/* Left: Selectors & Mobile Toggle */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                {/* Workspace Selector */}
                <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-black border border-border rounded-md hover:bg-muted/50 text-sm font-medium"
                    >
                        <span className="flex items-center justify-center w-5 h-5 rounded bg-black-600/20 text-blue-500 text-xs font-bold">
                            {currentWorkspace?.name?.[0] || "W"}
                        </span>

                        <span>{currentWorkspace?.name}</span>

                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-2" />
                    </button>

                    {open && (
                        <div className="absolute top-full mt-2 w-52 bg-black border border-border rounded-md shadow-lg z-50">
                            {workspace.map((ws) => (
                                <button
                                    key={ws.id}
                                    onClick={() => {
                                        handleWorkspaceSwitch(ws);

                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50
        ${currentWorkspace?.id === ws.id ? "bg-muted text-primary font-semibold" : ""}`}
                                >
                                    {ws.name}
                                </button>
                            ))}

                            <div className="border-t border-border my-1" />

                            <button
                                onClick={() => navigate(FRONTEND_ROUTES.WORKSPACE)}
                                className="w-full text-left px-3 py-2 text-green-400 hover:bg-muted/50 text-sm"
                            >

                                + Create Workspace
                            </button>
                        </div>
                    )}
                </div>

                <span className="text-muted-foreground/30 text-xl font-light">/</span>

                {/* Project Selector */}
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-semibold mb-0.5 ml-1">Projects</span>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-black border border-border rounded-md hover:bg-muted/50 transition-colors text-sm text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                        <span>select project</span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-2" />
                    </button>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative group ">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search...."
                        className="w-64 pl-9 pr-4 py-2 bg-black border border-border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                    />
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Icons */}
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                </button>

                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="w-px h-6 bg-border mx-2" />

                {/* User Actions */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20 cursor-pointer hover:opacity-90 transition-opacity">
                        {initials}
                    </div>
                    <LogoutButton />
                </div>
            </div>
        </header>
    );
};
