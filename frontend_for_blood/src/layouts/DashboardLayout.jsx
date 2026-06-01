import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Activity, LayoutDashboard, Heart, Users, FileText, Settings, Building2 } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = {
        DONOR: [
            { label: 'Dashboard', path: '/donor', icon: LayoutDashboard },
            { label: 'Blood Requests', path: '/donor/requests', icon: Heart },
            { label: 'My Donations', path: '/donor/history', icon: Activity },
            { label: 'Profile', path: '/donor/profile', icon: User },
        ],
        HOSPITAL: [
            { label: 'Dashboard', path: '/hospital', icon: LayoutDashboard },
            { label: 'Create Request', path: '/hospital/create-request', icon: FileText },
            { label: 'Manage Requests', path: '/hospital/requests', icon: Activity },
            { label: 'Approvals', path: '/hospital/approvals', icon: Heart },
        ],
        ADMIN: [
            { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
            { label: 'Users', path: '/admin/users', icon: Users },
            { label: 'Donors', path: '/admin/donors', icon: Heart },
            { label: 'Hospitals', path: '/admin/hospitals', icon: Building2 },
            { label: 'Requests', path: '/admin/requests', icon: FileText },
        ]
    };

    const currentMenu = menuItems[role] || [];

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-rose-50/30">
            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-blood-600 via-red-600 to-rose-700 shadow-2xl z-10 hidden md:flex flex-col relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

                {/* Header */}
                <div className="p-6 border-b border-white/20 relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-float">
                            <Heart className="fill-current text-white w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">LifeFlow</h1>
                            <span className="text-xs text-white/80 uppercase tracking-wider font-semibold">
                                {role} Portal
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 relative z-10">
                    {currentMenu.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-white text-blood-600 shadow-lg scale-105'
                                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                                    }`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className={`${isActive ? 'animate-pulse-slow' : ''}`}>
                                    <Icon size={20} />
                                </div>
                                <span className="font-semibold">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-2 h-2 bg-blood-600 rounded-full animate-pulse"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-white/20 relative z-10">
                    <div className="glass bg-white/10 backdrop-blur-md rounded-xl p-4 mb-3">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-red-100 flex items-center justify-center text-blood-600 font-bold text-lg shadow-lg">
                                {user?.fullName?.[0]?.toUpperCase() || user?.sub?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold text-white truncate">{user?.fullName || user?.sub || 'User'}</p>
                                <p className="text-xs text-white/70 truncate">{role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover:scale-105"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
