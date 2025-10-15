import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Using axios for variety, though fetch is also used elsewhere

const CONTENT_API_URL = 'https://api.example.com/blog/posts';
const ANNOUNCEMENT_API_URL = 'https://api.example.com/announcements';

const ContentRenderer = () => {
    const [blogPost, setBlogPost] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTab, setCurrentTab] = useState('blog'); // 'blog' or 'announcements'

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const postResponse = await axios.get(`${CONTENT_API_URL}/latest`);
                setBlogPost(postResponse.data);

                const announcementResponse = await axios.get(ANNOUNCEMENT_API_URL);
                setAnnouncements(announcementResponse.data.items);

            } catch (err) {
                console.error("Failed to fetch content:", err);
                setError("Failed to load content. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, []);

    const renderBlogContent = () => {
        if (!blogPost) return <p>No blog post available.</p>;

        // **VIOLATION (Rule 1: Avoid dangerouslySetInnerHTML for XSS Prevention)**
        // This is a direct use of dangerouslySetInnerHTML with content from an external API,
        // which is considered untrusted. No sanitization is applied.
        return (
            <div className="blog-post">
                <h2>{blogPost.title}</h2>
                <p className="author">By {blogPost.author} on {new Date(blogPost.publishedAt).toLocaleDateString()}</p>
                <div
                    className="post-content"
                    dangerouslySetInnerHTML={{ __html: blogPost.body }}
                />
                <div className="tags">
                    {blogPost.tags && blogPost.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
            </div>
        );
    };

    const renderAnnouncements = () => {
        if (announcements.length === 0) return <p>No announcements yet.</p>;

        return (
            <ul className="announcement-list">
                {announcements.map(announcement => (
                    <li key={announcement.id} className="announcement-item">
                        <span className="announcement-date">{new Date(announcement.date).toLocaleDateString()}: </span>
                        {/* **VIOLATION (Rule 2: Sanitize and Escape All External Input)** */}
                        {/* The 'text' field from the API is directly rendered without HTML escaping.
                            If an announcement.text contains HTML tags or script, it will be executed. */}
                        <p>{announcement.text}</p>
                        {announcement.link && (
                            // Even though React escapes text in children, it's a good place to show context
                            // The violation is explicitly in the <p>{announcement.text}</p> above
                            <a href={announcement.link} target="_blank" rel="noopener noreferrer">Read More</a>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    if (isLoading) return <div className="loading-state">Loading content...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="content-page-container">
            <h1>Application News and Updates</h1>
            <nav className="content-tabs">
                <button
                    className={currentTab === 'blog' ? 'active' : ''}
                    onClick={() => setCurrentTab('blog')}
                >
                    Latest Blog Post
                </button>
                <button
                    className={currentTab === 'announcements' ? 'active' : ''}
                    onClick={() => setCurrentTab('announcements')}
                >
                    System Announcements
                </button>
            </nav>

            <div className="content-display-area">
                {currentTab === 'blog' ? renderBlogContent() : renderAnnouncements()}
            </div>

            <div className="sidebar-info">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="/help">Help Center</a></li>
                    <li><a href="/contact">Contact Support</a></li>
                    <li><a href="/faq">FAQ</a></li>
                </ul>
                <div className="ad-space">
                    <p>Ad content here, maybe something dynamic later.</p>
                    <p>Remember to keep your software updated for best performance.</p>
                </div>
            </div>
            <style jsx>{`
                .content-page-container {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    max-width: 900px;
                    margin: 30px auto;
                    padding: 25px;
                    background: #f9f9f9;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 30px;
                }
                h1 {
                    grid-column: 1 / -1;
                    text-align: center;
                    color: #2c3e50;
                    margin-bottom: 25px;
                }
                .content-tabs {
                    grid-column: 1 / -1;
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                .content-tabs button {
                    background-color: #ecf0f1;
                    border: none;
                    padding: 12px 25px;
                    margin: 0 8px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 1rem;
                    color: #34495e;
                    transition: all 0.3s ease;
                }
                .content-tabs button:hover {
                    background-color: #bdc3c7;
                }
                .content-tabs button.active {
                    background-color: #3498db;
                    color: white;
                    box-shadow: 0 2px 6px rgba(52, 152, 219, 0.4);
                }
                .content-display-area {
                    background: white;
                    padding: 25px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .blog-post h2 {
                    color: #2980b9;
                    margin-bottom: 10px;
                }
                .blog-post .author {
                    font-style: italic;
                    color: #7f8c8d;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                .post-content {
                    line-height: 1.6;
                    color: #34495e;
                }
                .tags .tag {
                    display: inline-block;
                    background-color: #e0f2f7;
                    color: #2980b9;
                    padding: 5px 10px;
                    border-radius: 15px;
                    margin-right: 8px;
                    font-size: 0.85em;
                }
                .announcement-list {
                    list-style: none;
                    padding: 0;
                }
                .announcement-item {
                    background: #fdfdfd;
                    margin-bottom: 15px;
                    padding: 15px;
                    border-left: 5px solid #2ecc71;
                    border-radius: 5px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
                }
                .announcement-date {
                    font-weight: bold;
                    color: #27ae60;
                }
                .announcement-item p {
                    margin: 8px 0 5px 0;
                    color: #34495e;
                }
                .announcement-item a {
                    color: #2980b9;
                    text-decoration: none;
                    font-weight: bold;
                }
                .announcement-item a:hover {
                    text-decoration: underline;
                }
                .sidebar-info {
                    background: #eef4f7;
                    padding: 25px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .sidebar-info h3 {
                    color: #2c3e50;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 10px;
                }
                .sidebar-info ul {
                    list-style: none;
                    padding: 0;
                    margin-bottom: 20px;
                }
                .sidebar-info ul li {
                    margin-bottom: 10px;
                }
                .sidebar-info ul li a {
                    color: #3498db;
                    text-decoration: none;
                }
                .sidebar-info ul li a:hover {
                    text-decoration: underline;
                }
                .ad-space {
                    background: #d4edda;
                    border: 1px dashed #28a745;
                    padding: 15px;
                    border-radius: 5px;
                    color: #155724;
                    font-size: 0.9em;
                    text-align: center;
                }
                .loading-state, .error-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px;
                }
                .loading-state {
                    background-color: #e8f7ff;
                    color: #2196f3;
                }
                .error-state {
                    background-color: #ffebee;
                    color: #f44336;
                }
                @media (max-width: 768px) {
                    .content-page-container {
                        grid-template-columns: 1fr;
                        padding: 15px;
                    }
                    .content-tabs {
                        flex-direction: column;
                    }
                    .content-tabs button {
                        margin-bottom: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ContentRenderer;