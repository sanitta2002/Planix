import {
    Search,
    Bell,
    Settings,
    ChevronDown,
    Menu
} from 'lucide-react';
import LogoutButton from '../ui/LogoutButton';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/Store';

interface DashboardNavbarProps {
    onMenuClick?: () => void;
    isSidebarOpen?: boolean;
}

export const DashboardNavbar = ({ onMenuClick, }: DashboardNavbarProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "User"
        

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
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-semibold mb-0.5 ml-1">Workspace</span>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-black border border-border rounded-md hover:bg-muted/50 transition-colors text-sm font-medium">
                        <span className="flex items-center justify-center w-5 h-5 rounded bg-black-600/20 text-blue-500 text-xs font-bold">W</span>
                        <span>MySpace</span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-2" />
                    </button>
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
