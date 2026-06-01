import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { Clock, CheckCircle, XCircle, History } from 'lucide-react';

const DonationHistory = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await apiClient.get(API_ENDPOINTS.DONOR.MY_DONATIONS);
                setDonations(response.data);
            } catch (err) {
                setError('Failed to load donation history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
            case 'REJECTED': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) return <div className="text-center p-8">Loading history...</div>;
    if (error) return <div className="text-red-600 p-8">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <History className="text-red-500" /> Donation History
            </h2>

            {donations.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <p className="text-gray-500">You haven't made any donations yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Request ID</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Blood Group</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {donations.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{donation.requestId}</td>
                                        <td className="px-6 py-4">{donation.bloodGroup}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(donation.donationDate || Date.now()).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(donation.status)}`}>
                                                {getStatusIcon(donation.status)}
                                                {donation.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationHistory;
