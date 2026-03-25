
import { useSelector } from "react-redux";
import type { RootState } from "../store/Store";
import { FRONTEND_ROUTES } from "../constants/frontRoutes";
import { Navigate, Outlet } from "react-router";

export const PublicRoute = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    if (isAuthenticated && user) {
    return user.role === "ADMIN" ? (
      <Navigate to={FRONTEND_ROUTES.ADMIN} replace />
    ) : (
      <Navigate to={FRONTEND_ROUTES.DASHBOARD} replace />
    );
  }


    return <Outlet />
}
