import React, { useState } from 'react';
import { X, Shield, EyeOff, Eye } from 'lucide-react';
import { changePasswordSchema, type ChangePasswordFormData } from '../../lib/validations/changePassword.schema';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { currentPassword: string; newPassword: string }) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSave }) => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
     const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword,setNewPasswors]=useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordFormData, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof ChangePasswordFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Validating passwords:", passwords);
        const result = changePasswordSchema.safeParse(passwords);

        if (!result.success) {
            console.log("Validation failed:", result.error);
            const fieldErrors: Partial<Record<keyof ChangePasswordFormData, string>> = {};
            // Use .issues instead of .errors
            result.error.issues.forEach(err => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as keyof ChangePasswordFormData] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        onSave({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
        });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="w-full max-w-lg bg-[#0A0E27] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#0F172A] text-blue-500 border border-[#1E293B]">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Change Password</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 ">
                    {/* Current Password */}
                    <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-slate-400">Current Password</label>
                        <input
                            type={showPassword ? "text" : "password"}

                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            className={`w-full bg-[#0F172A] border ${errors.currentPassword ? 'border-red-500' : 'border-[#1E293B]'} rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500`}
                            placeholder="Enter current password"
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
                        {errors.currentPassword && (
                            <p className="text-red-500 text-xs ml-1">{errors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-slate-400">New Password</label>
                        <input
                            type={newPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            className={`w-full bg-[#0F172A] border ${errors.newPassword ? 'border-red-500' : 'border-[#1E293B]'} rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500`}
                            placeholder="Enter new password"
                        />
                        <button
                            type="button"
                            onClick={() => setNewPasswors(!newPassword)}
                            className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            {newPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs ml-1">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-slate-400">Confirm New Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            className={`w-full bg-[#0F172A] border ${errors.confirmPassword ? 'border-red-500' : 'border-[#1E293B]'} rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500`}
                            placeholder="Confirm new password"
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
                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 pt-2 border-t border-transparent">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#6366F1] hover:bg-[#5558DD] text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all text-sm"
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
