import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ListTodo,
    Kanban,
    MessageSquare,
    Video,
    Users,
    FolderKanban,
    Settings,
    DollarSign,
    ChevronRight,
    Layers
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/Store';
import { FRONTEND_ROUTES } from '../../constants/frontRoutes';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    to: string;
}

const SidebarItem = ({ icon: Icon, label, to }: SidebarItemProps) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                )
            }
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium text-sm">{label}</span>
            {/* Active Indicator Line */}
            <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full opacity-0 transition-opacity duration-200 [.active_&]:opacity-100" />
        </NavLink>
    );
};

interface SidebarSectionProps {
    title?: string;
    children: React.ReactNode;
}

const SidebarSection = ({ title, children }: SidebarSectionProps) => (
    <div className="mb-6">
        {title && (
            <h3 className="px-3 mb-2 text-xs font-semibold text-primary/80 uppercase tracking-wider">
                {title}
            </h3>
        )}
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

export const Sidebar = ({ className }: { className?: string }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const initials = user
  ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
  : "U";

const fullName = user
  ? `${user.firstName} ${user.lastName}`.trim()
  : "User";

const roleLabel = "Team Member";
const navigate=useNavigate()
    return (
        <aside className={cn("w-64 h-screen bg-background border-r border-border flex flex-col shrink-0 sticky top-0", className)}>
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Layers className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">
                    <span className="text-white">Plani</span>
                    <span className="text-primary">X</span>
                </h1>
            </div>

            {/* Navigation Area */}
            <div className="flex-2 h-1 px-6 py-3 custom-scrollbar">
                <SidebarSection title="Main">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
                    <SidebarItem icon={ListTodo} label="Backlog" to="/backlog" />
                    <SidebarItem icon={Kanban} label="Board" to="/board" />
                </SidebarSection>

                <SidebarSection title="Communication">
                    <SidebarItem icon={MessageSquare} label="Chat" to="/chat" />
                    <SidebarItem icon={Video} label="Meeting" to="/meeting" />
                </SidebarSection>

                <SidebarSection title="Organization">
                    <SidebarItem icon={Users} label="Teams & Members" to="/users" />
                    <SidebarItem icon={FolderKanban} label="Projects" to="/projects" />
                </SidebarSection>

                <SidebarSection title="System">
                    <SidebarItem icon={Settings} label="Settings" to="/settings" />
                    <SidebarItem icon={DollarSign} label="Payment Details" to="/payment" />
                </SidebarSection>
            </div>

            {/* User Footer */}
            <button onClick={()=>navigate(FRONTEND_ROUTES.PROFILE)}>
            <div className="p-4 border-t border-border ">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
                    <div className="relative">
                        {/* Replaced Avatar component with standard img/div */}
                        <div className="h-10 w-10 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center">
                            <img src="/avatar-placeholder.png" alt="Alex" className="h-full w-full object-cover opacity-0 duration-0" onLoad={(e) => e.currentTarget.classList.remove('opacity-0')} onError={(e) => e.currentTarget.style.display = 'none'} />
                            <span className="absolute inset-0 flex items-center justify-center bg-primary/20 text-primary text-xs font-bold">{initials}</span>
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none text-foreground truncate">{fullName}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">{roleLabel}</p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
            </div>
            </button>
        </aside>
    );
};
