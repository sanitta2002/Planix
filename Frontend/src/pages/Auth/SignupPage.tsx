import { toast } from "sonner";
import SignupFrom from "../../components/Auth/SignupFrom"
import { useUserSignUp } from "../../hooks/Auth/authHook";
import type { SignupFormData } from "../../lib/validations/signup.schema"
import OtpModal from "../../components/modal/OtpModal"
import { useState } from "react";


function SignupPage() {
  const { mutate: signup, isPending } = useUserSignUp();
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const handleSignup = (data: SignupFormData) => {
    signup(data, {
      onSuccess: () => {
        toast.success("signup success")
        setEmail(data.email);
        setIsOtpOpen(true);
      },
      onError: (err) => {
        toast.error("Email already registered")
        setIsOtpOpen(false);   
       setEmail(""); 
        console.log(err)
      }
    })
  }
  return (
    <div>
      <SignupFrom onSubmit={handleSignup} isLoading={isPending} />
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        email={email}
        flow="register"
      />
    </div>
  )
}

export default SignupPage
