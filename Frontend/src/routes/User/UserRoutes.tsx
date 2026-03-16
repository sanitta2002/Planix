
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
import UserProfile from '../../pages/user/Profile/UserProfile'
import WorkspacePage from '../../pages/user/workspace/Workspacepage'
import SubscriptionPage from '../../pages/user/subscription/Subscriptionpage'
import PaymentSuccess from '../../pages/user/subscription/payment/PaymentSuccess'
import InviteMemberPage from '../../pages/user/team/InviteMemberPage'
import { AcceptInvitePage } from '../../pages/user/team/AcceptInvitePage'
import SettingPage from '../../pages/user/setting/SettingPage'
import PaymentDetails from '../../pages/user/payment/PaymentDetails'

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
          <Route path={FRONTEND_ROUTES.PROFILE} element={<UserProfile />} />
          <Route path={FRONTEND_ROUTES.WORKSPACE} element={<WorkspacePage />} />
          <Route path={FRONTEND_ROUTES.INVITE} element={<InviteMemberPage />} />
          <Route path={FRONTEND_ROUTES.SETTING} element={<SettingPage />}/>
          <Route path={FRONTEND_ROUTES.PAYMENT} element={<PaymentDetails/>}/>
        </Route>
        <Route path={FRONTEND_ROUTES.PLAN} element={<SubscriptionPage />} />
        <Route path={FRONTEND_ROUTES.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
      </Route>
      <Route path={FRONTEND_ROUTES.INVITE_ACCEPT} element={<AcceptInvitePage />} />
    </Routes>
  )
}

export default UserRoutes
