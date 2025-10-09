import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import './Analytics.css';

const API_KEY = '9b43e514e660bd3937b2372cd7ee1f7d47a53889c31f0d264e95d04135fe2abe';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function Analytics() {
    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authKey, setAuthKey] = useState('');
    const [authError, setAuthError] = useState('');

    const [summary, setSummary] = useState(null);
    const [topPages, setTopPages] = useState([]);
    const [countries, setCountries] = useState([]);
    const [browsers, setBrowsers] = useState([]);
    const [devices, setDevices] = useState([]);
    const [recentContacts, setRecentContacts] = useState([]);
    const [errors, setErrors] = useState([]);
    const [dailyVisits, setDailyVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        window.scrollTo(0, 0);
        // Check if user is already authenticated in session storage
        const storedAuth = sessionStorage.getItem('analytics_auth');
        if (storedAuth === 'authenticated') {
            setIsAuthenticated(true);
            fetchAllAnalytics();
        } else {
            setLoading(false); // Stop loading if not authenticated
        }
    }, []);

    const fetchWithAuth = async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}/api/analytics/${endpoint}`, {
            headers: {
                'x-api-key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
        }

        return response.json();
    };

    const fetchAllAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const [
                summaryData,
                topPagesData,
                countriesData,
                browsersData,
                devicesData,
                contactsData,
                errorsData,
                dailyVisitsData
            ] = await Promise.all([
                fetchWithAuth('summary'),
                fetchWithAuth('top-pages?limit=10'),
                fetchWithAuth('traffic-by-country?limit=10'),
                fetchWithAuth('browsers'),
                fetchWithAuth('devices'),
                fetchWithAuth('recent-contacts?limit=10'),
                fetchWithAuth('errors?limit=10'),
                fetchWithAuth('daily-visits?days=30')
            ]);

            setSummary(summaryData);
            setTopPages(topPagesData);
            setCountries(countriesData);
            setBrowsers(browsersData);
            setDevices(devicesData);
            setRecentContacts(contactsData);
            setErrors(errorsData);
            setDailyVisits(dailyVisitsData);
        } catch (err) {
            console.error('Analytics fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = (e) => {
        e.preventDefault();
        if (authKey === API_KEY) {
            setIsAuthenticated(true);
            setAuthError('');
            sessionStorage.setItem('analytics_auth', 'authenticated');
            fetchAllAnalytics();
        } else {
            setAuthError('Invalid API key. Access denied.');
            setAuthKey('');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('analytics_auth');
        // Reset all data
        setSummary(null);
        setTopPages([]);
        setCountries([]);
        setBrowsers([]);
        setDevices([]);
        setRecentContacts([]);
        setErrors([]);
        setDailyVisits([]);
        setLoading(false);
        setError(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderOverview = () => (
        <div className="analytics-overview">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Visitors</h3>
                        <p className="stat-number">{summary?.visitors.total.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card highlight">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <h3>Today</h3>
                        <p className="stat-number">{summary?.visitors.today.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>Last 7 Days</h3>
                        <p className="stat-number">{summary?.visitors.last7Days.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <h3>Last 30 Days</h3>
                        <p className="stat-number">{summary?.visitors.last30Days.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✉️</div>
                    <div className="stat-content">
                        <h3>Contact Submissions</h3>
                        <p className="stat-number">{summary?.events.contactSubmissions.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>Emails Sent</h3>
                        <p className="stat-number">{summary?.events.emailsSent.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card error">
                    <div className="stat-icon">❌</div>
                    <div className="stat-content">
                        <h3>Email Failures</h3>
                        <p className="stat-number">{summary?.events.emailsFailed.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <h3>Total Events</h3>
                        <p className="stat-number">{summary?.events.total.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Daily Visits Chart */}
            <div className="chart-section">
                <h2>Daily Visits (Last 30 Days)</h2>
                <div className="chart-container">
                    {dailyVisits.length > 0 ? (
                        <div className="bar-chart">
                            {dailyVisits.map((day, index) => {
                                const maxVisits = Math.max(...dailyVisits.map(d => d.visits));
                                const height = (day.visits / maxVisits) * 100;
                                return (
                                    <div key={index} className="bar-wrapper">
                                        <div className="bar" style={{ height: `${height}%` }}>
                                            <span className="bar-value">{day.visits}</span>
                                        </div>
                                        <span className="bar-label">{new Date(day.date).getDate()}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderTraffic = () => (
        <div className="analytics-traffic">
            <div className="two-column-layout">
                {/* Top Pages */}
                <div className="data-table-section">
                    <h2>🔥 Top Pages</h2>
                    <div className="data-table">
                        {topPages.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Page</th>
                                    <th>Visits</th>
                                </tr>
                                </thead>
                                <tbody>
                                {topPages.map((page, index) => (
                                    <tr key={index}>
                                        <td className="page-path">{page.path || '/'}</td>
                                        <td className="visits-count">{page.visits.toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </div>

                {/* Countries */}
                <div className="data-table-section">
                    <h2>🌍 Traffic by Country</h2>
                    <div className="data-table">
                        {countries.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Country</th>
                                    <th>Visitors</th>
                                </tr>
                                </thead>
                                <tbody>
                                {countries.map((country, index) => (
                                    <tr key={index}>
                                        <td>{country.country}</td>
                                        <td className="visits-count">{country.visitors.toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTechnology = () => (
        <div className="analytics-technology">
            <div className="two-column-layout">
                {/* Browsers */}
                <div className="data-table-section">
                    <h2>🌐 Browsers</h2>
                    <div className="data-table">
                        {browsers.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Browser</th>
                                    <th>Count</th>
                                    <th>Percentage</th>
                                </tr>
                                </thead>
                                <tbody>
                                {browsers.map((browser, index) => {
                                    const total = browsers.reduce((sum, b) => sum + b.count, 0);
                                    const percentage = ((browser.count / total) * 100).toFixed(1);
                                    return (
                                        <tr key={index}>
                                            <td>{browser.browser}</td>
                                            <td>{browser.count.toLocaleString()}</td>
                                            <td>
                                                <div className="percentage-bar">
                                                    <div className="percentage-fill" style={{ width: `${percentage}%` }}></div>
                                                    <span>{percentage}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </div>

                {/* Devices */}
                <div className="data-table-section">
                    <h2>📱 Devices</h2>
                    <div className="data-table">
                        {devices.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Device</th>
                                    <th>Count</th>
                                    <th>Percentage</th>
                                </tr>
                                </thead>
                                <tbody>
                                {devices.map((device, index) => {
                                    const total = devices.reduce((sum, d) => sum + d.count, 0);
                                    const percentage = ((device.count / total) * 100).toFixed(1);
                                    return (
                                        <tr key={index}>
                                            <td>{device.device}</td>
                                            <td>{device.count.toLocaleString()}</td>
                                            <td>
                                                <div className="percentage-bar">
                                                    <div className="percentage-fill" style={{ width: `${percentage}%` }}></div>
                                                    <span>{percentage}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContacts = () => (
        <div className="analytics-contacts">
            <h2>📨 Recent Contact Submissions</h2>
            <div className="contacts-list">
                {recentContacts.length > 0 ? (
                    recentContacts.map((contact, index) => (
                        <div key={index} className="contact-card">
                            <div className="contact-header">
                                <span className="contact-name">{contact.eventData?.name || 'Unknown'}</span>
                                <span className="contact-date">{formatDate(contact.timestamp)}</span>
                            </div>
                            <div className="contact-details">
                                <p><strong>Email:</strong> {contact.eventData?.email || 'N/A'}</p>
                                <p><strong>Project:</strong> {contact.eventData?.project || 'N/A'}</p>
                                <p><strong>Location:</strong> {contact.country}, {contact.region}</p>
                                <p><strong>Message Length:</strong> {contact.eventData?.messageLength || 0} characters</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No contact submissions yet</p>
                )}
            </div>
        </div>
    );

    const renderErrors = () => (
        <div className="analytics-errors">
            <h2>⚠️ Recent Errors</h2>
            <div className="errors-list">
                {errors.length > 0 ? (
                    errors.map((error, index) => (
                        <div key={index} className="error-card">
                            <div className="error-header">
                                <span className="error-type">{error.eventType}</span>
                                <span className="error-date">{formatDate(error.timestamp)}</span>
                            </div>
                            <div className="error-details">
                                <p><strong>Message:</strong> {error.errorMessage || error.eventData?.error || 'No message'}</p>
                                {error.eventData?.recipient && (
                                    <p><strong>Recipient:</strong> {error.eventData.recipient}</p>
                                )}
                                {error.eventData?.emailType && (
                                    <p><strong>Email Type:</strong> {error.eventData.emailType}</p>
                                )}
                                <p><strong>Location:</strong> {error.country || 'Unknown'}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-errors">✅ No errors - everything is working perfectly!</p>
                )}
            </div>
        </div>
    );

    // Authentication form - show this if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="analytics-page">
                <Helmet>
                    <title>Analytics Access | Tornado Audio</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>

                <Header />

                <div className="analytics-container">
                    <div className="auth-form-container">
                        <div className="auth-form">
                            <h1>🔐 Analytics Access</h1>
                            <p>Enter your API key to access the analytics dashboard</p>

                            <form onSubmit={handleAuth}>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        value={authKey}
                                        onChange={(e) => setAuthKey(e.target.value)}
                                        placeholder="Enter API Key"
                                        className={`auth-input ${authError ? 'error' : ''}`}
                                        required
                                    />
                                </div>

                                {authError && (
                                    <div className="auth-error">
                                        ❌ {authError}
                                    </div>
                                )}

                                <button type="submit" className="auth-button">
                                    🚀 Access Dashboard
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="analytics-page">
                <Helmet>
                    <title>Analytics Dashboard | Tornado Audio</title>
                </Helmet>
                <Header />
                <div className="analytics-container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-page">
                <Helmet>
                    <title>Analytics Dashboard | Tornado Audio</title>
                </Helmet>
                <Header />
                <div className="analytics-container">
                    <div className="error-state">
                        <h2>⚠️ Error Loading Analytics</h2>
                        <p>{error}</p>
                        <button onClick={fetchAllAnalytics} className="retry-button">
                            🔄 Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <Helmet>
                <title>Analytics Dashboard | Tornado Audio</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <Header />

            <div className="analytics-container">
                <div className="analytics-header">
                    <h1>📊 Analytics Dashboard</h1>
                    <div className="header-buttons">
                        <button onClick={fetchAllAnalytics} className="refresh-button">
                            🔄 Refresh Data
                        </button>
                        <button onClick={handleLogout} className="logout-button">
                            🚪 Logout
                        </button>
                    </div>
                </div>

                <div className="analytics-tabs">
                    <button
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📈 Overview
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'traffic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('traffic')}
                    >
                        🌐 Traffic
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'technology' ? 'active' : ''}`}
                        onClick={() => setActiveTab('technology')}
                    >
                        💻 Technology
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contacts')}
                    >
                        📨 Contacts
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'errors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('errors')}
                    >
                        ⚠️ Errors
                    </button>
                </div>

                <div className="analytics-content">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'traffic' && renderTraffic()}
                    {activeTab === 'technology' && renderTechnology()}
                    {activeTab === 'contacts' && renderContacts()}
                    {activeTab === 'errors' && renderErrors()}
                </div>
            </div>
        </div>
    );
}

export default Analytics;
