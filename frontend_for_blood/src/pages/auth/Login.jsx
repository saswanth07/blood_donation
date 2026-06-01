import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Heart, Activity } from 'lucide-react';

// Module-level flag to handle SPA navigation persistence
let hasCheckedReload = false;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [adminMode, setAdminMode] = useState(false);

    const { login, token, role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const from = location.state?.from?.pathname || '/';

    // Redirect logic
    React.useEffect(() => {
        // 1. If authenticated, go to dashboard
        if (token && role) {
            if (from === '/' || from === '/login') {
                if (role === 'DONOR') navigate('/donor/profile', { replace: true });
                else if (role === 'HOSPITAL') navigate('/hospital', { replace: true });
                else if (role === 'ADMIN') navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
            return;
        }

        // 2. (User Request) If page is reloaded ON THE LOGIN PAGE, go to Landing Page
        // We use a flag to check this only once per app load (prevent SPA loops)
        if (!hasCheckedReload) {
            hasCheckedReload = true;
            const navEntry = performance.getEntriesByType('navigation')[0];

            if (navEntry && navEntry.type === 'reload') {
                // Ensure we only redirect if the RELOAD happened ON the login page
                // (Prevents issue where reloading Landing -> clicking Login triggers redirect)
                try {
                    const entryUrl = new URL(navEntry.name);
                    const currentUrl = new URL(window.location.href);

                    if (entryUrl.pathname === currentUrl.pathname) {
                        navigate('/', { replace: true });
                    }
                } catch (e) {
                    // Fallback if URL parsing fails
                    console.error("Nav check failed", e);
                }
            }
        }
    }, [token, role, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.showSuccess('Welcome back!');
            // Navigation handled by useEffect
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Invalid email or password';
            toast.showError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoClick = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);
        if (newCount >= 5) {
            setAdminMode(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blood-50 via-red-50 to-rose-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blood-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="glass rounded-3xl shadow-2xl w-full max-w-md p-8 animate-slide-up relative z-10">
                <div className="text-center mb-8">
                    <div
                        onClick={handleLogoClick}
                        className="mx-auto w-20 h-20 bg-gradient-to-br from-blood-500 to-rose-600 rounded-full flex items-center justify-center mb-4 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg animate-float"
                    >
                        <Heart className="w-10 h-10 text-white fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to LifeFlow Blood Management</p>
                    {adminMode && (
                        <div className="mt-3 inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg animate-bounce-slow">
                            🔐 Admin Mode Activated
                        </div>
                    )}
                </div>

                {/* Error message removed - handled by Toast */}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-blood-500 outline-none transition-all duration-200 hover:border-gray-300"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-500 focus:border-blood-500 outline-none transition-all duration-200 hover:border-gray-300"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-blood text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <Heart className="w-5 h-5" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blood-600 hover:text-blood-700 font-semibold hover:underline transition-colors">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
