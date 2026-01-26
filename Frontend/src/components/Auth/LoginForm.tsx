
import { Layers, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { loginSchema, type LoginFormData } from "../../lib/validations/login.schema";
import { FRONTEND_ROUTES } from "../../constants/frontRoutes"; 

interface LoginFormProps {
    onSubmit?: (data: LoginFormData) => void;
    isLoading?: boolean;
}

export default function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const submitForm = (data: LoginFormData) => {
        if (onSubmit) {
            onSubmit(data);
        } else {
            console.log("Form submitted:", data);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0E14] relative overflow-hidden p-4">
            {/* Background Glow */}
            <div className="absolute inset-0 z-0">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[130px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-[#121620]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">

                    {/* Header with Logo */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                                <Layers className="h-6 w-6 text-primary" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Welcome Back
                            </h1>
                            <p className="text-slate-400 text-sm">
                                Sign in to continue to your account
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1">Email</label>
                                <div className="relative">
                                    <Input
                                        placeholder="name@example.com"
                                        type="email"
                                        {...register("email")}
                                        className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 pl-10"
                                    />
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Password</label>
                                    <a href="#" className="text-xs text-primary hover:text-primary/80 hover:underline">Forgot password?</a>
                                </div>
                                <Input
                                    placeholder="Enter your password"
                                    type="password"
                                    {...register("password")}
                                    className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#121620] px-2 text-slate-500">or continue with</span>
                        </div>
                    </div>

                    {/* Social Auth */}
                    <div className="grid gap-3">
                        <Button variant="outline" className="w-full h-11 bg-[#1A1F2E]/50 border-slate-700/50 hover:bg-slate-800 text-slate-200 hover:text-white transition-all">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                    </div>


                    {/* Footer */}
                    <div className="space-y-4 text-center">
                        <p className="text-sm text-slate-400">
                            Don't have an account?{' '}
                            <Link
                                to={FRONTEND_ROUTES.SIGNUP || "/signup"}
                                className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
