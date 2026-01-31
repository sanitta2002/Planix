import { toast } from "sonner"
import LoginForm from "../../components/Auth/LoginForm"
import { useLogin } from "../../hooks/Auth/authHook"
import type { LoginFormData } from "../../lib/validations/login.schema"
import { useNavigate } from "react-router"
import { FRONTEND_ROUTES } from "../../constants/frontRoutes"
import { useDispatch } from "react-redux"
import { setAccessToken } from "../../store/tokenSlice"
import { setAuthUser } from "../../store/authSlice"


function LoginPage() {
    const {mutate:login,isPending}=useLogin()
    const navigate=useNavigate()
    const dispatch = useDispatch()
    const handleLogin =(data:LoginFormData)=>{
        login(data,{
            onSuccess:(res)=>{
              console.log("LOGIN RESPONSE:", res);
              console.log("LOGIN USER:", res.user);
               dispatch(setAccessToken(res.accessToken))
               dispatch(setAuthUser({...res.user, role:"USER"}))
                toast.success("login successful")
                navigate(FRONTEND_ROUTES.DASHBOARD)
            },
            onError:()=>{
                toast.error("invalid email or password")
            }
        })
    }
  return (
    <div>
      <LoginForm onSubmit={handleLogin} isLoading={isPending} variant="user"/>
    </div>
  )
}

export default LoginPage
