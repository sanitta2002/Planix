import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '../ui/Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'success' | 'info';
    isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = 'info',
    isLoading = false
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <AlertTriangle className="w-6 h-6 text-red-500" />;
            case 'success':
                return <CheckCircle className="w-6 h-6 text-emerald-500" />;
            default:
                return <Info className="w-6 h-6 text-blue-500" />;
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'danger':
                return "bg-red-500 hover:bg-red-600 text-white border-none";
            case 'success':
                return "bg-emerald-500 hover:bg-emerald-600 text-white border-none";
            default:
                return "bg-blue-500 hover:bg-blue-600 text-white border-none";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="w-full max-w-sm bg-[#0f1729] border border-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-opacity-10 ${type === 'danger' ? 'bg-red-500' :
                                type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}>
                            {getIcon()}
                        </div>
                        <h3 className="font-semibold text-gray-100">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-4 py-4 bg-[#0A0C10]/50 border-t border-gray-800/50 justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={getButtonColor()}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
