import { Eye, EyeOff, Layers, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { resetPasswordSchema, type ResetPasswordFormData } from "../../lib/validations/resetPassword.schema";

interface ResetPasswordFormProps {
    onSubmit?: (data: ResetPasswordFormData) => void;
    isLoading?: boolean;
}

export default function ResetPasswordForm({ onSubmit, isLoading = false }: ResetPasswordFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const submitForm = (data: ResetPasswordFormData) => {
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
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                                <Layers className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">Plani<span className="text-primary">X</span></span>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Reset Password
                            </h1>
                            <p className="text-slate-400 text-sm">
                                Enter your new password
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-300 ml-1">New Password</label>
                            <div className="relative">
                                <Input
                                    placeholder="Enter new password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 pr-10"
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
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Input
                                    placeholder="Confirm new password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    className="bg-[#1A1F2E]/50 border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 pr-10"
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
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs ml-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
