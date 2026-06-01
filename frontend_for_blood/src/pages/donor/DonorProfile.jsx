import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import { User, Droplet, MapPin, Phone, Activity, Calendar, Edit2, Mail, Shield, Camera, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DonorProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: '',
        phone: '',
        city: '',
        address: ''
    });
    const toast = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get(API_ENDPOINTS.DONOR.ME);
                setProfile(response.data);
                // Initialize form data
                setEditForm({
                    fullName: response.data.fullName || response.data.username || '',
                    phone: response.data.phone || '',
                    city: response.data.city || '',
                    address: response.data.address || ''
                });
            } catch (err) {
                console.error(err);
                const msg = err.response?.data?.message || err.message || 'Failed to load profile';
                toast.showError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [toast]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.put(API_ENDPOINTS.DONOR.UPDATE_PROFILE, editForm);

            // Update local state
            setProfile(prev => ({
                ...prev,
                fullName: editForm.fullName,
                phone: editForm.phone,
                city: editForm.city,
                address: editForm.address
            }));

            setIsEditing(false);
            toast.showSuccess('Profile updated successfully');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || 'Failed to update profile';
            toast.showError(msg);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-blood-200 border-t-blood-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!profile) return null;

    return (
        <div className="max-w-5xl mx-auto animate-fade-in relative pb-12">

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden">
                        <div className="bg-gradient-to-r from-blood-600 to-rose-500 p-6 flex justify-between items-center text-white">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Edit2 size={20} /> Edit Profile
                            </h2>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={editForm.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blood-500 focus:ring-2 focus:ring-blood-200 outline-none transition-all"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blood-500 focus:ring-2 focus:ring-blood-200 outline-none transition-all"
                                        placeholder="Phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={editForm.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blood-500 focus:ring-2 focus:ring-blood-200 outline-none transition-all"
                                        placeholder="Current city"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={editForm.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blood-500 focus:ring-2 focus:ring-blood-200 outline-none transition-all resize-none"
                                    placeholder="Enter your full address"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-blood-600 text-white hover:bg-blood-700 transition-colors shadow-lg shadow-blood-200"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cover Banner */}
            <div className="h-64 rounded-3xl bg-gradient-to-r from-blood-600 via-red-500 to-rose-400 relative overflow-hidden shadow-lg group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Edit Cover Button (Visual) */}
                <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100">
                    <Camera size={16} /> Change Cover
                </button>
            </div>

            {/* Profile Header Card */}
            <div className="relative px-6 -mt-24 mb-8">
                <div className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end gap-6 shadow-xl border-t border-white/50">

                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl p-2 shadow-lg mb-4 md:mb-0 transform transition-transform group-hover:scale-105">
                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl font-bold text-indigo-600 border border-gray-100 overflow-hidden">
                                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : (profile.username ? profile.username.charAt(0).toUpperCase() : 'U')}
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 pb-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    {profile.fullName || profile.username || 'Unknown User'}
                                    <Shield size={24} className="text-blue-500 fill-blue-100" />
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-gray-600 font-medium">
                                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                        <MapPin size={16} className="text-blood-500" /> {profile.city || 'Unknown Location'}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                        <Mail size={16} className="text-indigo-500" /> {profile.email}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <Edit2 size={18} /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">

                {/* Left Col: Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About Section */}
                    <div className="glass rounded-3xl p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <User className="text-blood-600" /> Personal Details
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Full Name</p>
                                <p className="text-lg font-medium text-gray-800">{profile.fullName || profile.username || '--'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Phone Number</p>
                                <p className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                    <Phone size={18} className="text-green-600" /> {profile.phone || '--'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">City</p>
                                <p className="text-lg font-medium text-gray-800">{profile.city || '--'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Address</p>
                                <p className="text-lg font-medium text-gray-800">{profile.address || 'No address provided'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Health Section */}
                    <div className="glass rounded-3xl p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Activity className="text-green-600" /> Health & Eligibility
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <p className="text-sm font-bold text-green-700 mb-1">Health Status</p>
                                <p className="text-lg font-bold text-gray-800">{profile.healthStatus || 'Good'}</p>
                                <p className="text-xs text-green-600 mt-1">Self-reported</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${profile.eligible ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
                                <p className={`text-sm font-bold mb-1 ${profile.eligible ? 'text-blue-700' : 'text-red-700'}`}>Eligibility</p>
                                <div className="flex items-center gap-2">
                                    {profile.eligible ? <Calendar size={20} className="text-blue-600" /> : <Calendar size={20} className="text-red-600" />}
                                    <p className="text-lg font-bold text-gray-800">{profile.eligible ? 'Ready to Donate' : 'Waiting Period'}</p>
                                </div>
                                {!profile.eligible && profile.nextEligibleDate && (
                                    <p className="text-xs text-red-600 mt-1">Next: {new Date(profile.nextEligibleDate).toLocaleDateString()}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Blood Card */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blood-600 to-rose-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:scale-110 transition-transform"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-8 -mb-8 blur-2xl group-hover:scale-110 transition-transform"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <h3 className="text-lg font-semibold text-red-100 mb-6 uppercase tracking-widest">Medical ID</h3>

                            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-inner">
                                <Droplet size={48} className="fill-white" />
                            </div>

                            <div className="mb-8">
                                <p className="text-6xl font-bold mb-2 text-white drop-shadow-md">{profile.bloodGroup}</p>
                                <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">Blood Group</span>
                            </div>

                            <div className="w-full pt-6 border-t border-white/20 flex justify-between text-sm font-medium">
                                <span className="text-red-100">Donation ID</span>
                                <span className="font-mono">#DN-{profile.id?.toString().padStart(6, '0')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Shield className="text-yellow-400" /> Impact Score
                        </h3>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-bold">12</span>
                            <span className="text-gray-400 mb-1">lives saved</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-yellow-400 h-full w-[40%]"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Level 3 Donor - Keep going!</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DonorProfile;
