import { useState } from "react";
import WorkspaceModal from "../../../components/workspace/workspace";
import { useCreateWorkspace } from "../../../hooks/user/userHook";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { FRONTEND_ROUTES } from "../../../constants/frontRoutes";

function WorkspacePage() {
    const [isOpen, setIsOpen] = useState(true);
    const {mutate:createWorkspace } = useCreateWorkspace()
    const navigate = useNavigate()
    const handleSubmit = (data: {
        name: string;
        description: string;
        type: "individual" | "company";
    }) => {
        console.log("Workspace created:", data);
        createWorkspace(data,{
            onSuccess:(res)=>{
                console.log("workspace response:",res)
                const workspaceId = res.data.id;
                toast.success('workspace created')
                setIsOpen(false);
                
                 
                 navigate(`${FRONTEND_ROUTES.PLAN}?workspaceId=${workspaceId}`);
            },
            onError:()=>{
                toast.error("Failed to create workspace")
            }

        })
       
    };

    return (
        <div className="min-h-screen bg-[#070d1b] flex items-center justify-center">
            <WorkspaceModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={handleSubmit}
            />
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00e676] to-[#00c853] text-[#0c1225] font-semibold text-sm hover:shadow-[0_4px_24px_rgba(0,230,118,0.35)] transition-all duration-200 cursor-pointer"
                >
                    Create Workspace
                </button>
            )}
        </div>
    );
}

export default WorkspacePage;