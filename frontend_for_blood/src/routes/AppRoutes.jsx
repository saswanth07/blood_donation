import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Landing from '../pages/Landing';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import DonorManagement from '../pages/admin/DonorManagement';
import HospitalManagement from '../pages/admin/HospitalManagement';
import RequestMonitoring from '../pages/admin/RequestMonitoring';
import DonationMonitoring from '../pages/admin/DonationMonitoring';
import DonorProfile from '../pages/donor/DonorProfile';
import EligibleRequests from '../pages/donor/EligibleRequests';
import DonationHistory from '../pages/donor/DonationHistory';
import HospitalDashboard from '../pages/hospital/HospitalDashboard';
import HospitalProfile from '../pages/hospital/HospitalProfile';
import CreateRequest from '../pages/hospital/CreateRequest';
import ManageRequests from '../pages/hospital/ManageRequests';
import DonationApprovals from '../pages/hospital/DonationApprovals';
import DonorDashboard from '../pages/donor/DonorDashboard';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Landing />} />

            {/* Donor Routes */}
            <Route path="/donor/*" element={
                <ProtectedRoute allowedRoles={['DONOR']}>
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<DonorDashboard />} />
                            <Route path="profile" element={<DonorProfile />} />
                            <Route path="requests" element={<EligibleRequests />} />
                            <Route path="history" element={<DonationHistory />} />
                        </Routes>
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Hospital Routes */}
            <Route path="/hospital/*" element={
                <ProtectedRoute allowedRoles={['HOSPITAL']}>
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<HospitalDashboard />} />
                            <Route path="profile" element={<HospitalProfile />} />
                            <Route path="create-request" element={<CreateRequest />} />
                            <Route path="requests" element={<ManageRequests />} />
                            <Route path="approvals" element={<DonationApprovals />} />
                        </Routes>
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DashboardLayout>
                        <Routes>
                            <Route index element={<AdminDashboard />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="donors" element={<DonorManagement />} />
                            <Route path="hospitals" element={<HospitalManagement />} />
                            <Route path="requests" element={<RequestMonitoring />} />
                            {/* Note: Don't link donation monitoring yet if sidebar doesn't have it, but routes can exist. 
                                Wait, Sidebar has: Users, Donors, Hospitals, Requests. 
                                'Donations' is not in sidebar menu I wrote in DashboardLayout. 
                                I'll skip adding Monitoring to sidebar for now or add it there. 
                                I'll add the route anyway.
                            */}
                            <Route path="donations" element={<DonationMonitoring />} />
                        </Routes>
                    </DashboardLayout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
