
import { Routes, Route } from 'react-router-dom'
import { FRONTEND_ROUTES } from '../../constants/frontRoutes'
import LandingPage from '../../pages/user/Landing/LandingPage'
import SignupPage from '../../pages/Auth/SignupPage'
import LoginPage from '../../pages/Auth/LoginPage'
import ForgotPasswordPage from '../../pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from '../../pages/Auth/ResetPasswordPage'
import { DashboardLayout } from '../../components/Layaout/DashboardLayout';
import DashboardPage from '../../pages/user/Dashboard/DashboardPage';
import { PublicRoute } from '../PublicRoute'
import { ProtectedRoute } from '../ProtectedRoute'

function UserRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={FRONTEND_ROUTES.LANDING} element={<LandingPage />} />
        <Route path={FRONTEND_ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={FRONTEND_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={FRONTEND_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={FRONTEND_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={'USER'} redirectTo={FRONTEND_ROUTES.LANDING} />}>
        <Route element={<DashboardLayout />}>
          <Route path={FRONTEND_ROUTES.DASHBOARD} element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default UserRoutes
