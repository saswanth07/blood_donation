import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { Activity, Droplet, Heart, CheckCircle, XCircle, FileText, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts';
import { CardSkeleton, ChartSkeleton } from '../../components/common/Skeleton';

const HospitalDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get(API_ENDPOINTS.HOSPITAL.MY_REQUESTS);
                const requests = response.data || [];
                console.log("Hospital Dashboard Requests:", requests);

                const statsData = {
                    totalRequests: requests.length,
                    approved: requests.filter(r => r.status === 'COMPLETED' || r.status === 'ACCEPTED').length,
                    rejected: requests.filter(r => r.status === 'EXPIRED' || r.status === 'REJECTED').length,
                    pending: requests.filter(r => r.status === 'OPEN').length,
                    byGroup: requests.reduce((acc, curr) => {
                        acc[curr.bloodGroup] = (acc[curr.bloodGroup] || 0) + (curr.unitsRequired || 0);
                        return acc;
                    }, {})
                };
                setStats(statsData);
            } catch (err) {
                console.error('Failed to load stats', err);
                setError('Failed to load statistics.');
                setStats({
                    totalRequests: 0, approved: 0, rejected: 0, pending: 0, byGroup: {}
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="max-w-7xl mx-auto animate-fade-in space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-5 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass rounded-3xl p-8 border border-gray-100 shadow-sm h-[300px] flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full border-8 border-gray-100 animate-pulse"></div>
                </div>
                <div className="lg:col-span-2">
                    <ChartSkeleton />
                </div>
            </div>
        </div>
    );

    // Prepare chart data from stats
    const requestStatusData = [
        { name: 'Approved', value: stats?.approved || 0, color: '#10b981' },
        { name: 'Pending', value: stats?.pending || 0, color: '#f59e0b' },
        { name: 'Rejected', value: stats?.rejected || 0, color: '#ef4444' }
    ];

    // Convert byGroup object to array for chart, filtering out zero values if needed
    const bloodGroupData = Object.entries(stats?.byGroup || {}).map(([name, value]) => ({
        name,
        value,
        color: name.includes('+') ? '#ef4444' : '#f87171' // Slightly different reds for +/-
    })).sort((a, b) => b.value - a.value);

    return (
        <div className="max-w-7xl mx-auto animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold text-gradient mb-2">Hospital Dashboard</h2>
                    <p className="text-gray-600">Overview of blood requests and donation activities</p>
                </div>
                <div className="hidden md:block">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
                        Download Report
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-blood-500 text-red-700 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass rounded-2xl p-6 card-hover group cursor-default relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.totalRequests || 0}</h3>
                        <p className="text-gray-500 text-sm font-medium">Total Requests</p>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 card-hover group cursor-default relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                <CheckCircle size={20} />
                            </div>
                            <span className="text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full">+5%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.approved || 0}</h3>
                        <p className="text-gray-500 text-sm font-medium">Successful</p>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 card-hover group cursor-default relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center animate-pulse">
                                <Activity size={20} />
                            </div>
                            <span className="text-xs font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.pending || 0}</h3>
                        <p className="text-gray-500 text-sm font-medium">Pending Review</p>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 card-hover group cursor-default relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                <XCircle size={20} />
                            </div>
                            <span className="text-xs font-bold bg-red-50 text-red-600 px-2 py-1 rounded-full">-2%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.rejected || 0}</h3>
                        <p className="text-gray-500 text-sm font-medium">Unfulfilled</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Distribution - Pie Chart */}
                <div className="glass rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 w-full text-left">Request Status Overview</h3>
                    <div className="h-[250px] w-full relative" style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer width="99%" height="100%">
                            <PieChart>
                                <Pie
                                    data={requestStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {requestStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Metric */}
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none pb-8">
                            <span className="text-3xl font-bold text-gray-900">{((stats?.approved / (stats?.totalRequests || 1)) * 100).toFixed(0)}%</span>
                            <span className="text-xs text-gray-500 font-medium">Success Rate</span>
                        </div>
                    </div>
                </div>

                {/* Blood Group Demand - Bar Chart */}
                <div className="lg:col-span-2 glass rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Blood Demand Analysis</h3>
                            <p className="text-sm text-gray-500">Units requested per blood group</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600">
                                <Info size={12} /> Live Data
                            </span>
                        </div>
                    </div>

                    {bloodGroupData.length > 0 ? (
                        <div className="h-[300px] w-full" style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="99%" height="100%">
                                <BarChart data={bloodGroupData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f3f4f6', radius: 4 }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" name="Units" radius={[6, 6, 0, 0]} barSize={40}>
                                        {bloodGroupData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] w-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            <TrendingUp size={40} className="mb-2 opacity-50" />
                            <p>No data available yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
