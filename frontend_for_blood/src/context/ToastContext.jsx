import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ type = 'info', message, duration = 5000 }) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showSuccess = (message) => addToast({ type: 'success', message });
    const showError = (message) => addToast({ type: 'error', message });
    const showInfo = (message) => addToast({ type: 'info', message });
    const showWarning = (message) => addToast({ type: 'warning', message });

    return (
        <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning, addToast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto min-w-[320px] max-w-sm rounded-xl p-4 shadow-xl border flex items-start gap-3 transform transition-all duration-300 animate-slide-left
                            ${toast.type === 'success' ? 'bg-white border-green-100 text-gray-800' : ''}
                            ${toast.type === 'error' ? 'bg-white border-red-100 text-gray-800' : ''}
                            ${toast.type === 'info' ? 'bg-white border-blue-100 text-gray-800' : ''}
                            ${toast.type === 'warning' ? 'bg-white border-amber-100 text-gray-800' : ''}
                        `}
                    >
                        <div className={`
                            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5
                            ${toast.type === 'success' ? 'bg-green-100 text-green-600' : ''}
                            ${toast.type === 'error' ? 'bg-red-100 text-red-600' : ''}
                            ${toast.type === 'info' ? 'bg-blue-100 text-blue-600' : ''}
                            ${toast.type === 'warning' ? 'bg-amber-100 text-amber-600' : ''}
                        `}>
                            {toast.type === 'success' && <CheckCircle size={14} strokeWidth={3} />}
                            {toast.type === 'error' && <AlertCircle size={14} strokeWidth={3} />}
                            {toast.type === 'info' && <Info size={14} strokeWidth={3} />}
                            {toast.type === 'warning' && <AlertTriangle size={14} strokeWidth={3} />}
                        </div>

                        <div className="flex-1">
                            <h4 className={`text-sm font-bold capitalize mb-0.5
                                ${toast.type === 'success' ? 'text-green-700' : ''}
                                ${toast.type === 'error' ? 'text-red-700' : ''}
                                ${toast.type === 'info' ? 'text-blue-700' : ''}
                                ${toast.type === 'warning' ? 'text-amber-700' : ''}
                            `}>
                                {toast.type}
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">{toast.message}</p>
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
