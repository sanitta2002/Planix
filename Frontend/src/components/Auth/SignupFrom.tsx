
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Layers } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form";
import { cn } from "../../lib/utils"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Link, useNavigate } from "react-router"
import { FRONTEND_ROUTES } from "../../constants/frontRoutes"
import { signupSchema, type SignupFormData } from "../../lib/validations/signup.schema"
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleAuthButton from "../ui/GoogleAuthButton";


interface SignupFormProps {
    onSubmit: (data: SignupFormData) => void;
    isLoading: boolean;
}


function SignupFrom({ onSubmit, isLoading }: SignupFormProps) {
    const [step, setStep] = useState(1)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });
    const nextStep = async (e: React.FormEvent) => {
        e.preventDefault()
        const isValid = await trigger(["firstName",
            "lastName",
            "email",
            "phone",])
        if (isValid) {
            setStep(2)
        }

    }

    const prevStep = () => {
        setStep(1)
    }

    const submitForm = (data: SignupFormData) => {
        onSubmit(data);
    };

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
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                                <Layers className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">Plani<span className="text-primary">X</span></span>
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
                    <form className="space-y-4" onSubmit={handleSubmit(submitForm)}>

                        {/* Step 1: Personal Info */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300 ml-1">First Name</label>
                                        <Input
                                            placeholder="firstName"
                                            {...register("firstName")}
                                            className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                        />
                                        {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300 ml-1">Last Name</label>
                                        <Input
                                            placeholder="lastName"
                                            {...register("lastName")}
                                            className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                        />
                                        {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Email</label>
                                    <Input
                                        placeholder="name@example.com"
                                        type="email"
                                        {...register("email")}
                                        className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Phone Number</label>
                                    <Input
                                        placeholder="+1 (555) 000-0000"
                                        {...register("phone")}
                                        className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                    />
                                </div>

                                <Button type="submit" onClick={nextStep} className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20 group">
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
                                    <div className="relative">
                                    <Input
                                        placeholder="Min 8 characters"
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                    />
                                    <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                                </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Confirm Password</label>
                                    <div className="relative">
                                    <Input
                                        placeholder="Re-enter password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...register("confirmPassword")}
                                        className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                    />
                                     <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Button type="submit" className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                                        {isLoading ? "Creating..." : "Create Account"}
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
                     
                        <GoogleAuthButton onSuccess={()=>navigate(FRONTEND_ROUTES.HOME)}/>

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
