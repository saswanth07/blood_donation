import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { Users, Power, Lock, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';

import { useToast } from '../../context/ToastContext';
import { CardSkeleton } from '../../components/common/Skeleton';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS);
            setUsers(response.data);
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.message || 'Failed to load users';
            setError(`Error ${status}: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (user) => {
        try {
            if (user.active) {
                await apiClient.patch(API_ENDPOINTS.ADMIN.DEACTIVATE_USER(user.id));
                toast.showSuccess(`User ${user.name} deactivated successfully`);
            } else {
                await apiClient.patch(API_ENDPOINTS.ADMIN.ACTIVATE_USER(user.id));
                toast.showSuccess(`User ${user.name} activated successfully`);
            }
            // Update UI
            setUsers(users.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
        } catch (err) {
            console.error('Status update failed:', err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;
            toast.showError(`Failed to update status: Error ${status} - ${message}`);
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'from-purple-500 to-pink-600';
            case 'DONOR': return 'from-blood-500 to-rose-600';
            case 'HOSPITAL': return 'from-blue-500 to-indigo-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN': return '👑';
            case 'DONOR': return '❤️';
            case 'HOSPITAL': return '🏥';
            default: return '👤';
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto animate-fade-in">
                <div className="mb-8">
                    <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-5 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
                </div>
            </div>
        );
    }
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-gradient mb-2">User Management</h2>
                <p className="text-gray-600">Manage all users across the platform</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Active Users</p>
                            <p className="text-3xl font-bold text-green-600">{users.filter(u => u.active).length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Inactive Users</p>
                            <p className="text-3xl font-bold text-red-600">{users.filter(u => !u.active).length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                            <XCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user, index) => (
                    <div
                        key={user.id}
                        className="glass rounded-2xl p-6 card-hover animate-slide-up border-2 border-transparent hover:border-blood-300 transition-all duration-300"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* User Avatar & Role */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-14 h-14 bg-gradient-to-br ${getRoleColor(user.role)} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                                    {getRoleIcon(user.role)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{user.name || 'Unknown'}</h3>
                                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getRoleColor(user.role)} text-white`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* User Email */}
                        <div className="mb-4 flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm truncate">{user.email}</span>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${user.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {user.active ? (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        Inactive
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => toggleStatus(user)}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 ${user.active
                                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                                }`}
                        >
                            {user.active ? (
                                <>
                                    <Lock size={16} /> Deactivate User
                                </>
                            ) : (
                                <>
                                    <Power size={16} /> Activate User
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {users.length === 0 && (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No users found</p>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
