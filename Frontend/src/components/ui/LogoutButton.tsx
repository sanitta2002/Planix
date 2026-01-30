import { LogOut } from 'lucide-react'
import { useLogout } from '../../hooks/Auth/authHook';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { clearAccessToken } from '../../store/tokenSlice';
import { clearAuth } from '../../store/authSlice';
import { toast } from 'sonner';
import { FRONTEND_ROUTES } from '../../constants/frontRoutes';


const LogoutButton = () => {
    const {mutate:logout,isPending} = useLogout()
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const handleLogout =()=>{
        logout(undefined,{
            onSuccess:()=>{
               dispatch(clearAccessToken())
               dispatch(clearAuth())
               toast.success("Logged out successfully")
               navigate(FRONTEND_ROUTES.LOGIN)
            },
            onError:()=>{
                toast.error("Logout failed")
            }
        })
    }
    return (
        <div>
            <button onClick={handleLogout} disabled={isPending}  className="text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="w-5 h-5" />
            </button>
        </div>
    )
}

export default LogoutButton