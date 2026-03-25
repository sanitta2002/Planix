import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutGrid,
    LineChart,
    CreditCard,
    Briefcase,
    Users,
    UserCircle,
    Layers,
    DollarSign,

} from 'lucide-react';
import { cn } from '../../../lib/utils'; // Adjusted import path

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
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group text-gray-400 hover:text-white hover:bg-white/5",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                )
            }
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium text-sm">{label}</span>
        </NavLink>
    );
};

export const AdminSidebar = ({ className }: { className?: string }) => {
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
            <div className="flex-2 h-1 px-4 py-3 custom-scrollbar">
            
                <div className="space-y-1">
                    <SidebarItem icon={LayoutGrid} label='Dashboard' to='/admin'/>
                    <SidebarItem icon={LineChart} label="Sales & Reports" to="/admin/sales" />
                    <SidebarItem icon={CreditCard} label="Subscription Plans" to="/admin/subscriptions" />
                    <SidebarItem icon={Briefcase} label="Manage Workspace" to="/admin/workspaces" />
                    <SidebarItem icon={Users} label="Manage Users" to="/admin/users" />
                    <SidebarItem icon={DollarSign} label=' Payment Details' to='/admin/payments'/>
                </div>
            </div>

            {/* Admin Profile Footer */}
            <div className="p-4 border-t border-gray-800/50 mt-auto">
                <NavLink
                    to="/admin/profile"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <UserCircle className="w-6 h-6" />
                    <span className="font-medium">Admin Profile</span>
                </NavLink>
            </div>
        </aside>
    );
};
