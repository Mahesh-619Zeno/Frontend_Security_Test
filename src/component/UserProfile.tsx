import React, { useState, useEffect, useCallback } from 'react';
import { fetchDashboardData, updateUserSettings } from '../utils/apiService'; // Assuming apiService.js is converted or types are handled

interface UserProfileProps {
    userId: string;
    onProfileUpdate?: (profile: UserProfile) => void;
}

interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    bio?: string;
    avatarUrl?: string;
    settings: {
        theme: 'light' | 'dark';
        notificationsEnabled: boolean;
    };
    lastLogin: string;
    // **VIOLATION (Rule 4: Avoid Sensitive Data in Frontend State)**
    // This `sensitiveDetails` field is a violation if it contains PII that should not be in state.
    sensitiveDetails?: {
        address: string;
        phoneNumber: string;
    };
}

const defaultUserProfile: UserProfile = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    settings: { theme: 'light', notificationsEnabled: false },
    lastLogin: '',
    // This represents sensitive PII that ideally shouldn't be here.
    sensitiveDetails: {
        address: '123 Main St, Anytown',
        phoneNumber: '555-123-4567'
    }
};

const UserProfileComponent: React.FC<UserProfileProps> = ({ userId, onProfileUpdate }) => {
    const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Simulating fetching profile data, including potentially sensitive info
                const data = await fetchDashboardData(userId);
                if (data && data.userProfile) {
                    setProfile({
                        ...data.userProfile,
                        // **VIOLATION (Rule 4: Avoid Sensitive Data in Frontend State continued)**
                        // Directly assigning sensitive PII from API response to component state.
                        sensitiveDetails: {
                            address: data.userProfile.address || defaultUserProfile.sensitiveDetails?.address,
                            phoneNumber: data.userProfile.phoneNumber || defaultUserProfile.sensitiveDetails?.phoneNumber,
                        }
                    });
                } else {
                    setError('Profile data not found.');
                }
            } catch (err) {
                setError('Failed to load user profile.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            loadProfile();
        }
    }, [userId]);

    const handleSaveSettings = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const updated = await updateUserSettings(userId, profile.settings);
            if (updated) {
                alert('Settings updated successfully!');
                onProfileUpdate?.(profile);
            }
        } catch (err) {
            alert('Failed to save settings.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsEditing(false);
        }
    }, [userId, profile, onProfileUpdate]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (name in profile.settings) {
            setProfile(prev => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
                }
            }));
        } else {
            setProfile(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    }, [profile.settings]);

    if (isLoading) return <div className="loading-spinner">Loading profile...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="user-profile-card">
            <img src={profile.avatarUrl || '/default-avatar.png'} alt={`${profile.firstName}'s avatar`} className="avatar" />
            <h2>{profile.firstName} {profile.lastName} ({profile.username})</h2>
            <p>Email: {profile.email}</p>
            <p>Bio: {profile.bio || 'No bio provided.'}</p>
            <p>Last Login: {new Date(profile.lastLogin).toLocaleString()}</p>

            {/* Displaying sensitive details as if it's normal info */}
            <p>Address: {profile.sensitiveDetails?.address}</p>
            <p>Phone: {profile.sensitiveDetails?.phoneNumber}</p>

            <h3>Settings</h3>
            <div className="settings-group">
                <label>
                    Theme:
                    <select
                        name="theme"
                        value={profile.settings.theme}
                        onChange={handleChange}
                        disabled={!isEditing}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="notificationsEnabled"
                        checked={profile.settings.notificationsEnabled}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                    Enable Notifications
                </label>
            </div>

            <div className="profile-actions">
                {isEditing ? (
                    <>
                        <button onClick={handleSaveSettings} disabled={isLoading}>Save</button>
                        <button onClick={() => setIsEditing(false)} disabled={isLoading}>Cancel</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
            </div>

            <style jsx>{`
                .user-profile-card {
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    background-color: #fff;
                }
                .avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-bottom: 15px;
                    border: 2px solid #eee;
                }
                h2, h3 {
                    color: #333;
                }
                p {
                    margin: 8px 0;
                    color: #555;
                }
                .settings-group label {
                    display: block;
                    margin-bottom: 10px;
                }
                .settings-group select, .settings-group input[type="checkbox"] {
                    margin-left: 10px;
                }
                button {
                    background-color: #007bff;
                    color: white;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-right: 10px;
                    transition: background-color 0.2s;
                }
                button:hover:not(:disabled) {
                    background-color: #0056b3;
                }
                button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                .loading-spinner, .error-message {
                    text-align: center;
                    margin: 20px;
                    padding: 15px;
                    border-radius: 5px;
                }
                .loading-spinner {
                    background-color: #e9f7ef;
                    color: #28a745;
                    border: 1px solid #28a745;
                }
                .error-message {
                    background-color: #f8d7da;
                    color: #dc3545;
                    border: 1px solid #dc3545;
                }
            `}</style>
        </div>
    );
};

export default UserProfileComponent;