import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { Activity, Users, Clock, AlertCircle, X, Droplet, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { TableRowSkeleton } from '../../components/common/Skeleton';

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    // Modal State
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [eligibleDonors, setEligibleDonors] = useState([]);
    const [loadingDonors, setLoadingDonors] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.HOSPITAL.MY_REQUESTS);
            setRequests(response.data);
        } catch (err) {
            console.error(err);
            toast.showError('Failed to load your requests');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDonors = async (request) => {
        setSelectedRequest(request);
        setShowModal(true);
        setLoadingDonors(true);
        setEligibleDonors([]);

        try {
            const response = await apiClient.get(API_ENDPOINTS.HOSPITAL.ELIGIBLE_DONORS(request.id));
            console.log("Eligible Donors Response:", response.data);
            setEligibleDonors(response.data);
        } catch (err) {
            console.error('Failed to load eligible donors', err);
            toast.showError('Could not fetch eligible donors');
        } finally {
            setLoadingDonors(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    const getUrgencyBadge = (urgency) => {
        switch (urgency) {
            case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in relative pb-12">
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-gradient mb-2">Manage Requests</h2>
                <p className="text-gray-600">Track and manage your blood donation requests</p>
            </div>

            <div className="glass rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Group</th>
                                <th className="px-6 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Details</th>
                                <th className="px-6 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Urgency</th>
                                <th className="px-6 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Status</th>
                                <th className="px-6 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white/60">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i}><td colSpan="5"><TableRowSkeleton /></td></tr>
                                ))
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Activity size={48} className="mb-4 opacity-50" />
                                            <p className="text-lg font-medium">No requests found</p>
                                            <p className="text-sm">Create a request to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req, index) => (
                                    <tr key={req.id} className="hover:bg-red-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-110 transition-transform">
                                                    {req.bloodGroup}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Request #{req.id}</p>
                                                    <p className="text-xs text-gray-500">Created: {new Date().toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Droplet size={14} className="text-red-500" />
                                                    <span className="font-medium">{req.unitsRequired} Units</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <MapPin size={12} /> {req.city}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyBadge(req.urgency)}`}>
                                                {req.urgency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${req.status === 'OPEN' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}>
                                                {req.status === 'OPEN' ? <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> : null}
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            {req.status === 'OPEN' && (
                                                <button
                                                    onClick={() => handleViewDonors(req)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow"
                                                >
                                                    <Users size={16} /> Eligible Donors
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col animate-slide-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                                    <Users className="text-blue-500" /> Eligible Donors
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Searching for <strong>{selectedRequest?.bloodGroup}</strong> donors in <strong>{selectedRequest?.city}</strong>
                                </p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-0 overflow-y-auto flex-1 bg-white">
                            {loadingDonors ? (
                                <div className="p-12 space-y-4">
                                    {[1, 2, 3].map(i => <TableRowSkeleton key={i} />)}
                                </div>
                            ) : eligibleDonors.length === 0 ? (
                                <div className="p-16 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                        <Users size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">No Matches Found</h4>
                                    <p className="text-gray-500 max-w-xs mx-auto">There are no eligible donors matching the criteria in this location right now.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Donor Name</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Blood Group</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Location</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Contact</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {eligibleDonors.map((donor, index) => (
                                            <tr key={donor.id || index} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{donor.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded text-xs">
                                                        {donor.bloodGroup}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{donor.city}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{donor.phone}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded border border-green-100">
                                                        Eligible
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRequests;
