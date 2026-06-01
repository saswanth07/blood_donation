import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { Check, X, Clock, User, Droplet } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { TableRowSkeleton } from '../../components/common/Skeleton';

const DonationApprovals = () => {
    const [loading, setLoading] = useState(true);
    const [donations, setDonations] = useState([]);
    const toast = useToast();

    useEffect(() => {
        fetchPendingDonations();
    }, []);

    const fetchPendingDonations = async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.HOSPITAL.PENDING_APPROVALS);
            setDonations(response.data);
        } catch (err) {
            // console.error('Failed to load donations', err);
            // Silent fail often better for mock/incomplete backend
        } finally {
            // Fake loading delay for smooth feel
            setTimeout(() => setLoading(false), 600);
        }
    };

    const handleDecision = async (donationId, accept) => {
        try {
            await apiClient.post(API_ENDPOINTS.HOSPITAL.DECISION(donationId), null, { params: { accept } });
            setDonations(donations.filter(d => d.id !== donationId));
            if (accept) toast.showSuccess('Donation approved successfully');
            else toast.showInfo('Donation rejected');
        } catch (err) {
            toast.showError('Action failed. Please try again.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-fade-in pb-12">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-bold text-gradient mb-2">Approvals</h2>
                    <p className="text-gray-600">Review and approve pending donor responses</p>
                </div>
                <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl text-sm font-bold border border-yellow-200 shadow-sm flex items-center gap-2">
                    <Clock size={16} /> Pending: {donations.length}
                </div>
            </div>

            <div className="glass rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Donor Details</th>
                                <th className="px-6 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider">Request Context</th>
                                <th className="px-6 py-5 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Decision</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white/60">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i}><td colSpan="3"><TableRowSkeleton /></td></tr>
                                ))
                            ) : donations.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
                                                <Check size={40} />
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h4>
                                            <p className="text-gray-500">No pending approvals waiting for your review.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                donations.map(donation => (
                                    <tr key={donation.id} className="hover:bg-yellow-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                                    {donation.donorName ? donation.donorName.charAt(0) : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{donation.donorName || 'Unknown Donor'}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock size={10} /> Applied recently
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-gray-400">REQ #{donation.requestId}</span>
                                                <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded flex items-center gap-1">
                                                    <Droplet size={10} /> {donation.requestBloodGroup}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleDecision(donation.id, false)}
                                                    className="p-3 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                                    title="Reject"
                                                >
                                                    <X size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDecision(donation.id, true)}
                                                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-200 text-white rounded-xl font-bold text-sm transition-all transform hover:scale-105 flex items-center gap-2"
                                                >
                                                    <Check size={16} /> Approve
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DonationApprovals;
