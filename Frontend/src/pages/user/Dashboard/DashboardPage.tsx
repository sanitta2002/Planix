import { TrendingUp } from 'lucide-react';


const DashboardPage = () => {
    return (
       
        <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="absolute h-[500px] w-[500px] rounded-full bg-primary/20 blur-[130px]" />
            </div>

            <div className="relative z-10 w-full max-w-2xl bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-12 flex flex-col items-center text-center shadow-2xl">

                {/* Icon Container */}
                <div className="w-20 h-20 bg-background/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5">
                    <TrendingUp className="w-10 h-10 text-blue-500" />
                </div>

                {/* Text Content */}
                <h2 className="text-2xl font-bold text-white mb-3">No project selected</h2>
                <p className="text-muted-foreground text-sm max-w-md mb-8 leading-relaxed">
                    Select a project from the top navigation to view analytics and board details.
                </p>

                {/* Action Button */}
                <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-primary/30">
                    Create Project
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;
