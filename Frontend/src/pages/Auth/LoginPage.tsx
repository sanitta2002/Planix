import { toast } from "sonner"
import LoginForm from "../../components/Auth/LoginForm"
import { useLogin } from "../../hooks/Auth/authHook"
import type { LoginFormData } from "../../lib/validations/login.schema"


function LoginPage() {
    const {mutate:login,isPending}=useLogin()
    const handleLogin =(data:LoginFormData)=>{
        login(data,{
            onSuccess:()=>{
                toast.success("login successful")
            },
            onError:()=>{
                toast.error("invalid email or password")
            }
        })
    }
  return (
    <div>
      <LoginForm onSubmit={handleLogin} isLoading={isPending}/>
    </div>
  )
}

export default LoginPage
