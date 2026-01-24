
import { Link } from 'react-router'
import { Button } from '../ui/Button'
import { Layers } from 'lucide-react'
import { FRONTEND_ROUTES } from '../../constants/frontRoutes'

function Header() {
  return (
    <div >
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary    ">
            <Layers className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Planix</span>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </a>
          <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            About
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
            <Link to={FRONTEND_ROUTES.LOGIN}>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Login
          </Button>
          </Link>
          <Link to={FRONTEND_ROUTES.SIGNUP}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Sign up
          </Button>
          </Link>
        </div>
      </div>
    </header>
    </div>
  )
}

export default Header
