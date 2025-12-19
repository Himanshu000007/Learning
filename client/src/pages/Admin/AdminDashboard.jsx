import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, MessageSquare, AlertCircle, TrendingUp, Mail, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [queries, setQueries] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);

    const token = localStorage.getItem('token');
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');

    // Check if admin is logged in
    useEffect(() => {
        if (!adminLoggedIn) {
            navigate('/admin/login');
        }
    }, [adminLoggedIn, navigate]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch stats
            const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (statsRes.ok) setStats(await statsRes.json());

            // Fetch users
            const usersRes = await fetch('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (usersRes.ok) setUsers(await usersRes.json());

            // Fetch queries
            const queriesRes = await fetch('http://localhost:5000/api/queries/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (queriesRes.ok) setQueries(await queriesRes.json());
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (queryId) => {
        if (!replyText.trim()) {
            alert('Please enter a reply message.');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/queries/${queryId}/reply`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message: replyText })
            });

            if (res.ok) {
                setReplyText('');
                setReplyingTo(null);
                fetchData();
                alert('Reply sent successfully!');
            } else {
                const data = await res.json();
                console.error('Reply failed:', data);
                alert(`Failed to send reply: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error replying:', error);
            alert(`Error replying: ${error.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
        navigate('/admin/login');
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading...</div>;
    }

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Admin <span style={{ color: 'var(--accent-primary)' }}>Dashboard</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage users, courses, and feedback.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                >
                    <LogOut size={18} /> Logout
                </button>
            </header>

            {/* Stats Grid */}
            {stats && (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#6366f1' },
                        { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: '#10b981' },
                        { label: 'Total Queries', value: stats.totalQueries, icon: MessageSquare, color: '#f59e0b' },
                        { label: 'Pending Queries', value: stats.pendingQueries, icon: AlertCircle, color: '#ef4444' },
                    ].map((stat, i) => (
                        <div key={i} className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {['overview', 'feedback', 'users'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="btn"
                        style={{
                            background: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
                            border: 'none',
                            textTransform: 'capitalize',
                            fontWeight: activeTab === tab ? '600' : '400',
                            color: activeTab === tab ? 'white' : 'var(--text-secondary)'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Feedback Tab - Prominent display of user feedback */}
            {activeTab === 'feedback' && (
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MessageSquare size={24} color="var(--accent-primary)" />
                        User Feedback ({queries.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {queries.length === 0 ? (
                            <div className="card glass" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>No Feedback Yet</h3>
                                <p>User feedback submissions will appear here.</p>
                            </div>
                        ) : (
                            queries.map(query => (
                                <div key={query._id} id={`query-${query._id}`} className="card glass" style={{
                                    borderLeft: `4px solid ${query.status === 'pending' ? '#f59e0b' : (query.status === 'replied' ? '#10b981' : '#525252')}`
                                }}>
                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '45px',
                                                height: '45px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                                color: 'white'
                                            }}>
                                                {query.user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{query.user?.name || 'Unknown User'}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{query.user?.email || 'No email'}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                            <span style={{
                                                padding: '0.35rem 0.85rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                background: query.status === 'pending' ? '#f59e0b20' : (query.status === 'replied' ? '#10b98120' : '#52525220'),
                                                color: query.status === 'pending' ? '#f59e0b' : (query.status === 'replied' ? '#10b981' : '#525252')
                                            }}>
                                                {query.status}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {new Date(query.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Category & Subject */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.5rem',
                                            background: 'var(--bg-primary)',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            marginRight: '0.5rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {query.category || 'general'}
                                        </span>
                                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{query.subject}</span>
                                    </div>

                                    {/* Message */}
                                    <div style={{
                                        background: 'var(--bg-primary)',
                                        padding: '1.25rem',
                                        borderRadius: '8px',
                                        marginBottom: '1rem',
                                        lineHeight: 1.6
                                    }}>
                                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{query.message}</p>
                                    </div>

                                    {/* Admin Reply (if exists) */}
                                    {query.reply?.message && (
                                        <div style={{
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid rgba(16, 185, 129, 0.2)',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{ fontSize: '0.8rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>
                                                ✓ Admin Reply • {new Date(query.reply.repliedAt).toLocaleDateString()}
                                            </div>
                                            <p style={{ margin: 0 }}>{query.reply.message}</p>
                                        </div>
                                    )}

                                    {/* Reply Section - ALWAYS Visible */}
                                    {replyingTo === query._id ? (
                                        <div style={{ marginTop: '1rem' }}>
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type your reply to this feedback..."
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: 'var(--bg-secondary)',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '8px',
                                                    color: 'var(--text-primary)',
                                                    marginBottom: '0.75rem',
                                                    minHeight: '100px',
                                                    resize: 'vertical'
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleReply(query._id)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                >
                                                    <Mail size={16} /> Send Reply
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={() => setReplyingTo(null)}
                                                    style={{ background: 'var(--bg-secondary)' }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn"
                                            onClick={() => setReplyingTo(query._id)}
                                            style={{
                                                background: query.status === 'replied' ? 'var(--bg-secondary)' : 'var(--accent-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                border: query.status === 'replied' ? '1px solid var(--border-color)' : 'none'
                                            }}
                                        >
                                            <Mail size={16} />
                                            {query.status === 'replied' ? 'Send Another Reply' : 'Reply to Feedback'}
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Registered Users ({users.length})</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {users.map(user => (
                            <div key={user._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Role</div>
                                    <span style={{ padding: '0.25rem 0.75rem', background: user.role === 'admin' ? '#6366f120' : '#10b98120', color: user.role === 'admin' ? '#6366f1' : '#10b981', borderRadius: '4px', fontSize: '0.8rem' }}>
                                        {user.role}
                                    </span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enrolled Courses</div>
                                    <div style={{ fontWeight: 600 }}>{user.enrolledCourses?.length || 0}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Users</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {users.slice(0, 5).map(user => (
                                <div key={user._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>{user.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Queries</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {queries.slice(0, 5).map(query => (
                                <div key={query._id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 500 }}>{query.subject}</span>
                                            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '4px', background: query.status === 'pending' ? '#f59e0b20' : '#10b98120', color: query.status === 'pending' ? '#f59e0b' : '#10b981' }}>{query.status}</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{query.user?.name}</div>
                                    </div>
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => {
                                            setActiveTab('feedback');
                                            // Optional: Scroll to that query? 
                                            setTimeout(() => {
                                                const el = document.getElementById(`query-${query._id}`);
                                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                                setReplyingTo(query._id);
                                            }, 100);
                                        }}
                                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'var(--bg-secondary)' }}
                                    >
                                        Reply
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
