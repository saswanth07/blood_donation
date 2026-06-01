import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { Building2, Power, Lock, MapPin, Mail, CheckCircle, XCircle, Activity } from 'lucide-react';

import { useToast } from '../../context/ToastContext';
import { CardSkeleton } from '../../components/common/Skeleton';

const HospitalManagement = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ADMIN.HOSPITALS);
            setHospitals(response.data);
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.message || 'Failed to load hospitals';
            setError(`Error ${status}: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (hospital) => {
        try {
            if (hospital.active) {
                await apiClient.patch(API_ENDPOINTS.ADMIN.DEACTIVATE_HOSPITAL(hospital.id));
                toast.showSuccess(`Hospital ${hospital.name} deactivated successfully`);
            } else {
                await apiClient.patch(API_ENDPOINTS.ADMIN.ACTIVATE_HOSPITAL(hospital.id));
                toast.showSuccess(`Hospital ${hospital.name} activated successfully`);
            }
            setHospitals(hospitals.map(h => h.id === hospital.id ? { ...h, active: !h.active } : h));
        } catch (err) {
            console.error('Failed to update hospital status:', err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;
            toast.showError(`Failed to update status: Error ${status} - ${message}`);
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
                <h2 className="text-4xl font-bold text-gradient mb-2">Hospital Management</h2>
                <p className="text-gray-600">Manage and monitor all registered hospitals</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total Hospitals</p>
                            <p className="text-3xl font-bold text-gray-900">{hospitals.length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Active</p>
                            <p className="text-3xl font-bold text-green-600">{hospitals.filter(h => h.active).length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Inactive</p>
                            <p className="text-3xl font-bold text-red-600">{hospitals.filter(h => !h.active).length}</p>
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                            <XCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Hospital Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map((hospital, index) => (
                    <div
                        key={hospital.id}
                        className="glass rounded-2xl p-6 card-hover animate-slide-up border-2 border-transparent hover:border-blue-300 transition-all duration-300"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* Hospital Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Building2 className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{hospital.name || 'Unknown'}</h3>
                                    <span className="inline-block px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                        Hospital
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hospital Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{hospital.city || 'Unknown'}</span>
                            </div>
                            {hospital.email && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm truncate">{hospital.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Status & Action */}
                        <div className="space-y-3">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${hospital.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {hospital.active ? (
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

                            <button
                                onClick={() => toggleStatus(hospital)}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 ${hospital.active
                                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                                    }`}
                            >
                                {hospital.active ? (
                                    <>
                                        <Lock size={16} /> Deactivate
                                    </>
                                ) : (
                                    <>
                                        <Power size={16} /> Activate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {hospitals.length === 0 && (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No hospitals found</p>
                </div>
            )}
        </div>
    );
};

export default HospitalManagement;
