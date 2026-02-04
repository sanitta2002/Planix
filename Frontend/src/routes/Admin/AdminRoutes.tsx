import { Route, Routes } from "react-router"
import { FRONTEND_ROUTES } from "../../constants/frontRoutes"
import AdminLoginPage from "../../pages/admin/AdminLoginPage"
import AdminLayout from "../../components/Layaout/admin/AdminLayout"
import AdminDashboardPage from "../../pages/admin/AdminDashboardPage"
import { PublicRoute } from "../PublicRoute"
import { ProtectedRoute } from "../ProtectedRoute"
import UserPage from "../../pages/admin/userMangement/UserPage"



const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicRoute/>}>
            <Route path={FRONTEND_ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={"ADMIN"} redirectTo={FRONTEND_ROUTES.ADMIN_LOGIN}/>}>
            <Route element={<AdminLayout />}>
                <Route path={FRONTEND_ROUTES.ADMIN} element={<AdminDashboardPage />} />
                <Route path={FRONTEND_ROUTES.ADMIN_USERS} element={<UserPage/>}/>
                <Route path={FRONTEND_ROUTES.ADMIN_SALES_REPORT} element={<h1>sales</h1>} />
                <Route path={FRONTEND_ROUTES.ADMIN_SUBSCRIPTIONS} element={<h1>SUBSCRIPTIONS</h1>}/>
                <Route path={FRONTEND_ROUTES.ADMIN_WORKSPACES} element={<h1>WORKSPACES</h1>}/>
                <Route path={FRONTEND_ROUTES.ADMIN_PAYMENTS_DETAILS} element={<h1>payments</h1>} />
                
            </Route>
            </Route>
        </Routes>
    )
}

export default AdminRoutes
