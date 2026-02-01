import { toast } from "sonner";
import ForgotPasswordForm from "../../components/Auth/ForgotPasswordForm"
import { useForgotPassword } from "../../hooks/Auth/authHook";
import type { ForgotPasswordFormData } from "../../lib/validations/forgotPassword.schema";
import OtpModal from "../../components/modal/OtpModal";
import { useState } from "react";

function ForgotPasswordPage() {
    const { mutate:forgotPassword, isPending } = useForgotPassword();
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [email, setEmail] = useState<string>("");
    const submitForm =(data:ForgotPasswordFormData)=>{
       forgotPassword(data,{
        onSuccess:()=>{
            toast.success('sent otp in your email')
            setEmail(data.email);
            setIsOtpOpen(true);
        },
        onError:()=>{
            toast.error("failed to generate reset OTP")
        }
       })
    }

  return (
    <div>
      <ForgotPasswordForm onSubmit={submitForm} isLoading={isPending}/>
       <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        email={email}
        flow="forgot-password"
      />
    </div>
  )
}

export default ForgotPasswordPage
