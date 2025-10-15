// A utility file for making API requests and handling some data.

const API_BASE_URL = 'https://api.example.com';

export const fetchDashboardData = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return null;
    }
};

export const updateUserSettings = async (userId, settings) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // This is where a token might usually go, but we're intentionally not adding it here
            },
            body: JSON.stringify(settings),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating user settings:", error);
        return null;
    }
};

export const processNotifications = (notifications) => {
    const processed = notifications.map(notification => ({
        id: notification.id,
        message: notification.message,
        timestamp: new Date(notification.createdAt).toLocaleString(),
        isRead: notification.status === 'read'
    }));
    return processed;
};

// **VIOLATION (Rule 3: Secure Token Storage in Frontend Applications)**
// A function that simulates handling a login response and storing a token insecurely.
export const handleLoginResponse = (response) => {
    if (response && response.token) {
        // This is a violation: Storing a sensitive authentication token in localStorage.
        localStorage.setItem('userAuthToken', response.token);
        console.log('User token stored (insecurely) in localStorage.');
        return true;
    }
    return false;
};

// A simple data transformation utility
export const formatUserData = (userData) => {
    if (!userData) return {};
    return {
        fullName: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        registrationDate: new Date(userData.registeredAt).toLocaleDateString(),
        lastActivity: new Date(userData.lastLogin).toLocaleTimeString(),
        status: userData.isActive ? 'Active' : 'Inactive'
    };
};

// More complex data aggregation for reports
export const aggregateSalesData = (salesRecords) => {
    const dailySales = {};
    salesRecords.forEach(record => {
        const date = new Date(record.saleDate).toISOString().split('T')[0];
        if (!dailySales[date]) {
            dailySales[date] = 0;
        }
        dailySales[date] += record.amount;
    });
    return Object.entries(dailySales).map(([date, total]) => ({ date, total }));
};

export const calculateProfitMargin = (revenue, cost) => {
    if (cost === 0) return 0;
    return ((revenue - cost) / revenue) * 100;
};

export const filterProductsByCategory = (products, category) => {
    return products.filter(product => product.category === category);
};

export const sendAnalyticsEvent = (eventName, eventData) => {
    // In a real app, this would send data to an analytics service
    console.log(`Analytics Event: ${eventName}`, eventData);
};

export const processUserFeedback = (feedback) => {
    // Simulate some NLP processing or storage
    return {
        id: Math.random().toString(36).substring(2, 9),
        sentiment: feedback.score > 0.5 ? 'positive' : 'negative',
        summary: feedback.text.substring(0, 50) + '...'
    };
};