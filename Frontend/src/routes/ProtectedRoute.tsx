import { useSelector } from "react-redux"
import type { RootState } from "../store/Store"
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  allowedRoles: ("USER" | "ADMIN");
  redirectTo: string;
}


export const ProtectedRoute =({allowedRoles, redirectTo}:ProtectedRouteProps)=>{
    const {isAuthenticated,user} = useSelector((state:RootState)=>state.auth)
    if(!isAuthenticated || !user){
       return <Navigate to={redirectTo} replace />;
    }
    if(!allowedRoles.includes(user.role)){
        return <Navigate to={redirectTo} />
    }
    return <Outlet />;
}