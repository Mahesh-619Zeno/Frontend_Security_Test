import React from 'react';
import UserProfileComponent from './components/UserProfile';
import ContentRenderer from './components/ContentRenderer';

// A mock user ID for demonstration purposes
const MOCK_USER_ID = 'user-123abc';

function App() {
    const handleProfileUpdate = (updatedProfile) => {
        console.log('Profile updated:', updatedProfile);
        // In a real app, you might re-fetch global state or show a notification
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to Our Application</h1>
                <nav className="main-nav">
                    <a href="#dashboard">Dashboard</a>
                    <a href="#profile">Profile</a>
                    <a href="#news">News</a>
                    <a href="#settings">Settings</a>
                </nav>
            </header>
            <main className="App-main">
                <section id="profile" className="main-section">
                    <h2>User Profile</h2>
                    {/* The UserProfileComponent will fetch and display user data */}
                    <UserProfileComponent userId={MOCK_USER_ID} onProfileUpdate={handleProfileUpdate} />
                </section>
                <section id="news" className="main-section">
                    <h2>Latest Updates & Announcements</h2>
                    {/* The ContentRenderer will display blog posts and announcements */}
                    <ContentRenderer />
                </section>
                {/* Other sections could go here */}
            </main>
            <footer className="App-footer">
                <p>&copy; 2023 MyCompany. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                </div>
            </footer>

            <style jsx>{`
                .App {
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f7f6;
                }
                .App-header {
                    background-color: #2c3e50;
                    color: white;
                    padding: 20px 0;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                .App-header h1 {
                    margin-bottom: 10px;
                }
                .main-nav a {
                    color: white;
                    text-decoration: none;
                    margin: 0 15px;
                    font-weight: bold;
                    transition: color 0.3s ease;
                }
                .main-nav a:hover {
                    color: #e0f2f7;
                }
                .App-main {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 20px auto;
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 30px;
                }
                .main-section {
                    background-color: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                }
                .main-section h2 {
                    color: #2c3e50;
                    margin-top: 0;
                    margin-bottom: 25px;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 10px;
                }
                .App-footer {
                    background-color: #2c3e50;
                    color: #ecf0f1;
                    text-align: center;
                    padding: 20px 0;
                    margin-top: 30px;
                    font-size: 0.9em;
                }
                .App-footer .footer-links a {
                    color: #ecf0f1;
                    text-decoration: none;
                    margin: 0 10px;
                }
                .App-footer .footer-links a:hover {
                    text-decoration: underline;
                }

                @media (min-width: 768px) {
                    .App-main {
                        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
                    }
                }
            `}</style>
        </div>
    );
}

export default App;