import { toast } from "sonner";
import ResetPasswordForm from "../../components/Auth/ResetPasswordForm"
import { useResetPassword } from "../../hooks/Auth/authHook";
import type { ResetPasswordFormData } from "../../lib/validations/resetPassword.schema";
import { useLocation, useNavigate } from "react-router";
import { FRONTEND_ROUTES } from "../../constants/frontRoutes";


function ResetPasswordPage() {
     const { mutate: resetPassword, isPending } = useResetPassword();
     const navigate = useNavigate()
     const location = useLocation()
     const email=location.state?.email
     const submitForm =(data:ResetPasswordFormData)=>{
        resetPassword({...data,email},{
           onSuccess:()=>{
             toast.success("password updated successfully");
              navigate(FRONTEND_ROUTES.LOGIN)
           },
           onError:()=>{
            toast.error("failed to update password")
           }
        })
     }

  return (
    <div>
        <ResetPasswordForm onSubmit={submitForm} isLoading={isPending}/>
    </div>
  )
}

export default ResetPasswordPage