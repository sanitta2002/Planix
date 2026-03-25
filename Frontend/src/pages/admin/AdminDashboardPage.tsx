// import React from 'react';

const AdminDashboardPage = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 relative overflow-hidden">
             {/* Background Glow */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="absolute h-[500px] w-[500px] rounded-full bg-primary/20 blur-[130px]" />
            </div>
        </div>
    );
};

export default AdminDashboardPage;
