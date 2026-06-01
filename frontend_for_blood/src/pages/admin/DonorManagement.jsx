import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { Heart, Ban, Droplet, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { CardSkeleton } from '../../components/common/Skeleton';

import { useToast } from '../../context/ToastContext';

const DonorManagement = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        fetchDonors();
    }, []);

    const fetchDonors = async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ADMIN.DONORS);
            setDonors(response.data);
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.message || 'Failed to load donors';
            setError(`Error ${status}: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async (donor) => {
        if (!window.confirm(`Are you sure you want to disable donor ${donor.name}?`)) return;
        try {
            await apiClient.patch(API_ENDPOINTS.ADMIN.DISABLE_DONOR(donor.id));
            setDonors(donors.map(d => d.id === donor.id ? { ...d, active: false } : d));
            toast.showSuccess(`Donor ${donor.name} disabled successfully`);
        } catch (err) {
            console.error('Failed to disable donor:', err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;
            toast.showError(`Failed to disable donor: Error ${status} - ${message}`);
        }
    };

    const handleEnable = async (donor) => {
        if (!window.confirm(`Are you sure you want to enable donor ${donor.name}?`)) return;
        try {
            await apiClient.patch(API_ENDPOINTS.ADMIN.ENABLE_DONOR(donor.id));
            setDonors(donors.map(d => d.id === donor.id ? { ...d, active: true } : d));
            toast.showSuccess(`Donor ${donor.name} enabled successfully`);
        } catch (err) {
            console.error('Failed to enable donor:', err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;
            toast.showError(`Failed to enable donor: Error ${status} - ${message}`);
        }
    };

    const getBloodGroupColor = (group) => {
        const colors = {
            'A+': 'from-red-400 to-rose-500',
            'A-': 'from-red-500 to-rose-600',
            'B+': 'from-blue-400 to-indigo-500',
            'B-': 'from-blue-500 to-indigo-600',
            'AB+': 'from-purple-400 to-pink-500',
            'AB-': 'from-purple-500 to-pink-600',
            'O+': 'from-green-400 to-emerald-500',
            'O-': 'from-green-500 to-emerald-600',
        };
        return colors[group] || 'from-gray-400 to-gray-500';
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
                <h2 className="text-4xl font-bold text-gradient mb-2">Donor Management</h2>
                <p className="text-gray-600">Manage and monitor all registered donors</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total Donors</p>
                            <p className="text-3xl font-bold text-gray-900">{donors.length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-blood rounded-xl flex items-center justify-center">
                            <Heart className="w-7 h-7 text-white fill-current" />
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Active Donors</p>
                            <p className="text-3xl font-bold text-green-600">{donors.filter(d => d.active !== false).length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Disabled</p>
                            <p className="text-3xl font-bold text-red-600">{donors.filter(d => d.active === false).length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                            <Ban className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Donor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor, index) => (
                    <div
                        key={donor.id}
                        className="glass rounded-2xl p-6 card-hover animate-slide-up border-2 border-transparent hover:border-blood-300 transition-all duration-300"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* Donor Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-14 h-14 bg-gradient-to-br ${getBloodGroupColor(donor.bloodGroup)} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <Droplet className="w-7 h-7 text-white fill-current" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{donor.name || 'Unknown'}</h3>
                                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getBloodGroupColor(donor.bloodGroup)} text-white`}>
                                        {donor.bloodGroup}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Donor Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{donor.city || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Last: {donor.lastDonationDate || 'Never'}</span>
                            </div>
                        </div>

                        {/* Status & Action */}
                        <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${donor.active !== false
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {donor.active !== false ? (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        Disabled
                                    </>
                                )}
                            </div>

                            {donor.active !== false ? (
                                <button
                                    onClick={() => handleDisable(donor)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    <Ban size={14} /> Disable
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleEnable(donor)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    <CheckCircle size={14} /> Enable
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {donors.length === 0 && (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No donors found</p>
                </div>
            )}
        </div>
    );
};

export default DonorManagement;
