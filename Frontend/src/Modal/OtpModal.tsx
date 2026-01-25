import { useState, useEffect } from 'react'
import { ShieldCheck, Mail, ArrowLeft, Layers } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useResendOtp, useVerifyOtp } from '../hooks/Auth/authHook';
import { toast } from 'sonner';

interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

function OtpModal({ isOpen, onClose, email }: OtpModalProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [timeLeft, setTimeLeft] = useState(15)

    const { mutate: verifyOtp, isPending } = useVerifyOtp()
    const { mutate: resendOtp, isPending:isResending } = useResendOtp()


    useEffect(() => {
        if (!isOpen) return

        setOtp(['', '', '', '', '', ''])
        setTimeLeft(15)

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [isOpen])
    const otpValue = otp.join('')
    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false

        const newOtp = [...otp]
        newOtp[index] = element.value
        setOtp(newOtp)

        // Focus next input
        if (element.value !== '' && element.nextSibling) {
            (element.nextSibling as HTMLInputElement).focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = (e.target as HTMLInputElement).previousSibling as HTMLInputElement;
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    const handleVerifyOtp = () => {
        if (otpValue.length !== 6) {
            toast.error("Please enter 6-digit OTP");
            return;
        }

        verifyOtp(
            { email, otp: otpValue },
            {
                onSuccess: () => {
                    toast.success("Email verified successfully");

                    onClose();
                },
                onError: () => {
                    toast.error("Invalid or expired OTP");
                },
            }
        );
    };


    const handleResendOtp = () => {
        resendOtp(
            { email },
            {
                onSuccess: () => {
                    toast.success("OTP resent to your email");
                    setTimeLeft(15);
                    setOtp(["", "", "", "", "", ""]);
                },
                onError: () => {
                    toast.error("Failed to resend OTP");
                }
            }
        )
    }

    if (!isOpen) return null


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md p-4">
                <div className="relative overflow-hidden rounded-3xl bg-[#0B0E14] p-8 shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-300">

                    {/* Glow Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        {/* Logo */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                                <Layers className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                    Planix
                                </span>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Verify OTP</h2>
                            <div className="flex flex-col items-center gap-1 text-sm text-slate-400">
                                <p>We sent a 6-digit code to your email</p>
                                <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full">
                                    <Mail className="w-3 h-3" />
                                    <span>{email || 'user@example.com'}</span>
                                </div>
                            </div>
                        </div>

                        {/* OTP Inputs */}
                        <div className="flex gap-2 justify-center w-full">
                            {otp.map((data, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onFocus={(e) => e.target.select()}
                                    className="w-12 h-14 text-center text-xl font-bold bg-[#1A1F2E] border-slate-700 focus-visible:ring-primary text-white rounded-xl"
                                />
                            ))}
                        </div>

                        {/* Action Buittons */}
                        <div className="w-full space-y-4">
                            <Button onClick={handleVerifyOtp} className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-medium shadow-lg shadow-primary/25">
                                {isPending ? "Verifying..." : "Verify OTP"}
                            </Button>

                            <div className="text-sm text-slate-400">
                                {timeLeft > 0 ? (
                                    <p>Resend OTP in <span className="text-white font-medium">{timeLeft}s</span></p>
                                ) : (
                                    <button onClick={handleResendOtp} className="text-primary hover:underline font-medium">Resend Code {isResending ? "Resending..." : "Resend Code"}</button>

                                )}
                            </div>
                        </div>

                        {/* Back Link */}
                        <button onClick={onClose} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </button>

                        {/* Secure Footer */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-4">
                            <ShieldCheck className="w-3 h-3" />
                            Your connection is secure and encrypted
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtpModal
