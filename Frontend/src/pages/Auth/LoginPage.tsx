import { toast } from "sonner"
import LoginForm from "../../components/Auth/LoginForm"
import { useLogin } from "../../hooks/Auth/authHook"
import type { LoginFormData } from "../../lib/validations/login.schema"
import { useNavigate } from "react-router"
import { FRONTEND_ROUTES } from "../../constants/frontRoutes"
import { useDispatch } from "react-redux"
import { setAccessToken } from "../../store/tokenSlice"
import { setAuthUser } from "../../store/authSlice"
import { getUserWorkspaces } from "../../Service/user/userService"


function LoginPage() {
  const { mutate: login, isPending } = useLogin()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogin = (data: LoginFormData) => {
    login(data, {
      onSuccess:async (res) => {
        dispatch(setAccessToken(res.data.accessToken))
        dispatch(setAuthUser({ ...res.data.user, role: "USER" }))
        toast.success("login successful")
        try {
          const workspaces = await getUserWorkspaces()
          if(!workspaces.data || workspaces.data.length===0){
            navigate(FRONTEND_ROUTES.WORKSPACE)
          }else{
            navigate(FRONTEND_ROUTES.DASHBOARD)
          }
        } catch {
          navigate(FRONTEND_ROUTES.WORKSPACE)
        }
      },
      onError: (err) => {
        if (err instanceof Error) {
          toast.error(err.message)
        }else{

          toast.error("invalid email or password")
        }
      }
    })
  }
  return (
    <div>
      <LoginForm onSubmit={handleLogin} isLoading={isPending} variant="user" />
    </div>
  )
}

export default LoginPage
