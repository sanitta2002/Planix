import {
    Search,
    Bell,
    Settings,
    ChevronDown,
    Menu
} from 'lucide-react';
import LogoutButton from '../../ui/LogoutButton';

interface AdminDashboardNavbarProps {
    onMenuClick?: () => void;
}

export const AdminDashboardNavbar = ({ onMenuClick }: AdminDashboardNavbarProps) => {
    return (
        <header className="h-20 px-8 border-b border-border bg-background flex items-center justify-between sticky top-0 z-10 transition-all duration-300">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                </div>
            {/* Left: Workspace Selector */}
            <div className="flex items-center">
                <div className="relative">
                    <button className="flex items-center gap-3 px-4 py-2.5 bg-black border border-gray-700/50 rounded-lg text-sm font-medium hover:bg-[#23273a] transition-colors text-white min-w-[180px] justify-between">
                        <span>All Workspaces</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-xl px-8">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users, workspaces, plans..."
                        className="w-full pl-11 pr-4 py-2.5 bg-black border border-transparent rounded-lg text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:bg-[#1f2235] focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                {/* Icons */}
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F111A]"></span>
                    </button>

                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                <div className="w-px h-8 bg-gray-800" />

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-500/20 cursor-pointer hover:opacity-90 transition-opacity">
                        AM
                    </div>
                    <LogoutButton />
                </div>
            </div>
        </header>
    );
};
