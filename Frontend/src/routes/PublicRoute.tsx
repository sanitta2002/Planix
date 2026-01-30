
import { useSelector } from "react-redux";
import type { RootState } from "../store/Store";
import { FRONTEND_ROUTES } from "../constants/frontRoutes";
import { Navigate, Outlet } from "react-router";

export const PublicRoute = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    if(isAuthenticated){
         return <Navigate to={FRONTEND_ROUTES.DASHBOARD}/>
    }
    return <Outlet />
}
