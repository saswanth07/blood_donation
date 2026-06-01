import React, { useEffect, useState } from 'react';
import { Heart, Activity, Calendar, TrendingUp, Clock, Award, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CardSkeleton, ChartSkeleton } from '../../components/common/Skeleton';

import { useAuth } from '../../context/AuthContext'; // Import useAuth to potentially use token or handle logout if needed
import { useToast } from '../../context/ToastContext'; // Assuming you have useToast hook imported or available

const DonorDashboard = () => {
    // Mock user data for now - could be fetched from API
    const [stats, setStats] = useState({
        totalDonations: 0,
        livesImpacted: 0,
        nextEligibleDate: null
    });

    const [loading, setLoading] = useState(true);
    const toast = useToast(); // Assuming you have useToast hook imported or available

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch profile to get eligible date and stats (if backend provided stats)
                // Currently backend doesn't provide stats in /me, but we can get nextEligibleDate
                const profileResponse = await apiClient.get(API_ENDPOINTS.DONOR.ME);

                // For now, hardcode stats as backend doesn't send them yet, but use real date
                // Ideally, we should have a dashboard-stats endpoint
                setStats({
                    totalDonations: profileResponse.data.totalDonations || 0,
                    livesImpacted: 0,  // Placeholder until backend support
                    nextEligibleDate: profileResponse.data.nextEligibleDate
                });
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                toast.showError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-5 w-80 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6 lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
                    </div>
                    <ChartSkeleton />
                </div>
                <div className="space-y-6">
                    <div className="h-64 rounded-3xl bg-gray-200 animate-pulse"></div>
                    <div className="h-24 rounded-3xl bg-gray-200 animate-pulse"></div>
                </div>
            </div>
        </div>
    );

    // Mock data for donation history chart
    const donationData = [
        { month: 'Jan', count: 0 },
        { month: 'Feb', count: 0 },
        { month: 'Mar', count: 0 },
        { month: 'Apr', count: 1 },
        { month: 'May', count: 0 },
        { month: 'Jun', count: 1 },
    ];

    return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-gradient mb-2">My Dashboard</h2>
                    <p className="text-gray-600">Welcome back, Hero! Here's your impact journey.</p>
                </div>
                <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-gray-600 shadow-sm border border-gray-100">
                    <Clock size={16} className="text-blood-600" />
                    Next Eligible: <span className="text-gray-900">
                        {stats.nextEligibleDate ? new Date(stats.nextEligibleDate).toLocaleDateString('en-GB') : 'Loading...'}
                    </span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Stats & Actions */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="glass rounded-3xl p-6 card-hover relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-red-100 to-transparent rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                    <Heart className="fill-current" />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">{stats.totalDonations}</h3>
                                <p className="text-gray-500 font-medium text-sm">Total Donations</p>
                            </div>
                        </div>

                        <div className="glass rounded-3xl p-6 card-hover relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                    <TrendingUp />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">{stats.livesImpacted}</h3>
                                <p className="text-gray-500 font-medium text-sm">Lives Impacted</p>
                            </div>
                        </div>

                        <div className="glass rounded-3xl p-6 card-hover relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-transparent rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                    <Award />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">Bronze</h3>
                                <p className="text-gray-500 font-medium text-sm">Donor Level</p>
                            </div>
                        </div>
                    </div>

                    {/* Impact Chart */}
                    <div className="glass rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-800">My Donation Journey</h3>
                            <select className="bg-gray-50 border-none text-sm font-semibold text-gray-600 rounded-lg px-3 py-1 outline-none cursor-pointer hover:bg-gray-100">
                                <option>Last 6 Months</option>
                                <option>Year to Date</option>
                            </select>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={donationData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickCount={5} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ stroke: '#dc2626', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={3} fill="url(#colorDonations)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: CTA & Feed */}
                <div className="space-y-6">
                    {/* Primary CTA */}
                    <div className="relative rounded-3xl overflow-hidden shadow-xl group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-700 transition-transform duration-500 group-hover:scale-105"></div>
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                        <div className="relative z-10 p-8 text-white">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                                <Heart className="w-7 h-7 fill-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Save a Life Today</h3>
                            <p className="text-red-100 mb-8 leading-relaxed">There are 12 urgent requests in your city matching your blood group.</p>

                            <Link to="/donor/requests" className="block w-full py-4 bg-white text-red-600 text-center font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
                                View Requests
                            </Link>
                        </div>
                    </div>

                    {/* Secondary Actions */}
                    <Link to="/donor/history" className="glass p-6 rounded-3xl flex items-center justify-between group card-hover border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">Donation History</h4>
                                <p className="text-xs text-gray-500">View certificates</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                            <ChevronRight size={20} />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
