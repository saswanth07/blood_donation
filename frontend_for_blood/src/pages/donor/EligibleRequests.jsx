import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { Clock, MapPin, Droplet, CheckCircle, XCircle } from 'lucide-react';

const EligibleRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null);

    // Fetch requests and profile to check eligibility
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestsRes, profileRes] = await Promise.all([
                    apiClient.get(API_ENDPOINTS.DONOR.REQUESTS()),
                    apiClient.get(API_ENDPOINTS.DONOR.ME)
                ]);

                const donorGroup = profileRes.data.bloodGroup;

                // Blood Compatibility Logic (Donor -> Recipient)
                const isCompatible = (donor, recipient) => {
                    const matrix = {
                        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
                        'O+': ['O+', 'A+', 'B+', 'AB+'],
                        'A-': ['A-', 'A+', 'AB-', 'AB+'],
                        'A+': ['A+', 'AB+'],
                        'B-': ['B-', 'B+', 'AB-', 'AB+'],
                        'B+': ['B+', 'AB+'],
                        'AB-': ['AB-', 'AB+'],
                        'AB+': ['AB+']
                    };
                    return matrix[donor]?.includes(recipient);
                };

                // Filter: Status is OPEN AND (Donor is Compatible OR Donor Group is Unknown/Missing)
                const eligibleRequests = requestsRes.data.filter(r =>
                    r.status === 'OPEN' && (!donorGroup || donorGroup === 'Unknown' || isCompatible(donorGroup, r.bloodGroup))
                );

                setRequests(eligibleRequests);
                setProfile(profileRes.data);

                if (!donorGroup || donorGroup === 'Unknown') {
                    setError('Warning: Your Blood Group is missing. Showing ALL requests for testing.');
                }
            } catch (err) {
                console.error(err);
                const status = err.response?.status;
                const msg = err.response?.data?.message || err.message || 'Failed to load blood requests';
                const details = JSON.stringify(err.response?.data || {});
                setError(`Error ${status}: ${msg} ${details !== '{}' ? details : ''}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApply = async (requestId) => {
        try {
            await apiClient.post(API_ENDPOINTS.DONOR.REQUESTS(requestId), null, { params: { accept: true } });
            alert('Application sent successfully!');
            // Refresh list or remove item
            setRequests(requests.filter(r => r.id !== requestId));
        } catch (err) {
            alert('Failed to apply. Please try again.');
        }
    };

    const handleReject = async (requestId) => {
        try {
            await apiClient.post(API_ENDPOINTS.DONOR.REQUESTS(requestId), null, { params: { accept: false } });
            alert('Request rejected.');
            setRequests(requests.filter(r => r.id !== requestId));
        } catch (err) {
            console.error(err);
            alert('Failed to reject. Please try again.');
        }
    };

    if (loading) return <div className="text-center p-8">Loading requests...</div>;
    if (error) return <div className="text-red-600 p-8">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-gradient mb-2">Eligible Blood Requests</h2>
                <p className="text-gray-600">View and respond to blood requests matching your blood group</p>
            </div>

            {requests.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Droplet className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No matching open requests found at the moment.</p>
                    <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities to save lives!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request, index) => (
                        <div
                            key={request.id}
                            className={`glass rounded-2xl p-6 card-hover animate-slide-up border-2 ${request.urgency === 'HIGH' ? 'border-red-300 animate-glow' :
                                    request.urgency === 'MEDIUM' ? 'border-yellow-300' :
                                        'border-blue-300'
                                }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Urgency Badge */}
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${request.urgency === 'HIGH' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' :
                                        request.urgency === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white' :
                                            'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                    }`}>
                                    {request.urgency} URGENCY
                                </span>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {new Date(request.expiryDate).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Blood Group */}
                            <div className="mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-14 h-14 bg-gradient-blood rounded-xl flex items-center justify-center shadow-lg">
                                        <Droplet className="w-7 h-7 text-white fill-current" />
                                    </div>
                                    <div>
                                        <span className="text-3xl font-bold text-gray-900">{request.bloodGroup}</span>
                                        <p className="text-sm text-gray-500">{request.unitsRequired} Units Needed</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm font-medium">{request.city}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => handleApply(request.id)}
                                    disabled={!profile?.eligible}
                                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${profile?.eligible
                                            ? 'bg-gradient-blood text-white hover:shadow-lg hover:scale-105'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {profile?.eligible ? (
                                        <>
                                            <CheckCircle size={16} /> Donate
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={16} /> Ineligible
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleReject(request.id)}
                                    disabled={!profile?.eligible}
                                    className="px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <XCircle size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EligibleRequests;
