
import { Routes, Route } from 'react-router-dom'
import { FRONTEND_ROUTES } from '../../constants/frontRoutes'
import LandingPage from '../../pages/user/Landing/LandingPage'
import SignupPage from '../../pages/Auth/SignupPage'

function UserRoutes() {
  return (
    <Routes>
      <Route >
        <Route path={FRONTEND_ROUTES.LANDING} element={<LandingPage />} />
        <Route path={FRONTEND_ROUTES.SIGNUP} element={<SignupPage />} />
      </Route>
    </Routes>
  )
}

export default UserRoutes
