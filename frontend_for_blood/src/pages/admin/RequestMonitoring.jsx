import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { FileText, XCircle, Droplet, MapPin, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

import { useToast } from '../../context/ToastContext';
import { CardSkeleton } from '../../components/common/Skeleton';

const RequestMonitoring = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ADMIN.REQUESTS);
            setRequests(response.data);
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.message || 'Failed to load requests';
            setError(`Error ${status}: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async (request) => {
        if (!window.confirm(`Are you sure you want to force close this ${request.bloodGroup} request?`)) return;
        try {
            await apiClient.patch(API_ENDPOINTS.ADMIN.CLOSE_REQUEST(request.id));
            setRequests(requests.map(r => r.id === request.id ? { ...r, status: 'CLOSED' } : r));
            toast.showSuccess(`Request #${request.id} closed successfully`);
        } catch (err) {
            console.error('Failed to close request:', err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;
            toast.showError(`Failed to close request: Error ${status} - ${message}`);
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

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'HIGH': return 'from-red-500 to-rose-600';
            case 'MEDIUM': return 'from-yellow-500 to-amber-600';
            case 'LOW': return 'from-blue-500 to-indigo-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto animate-fade-in">
                <div className="mb-8">
                    <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-5 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-gradient mb-2">Blood Request Monitoring</h2>
                <p className="text-gray-600">Monitor and manage all blood requests across the platform</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-blood-500 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total Requests</p>
                            <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Open</p>
                            <p className="text-3xl font-bold text-green-600">{requests.filter(r => r.status === 'OPEN').length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Closed</p>
                            <p className="text-3xl font-bold text-gray-600">{requests.filter(r => r.status === 'CLOSED').length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                            <XCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">High Urgency</p>
                            <p className="text-3xl font-bold text-red-600">{requests.filter(r => r.urgency === 'HIGH').length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center animate-pulse-slow">
                            <AlertTriangle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((req, index) => (
                    <div
                        key={req.id}
                        className={`glass rounded-2xl p-6 card-hover animate-slide-up border-2 ${req.urgency === 'HIGH' && req.status === 'OPEN' ? 'border-red-300 animate-glow' : 'border-transparent'
                            } hover:border-blood-300 transition-all duration-300`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* Request Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-14 h-14 bg-gradient-to-br ${getBloodGroupColor(req.bloodGroup)} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <Droplet className="w-7 h-7 text-white fill-current" />
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Request #{req.id}</span>
                                    <h3 className="text-2xl font-bold text-gray-900">{req.bloodGroup}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Request Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{req.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Droplet className="w-4 h-4" />
                                <span className="text-sm">{req.unitsRequired} Units Required</span>
                            </div>
                            {req.expiryDate && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">Expires: {new Date(req.expiryDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Urgency & Status */}
                        <div className="flex items-center gap-2 mb-4">
                            {req.urgency && (
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getUrgencyColor(req.urgency)} text-white`}>
                                    {req.urgency}
                                </span>
                            )}
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${req.status === 'OPEN'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                                }`}>
                                {req.status === 'OPEN' ? (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        OPEN
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                        CLOSED
                                    </>
                                )}
                            </span>
                        </div>

                        {/* Action Button */}
                        {req.status === 'OPEN' && (
                            <button
                                onClick={() => handleClose(req)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                <XCircle size={16} /> Force Close Request
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {requests.length === 0 && (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No blood requests found</p>
                </div>
            )}
        </div>
    );
};

export default RequestMonitoring;
