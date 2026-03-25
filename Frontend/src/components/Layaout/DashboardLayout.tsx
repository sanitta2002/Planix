import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DashboardNavbar } from './DashboardNavbar';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed md:sticky top-0 z-50 h-[100dvh] transition-transform duration-300 ease-in-out md:translate-x-0 w-64 bg-background border-r border-border",
                !isSidebarOpen && "-translate-x-full"
            )}>
                <Sidebar className="h-full w-full" />

                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out md:ml-0">
                <DashboardNavbar
                    onMenuClick={() => setIsSidebarOpen(true)}
                    isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 overflow-y-auto bg-black/20 p-4 md:p-6 pt-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
