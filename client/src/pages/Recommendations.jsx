import React, { useState } from 'react';
import { Loader2, BookOpen, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import API_BASE_URL from '../utils/api';

const Recommendations = () => {
    const [formData, setFormData] = useState({
        goal: '',
        level: '2',
        interests: []
    });
    const [loading, setLoading] = useState(false);
    const [path, setPath] = useState(null);
    const [error, setError] = useState(null);

    const handleInterestToggle = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPath(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to generate recommendations');

            const data = await response.json();
            setPath(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Customize Your Journey</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Tell us about your goals and our AI will build a tailored learning path just for you.
                </p>
            </header>

            <div className="grid" style={{ gridTemplateColumns: path ? '1fr 1fr' : '1fr', gap: '2rem', transition: 'all 0.3s ease' }}>

                {/* Input Form */}
                <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>What is your primary goal?</label>
                            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                                {['Career Switch', 'Skill Upgrade', 'Hobby Project', 'Certification'].map(opt => (
                                    <label key={opt} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem',
                                        border: `1px solid ${formData.goal === opt ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                        background: formData.goal === opt ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}>
                                        <input
                                            type="radio"
                                            name="goal"
                                            checked={formData.goal === opt}
                                            onChange={() => setFormData({ ...formData, goal: opt })}
                                            required
                                        />
                                        <span style={{ fontSize: '0.9rem' }}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Current Experience Level: {formData.level}/5</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                            />
                            <div className="flex justify-between" style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <span>Beginner</span>
                                <span>Expert</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Interests (Select all that apply)</label>
                            <div className="flex" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                                {['React', 'Node.js', 'Python', 'Machine Learning', 'Design', 'DevOps', 'Java', 'C++'].map(tag => (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() => handleInterestToggle(tag)}
                                        className="btn"
                                        style={{
                                            background: formData.interests.includes(tag) ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                            color: formData.interests.includes(tag) ? 'white' : 'var(--text-primary)',
                                            border: '1px solid var(--border-color)',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Generate Recommendations'}
                        </button>
                    </form>
                    {error && <div style={{ marginTop: '1rem', color: '#ef4444', textAlign: 'center' }}>{error}</div>}
                </div>

                {/* Results Section */}
                {path && (
                    <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{path.title}</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>{path.description}</p>
                            </div>
                            <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-secondary)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} /> {path.estimatedDuration}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {path.modules?.map((module, index) => (
                                <div key={index} style={{
                                    padding: '1.5rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: '4px solid var(--accent-primary)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{module.title}</h3>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{module.duration}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{module.description}</p>
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <BookOpen size={18} /> Start Learning Path <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
