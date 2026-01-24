
import { ArrowLeft, ArrowRight, CheckCircle2, Layers } from "lucide-react"
import { useState } from "react"
import { cn } from "../lib/utils"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { Link } from "react-router"
import { FRONTEND_ROUTES } from "../constants/frontRoutes"

// import OtpModal from "../Modal/OtpModal"

function SignupFrom() {
    const [step, setStep] = useState(1)
    // const [isOtpOpen, setIsOtpOpen] = useState(false)

    // Simple mock form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const nextStep = (e: React.FormEvent) => {
        e.preventDefault()
        setStep(2)
    }

    const prevStep = () => {
        setStep(1)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would trigger the API call to signup
        // On success, open OTP modal
        // setIsOtpOpen(true)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0E14] relative overflow-hidden p-4">
            {/* Background Glow */}
            <div className="absolute inset-0 z-0">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[130px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-[#121620]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-500">

                    {/* Header with Logo */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                                <Layers className="h-6 w-6 text-primary" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                {step === 1 ? 'Create Your Account' : 'Set Your Password'}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {step === 1 ? 'Start managing projects like a pro' : 'Secure your account to get started'}
                            </p>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-center gap-2 mb-6">
                        <div className={cn("h-1.5 w-12 rounded-full transition-colors duration-300", step >= 1 ? "bg-primary" : "bg-slate-800")} />
                        <div className={cn("h-1.5 w-12 rounded-full transition-colors duration-300", step >= 2 ? "bg-primary" : "bg-slate-800")} />
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={step === 1 ? nextStep : handleSubmit}>

                        {/* Step 1: Personal Info */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300 ml-1">First Name</label>
                                        <Input
                                            name="firstName"
                                            placeholder="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300 ml-1">Last Name</label>
                                        <Input
                                            name="lastName"
                                            placeholder="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Email</label>
                                    <Input
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Phone Number</label>
                                    <Input
                                        name="phone"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                    />
                                </div>

                                <Button type="submit" className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20 group">
                                    Continue
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Security */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Password</label>
                                    <Input
                                        name="password"
                                        placeholder="Min 8 characters"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Confirm Password</label>
                                    <Input
                                        name="confirmPassword"
                                        placeholder="Re-enter password"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Button type="submit" className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                                        Create Account
                                        <CheckCircle2 className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={prevStep}
                                        className="w-full h-11 text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#121620] px-2 text-slate-500">
                                or
                            </span>
                        </div>
                    </div>

                    {/* Social Auth */}
                    <Button variant="outline" className="w-full h-11 bg-white hover:bg-slate-600 text-slate-900 border-none font-medium flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </Button>

                    {/* Footer */}
                    <div className="space-y-4 text-center">
                        <p className="text-xs text-slate-500">
                            By continuing, you agree to our{' '}
                            <a href="#" className="font-medium text-primary hover:underline">
                                Terms
                            </a>{' '}
                            &{' '}
                            <a href="#" className="font-medium text-primary hover:underline">
                                Privacy Policy
                            </a>
                        </p>

                        <p className="text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to={FRONTEND_ROUTES.LOGIN} className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
                                LogIn
                            </Link>
                        </p>
                    </div>

                </div>
            </div>

            {/* <OtpModal
                isOpen={isOtpOpen}
                onClose={() => setIsOtpOpen(false)}
                email={formData.email}
            /> */}
        </div>
    )
}

export default SignupFrom
