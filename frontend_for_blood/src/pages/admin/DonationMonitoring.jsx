import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { Heart } from 'lucide-react';

const DonationMonitoring = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ADMIN.DONATIONS);
            setDonations(response.data);
        } catch (err) {
            console.error(err);
            setDonations([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading donations...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Heart className="text-red-500" /> Donation Monitoring
            </h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Donation ID</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Request ID</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Donor</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {donations.map(d => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-500">#{d.id}</td>
                                    <td className="px-6 py-4">#{d.requestId}</td>
                                    <td className="px-6 py-4 font-medium">{d.donorName || 'Unknown'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${d.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                d.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(d.donationDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DonationMonitoring;
