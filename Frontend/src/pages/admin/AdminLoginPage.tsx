import { toast } from "sonner"
import LoginForm from "../../components/Auth/LoginForm"
import { useAdminLogin } from "../../hooks/Admin/adminHook"
import type { LoginFormData } from "../../lib/validations/login.schema"
import { useNavigate } from "react-router"
import { FRONTEND_ROUTES } from "../../constants/frontRoutes"
import { useDispatch } from "react-redux"
import { setAccessToken } from "../../store/tokenSlice"
import { setAuthUser } from "../../store/authSlice"


const AdminLoginPage = () => {
    const { mutate: AdminLogin, isPending } = useAdminLogin()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const adminHandleLogin = (data: LoginFormData) => {
        AdminLogin(data, {
            onSuccess: (res) => {
                console.log("LOGIN RESPONSE:", res);
                console.log("LOGIN USER:", res.admin);
                dispatch(setAccessToken(res.data.accessToken))

                dispatch(setAuthUser({
                    id: res.data.admin.id,
                    email: res.data.admin.email,
                    role: "ADMIN",
                }))

                toast.success("login successful")
                navigate(FRONTEND_ROUTES.ADMIN)
            },
            onError: () => {
                toast.error("invalid email or password")
            }
        })
    }
    return (
        <div>
            <LoginForm onSubmit={adminHandleLogin} isLoading={isPending} variant="admin" />
        </div>
    )
}

export default AdminLoginPage