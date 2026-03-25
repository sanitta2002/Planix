import React, { useState,} from 'react';
import { X, User, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/Store';
import { editProfileSchema, type EditProfileFormData } from '../../lib/validations/editProfile.schema';

type UserData = {
    firstName: string;
    lastName: string;
    phone: string;
}


interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: UserData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [formData, setFormData] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof EditProfileFormData, string>>>({});





    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof EditProfileFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Validating form data:", formData);
        const result = editProfileSchema.safeParse({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
        });

        console.log("Validation result:", result);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof EditProfileFormData, string>> = {};
            // Use .issues instead of .errors to satisfy linter
            result.error.issues.forEach(err => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as keyof EditProfileFormData] = err.message;
                }
            });
            console.log("Setting errors:", fieldErrors);
            setErrors(fieldErrors);
            return;
        }

        onSave({
            firstName: formData.firstName ?? "",
            lastName: formData.lastName ?? "",
            phone: formData.phone ?? "",
        });
        onClose();
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
                            <User className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* First Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full bg-[#0F172A] border ${errors.firstName ? 'border-red-500' : 'border-[#1E293B]'} rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="Alex"
                        />
                        {errors.firstName && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full bg-[#0F172A] border ${errors.lastName ? 'border-red-500' : 'border-[#1E293B]'} rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="Morgan"
                        />
                        {errors.lastName && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.lastName}</p>}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg pl-10 pr-4 py-3 text-slate-400 cursor-not-allowed focus:outline-none"
                            />
                        </div>
                        <p className="text-xs text-slate-600">Email address cannot be changed</p>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full bg-[#0F172A] border ${errors.phone ? 'border-red-500' : 'border-[#1E293B]'} rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="+1 (555) 123-4567"
                        />
                        {errors.phone && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.phone}</p>}
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
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
