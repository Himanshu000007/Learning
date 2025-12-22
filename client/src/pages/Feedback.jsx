import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../utils/api';

const Feedback = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ subject: '', message: '', category: 'general' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (token) {
            fetchQueries();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchQueries = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/queries/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setQueries(await res.json());
        } catch (error) {
            console.error('Error fetching queries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            alert('Please login to submit a query');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/queries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setFormData({ subject: '', message: '', category: 'general' });
                setSuccess('Your query has been submitted successfully!');
                fetchQueries();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Error submitting query:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} color="#f59e0b" />;
            case 'replied': return <CheckCircle size={16} color="#10b981" />;
            case 'closed': return <AlertCircle size={16} color="#525252" />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '2rem' }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Help & <span style={{ color: 'var(--accent-primary)' }}>Support</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Have a question or feedback? We're here to help!
                </p>
            </header>

            {/* Success Message */}
            {success && (
                <div style={{
                    background: '#10b98120',
                    border: '1px solid #10b981',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '2rem',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <CheckCircle size={20} /> {success}
                </div>
            )}

            {/* Submit Query Form */}
            <div className="card" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    <MessageSquare size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Submit a Query
                </h2>

                {!token ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                        Please login to submit a query.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="general">General Inquiry</option>
                                <option value="technical">Technical Issue</option>
                                <option value="course">Course Related</option>
                                <option value="billing">Billing</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="Brief description of your query"
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe your issue or question in detail..."
                                required
                                rows={5}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary"
                            style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Send size={18} />
                            {submitting ? 'Submitting...' : 'Submit Query'}
                        </button>
                    </form>
                )}
            </div>

            {/* My Queries */}
            {token && (
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        Your Queries ({queries.length})
                    </h2>

                    {loading ? (
                        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
                    ) : queries.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            You haven't submitted any queries yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {queries.map(query => (
                                <div key={query._id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{query.subject}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {query.category} • {new Date(query.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getStatusIcon(query.status)}
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                textTransform: 'capitalize',
                                                background: query.status === 'pending' ? '#f59e0b20' : (query.status === 'replied' ? '#10b98120' : '#52525220'),
                                                color: query.status === 'pending' ? '#f59e0b' : (query.status === 'replied' ? '#10b981' : '#525252')
                                            }}>
                                                {query.status}
                                            </span>
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{query.message}</p>

                                    {query.reply?.message && (
                                        <div style={{
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            border: '1px solid rgba(99, 102, 241, 0.2)',
                                            padding: '1rem',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                                                Admin Reply • {new Date(query.reply.repliedAt).toLocaleDateString()}
                                            </div>
                                            <p>{query.reply.message}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Feedback;
