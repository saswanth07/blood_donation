import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { Heart, UserPlus, Building2, User } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('DONOR'); // DONOR or HOSPITAL or ADMIN (secret)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bloodGroup: '',
        city: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [secretClicks, setSecretClicks] = useState(0);
    const [adminUnlocked, setAdminUnlocked] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    // Secret Admin unlock: Press 'A' key 7 times
    React.useEffect(() => {
        let keySequence = [];
        const handleKeyPress = (e) => {
            if (e.key && e.key.toLowerCase() === 'a') {
                keySequence.push('a');
                if (keySequence.length >= 7) {
                    setAdminUnlocked(true);
                    toast.showSuccess('Secret Admin Mode Unlocked! 🔐');
                    keySequence = [];
                }
            } else {
                keySequence = [];
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [toast]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare payload based on role
            const payload = {
                ...formData,
                username: formData.name, // Backend expects 'username'
                role: role
            };

            await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
            toast.showSuccess('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.message || 'Registration failed';
            toast.showError(`Registration failed: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blood-50 via-red-50 to-rose-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 bg-blood-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="glass rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-slide-up relative z-10">
                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blood-500 to-rose-600 rounded-full flex items-center justify-center mb-3 shadow-lg animate-float">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-1">Create Account</h1>
                    <p className="text-gray-600">Register as a Donor or Hospital</p>
                </div>

                {/* Error handled by Toast */}

                {/* Secret Admin Unlock Message */}
                {adminUnlocked && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm rounded-lg border-2 border-purple-300 shadow-md animate-slide-down">
                        🎉 <strong>SECRET UNLOCKED!</strong> You found the Admin portal! 🔐✨
                    </div>
                )}

                {/* Role Toggle */}
                <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-6 shadow-inner">
                    <button
                        type="button"
                        onClick={() => setRole('DONOR')}
                        className={`flex-1 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${role === 'DONOR'
                            ? 'bg-white text-blood-600 shadow-md scale-105'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        <User size={18} /> Donor
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('HOSPITAL')}
                        className={`flex-1 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${role === 'HOSPITAL'
                            ? 'bg-white text-blood-600 shadow-md scale-105'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        <Building2 size={18} /> Hospital
                    </button>
                    {adminUnlocked && (
                        <button
                            type="button"
                            onClick={() => setRole('ADMIN')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 animate-bounce-slow ${role === 'ADMIN'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                }`}
                        >
                            👑 ADMIN
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {role === 'HOSPITAL' ? 'Hospital Name' : 'Full Name'}
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {role === 'DONOR' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <select
                                name="bloodGroup"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                            >
                                <option value="">Select Group</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md mt-4 disabled:opacity-70"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-red-600 hover:underline font-medium">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
