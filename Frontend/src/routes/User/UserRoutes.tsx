
import { Routes, Route } from 'react-router-dom'
import { FRONTEND_ROUTES } from '../../constants/frontRoutes'
import LandingPage from '../../pages/user/Landing/LandingPage'
import SignupPage from '../../pages/Auth/SignupPage'
import LoginPage from '../../pages/Auth/LoginPage'

function UserRoutes() {
  return (
    <Routes>
      <Route >
        <Route path={FRONTEND_ROUTES.LANDING} element={<LandingPage />} />
        <Route path={FRONTEND_ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={FRONTEND_ROUTES.LOGIN} element={<LoginPage />}/> 
      </Route>
    </Routes>
  )
}

export default UserRoutes
