// app.d.ts
// This file defines global types for the application.

interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
    settings: UserSettings;
    createdAt: string;
    lastLogin: string;
}

interface UserSettings {
    theme: 'light' | 'dark';
    notificationsEnabled: boolean;
    language: 'en' | 'es' | 'fr';
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
}

interface Order {
    id: string;
    userId: string;
    products: { productId: string; quantity: number }[];
    totalAmount: number;
    orderDate: string;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

interface Notification {
    id: string;
    userId: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    createdAt: string;
    status: 'read' | 'unread';
}

// Global application state types (if using a state management library like Redux Toolkit)
interface AppState {
    user: UserProfile | null;
    products: Product[];
    orders: Order[];
    notifications: Notification[];
    isLoading: boolean;
    error: string | null;
}

// Example for API responses
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errorCode?: number;
}