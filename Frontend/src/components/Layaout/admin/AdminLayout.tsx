import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboardNavbar } from './AdminDashboardNavbar';

const AdminLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out md:ml-0">
                <AdminDashboardNavbar />
                <main className="flex-1 overflow-y-auto bg-black/20 p-4 md:p-6 pt-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
