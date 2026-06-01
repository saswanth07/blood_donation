export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
    DONOR: {
        ME: '/api/donors/me',
        UPDATE_PROFILE: '/api/donors/profile',
        REQUESTS: (requestId) => requestId ? `/api/donations/requests/${requestId}/respond` : '/api/hospital/requests/allrequest',
        MY_DONATIONS: '/api/donations/my',
    },
    HOSPITAL: {
        CREATE_REQUEST: '/api/hospital/requests',
        MY_REQUESTS: '/api/hospital/requests/allrequest',
        ELIGIBLE_DONORS: (requestId) => `/api/hospital/requests/${requestId}/eligible-donors`,
        DECISION: (donationId) => `/api/donations/${donationId}/decision`,
        PENDING_APPROVALS: '/api/donations/hospital/pending',
        STATS: '/api/donations/stats',
    },
    ADMIN: {
        USERS: '/api/admin/users',
        ACTIVATE_USER: (userId) => `/api/admin/users/${userId}/activate`,
        DEACTIVATE_USER: (userId) => `/api/admin/users/${userId}/deactivate`,
        DONORS: '/api/admin/donors',
        DISABLE_DONOR: (donorId) => `/api/admin/donors/${donorId}/disable`,
        ENABLE_DONOR: (donorId) => `/api/admin/donors/${donorId}/enable`,
        HOSPITALS: '/api/admin/hospitals',
        ACTIVATE_HOSPITAL: (hospitalId) => `/api/admin/hospitals/${hospitalId}/activate`,
        DEACTIVATE_HOSPITAL: (hospitalId) => `/api/admin/hospitals/${hospitalId}/deactivate`,
        REQUESTS: '/api/admin/requests',
        CLOSE_REQUEST: (requestId) => `/api/admin/requests/${requestId}/close`,
        DONATIONS: '/api/admin/donations',
        STATS: '/api/admin/stats',
    }
};
