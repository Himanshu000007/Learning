import React from 'react';

const Recommendations = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Customize Your Journey</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Tell us about your goals and we'll build a tailored learning path just for you.
                </p>
            </header>

            <div className="card" style={{ padding: '2.5rem' }}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>What is your primary goal?</label>
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {['Career Switch', 'Skill Upgrade', 'Hobby Project', 'Certification'].map(opt => (
                                <label key={opt} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '1rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer'
                                }}>
                                    <input type="radio" name="goal" />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Current Experience Level</label>
                        <input type="range" min="1" max="5" defaultValue="2" style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
                        <div className="flex justify-between" style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            <span>Beginner</span>
                            <span>Expert</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Interests (Select all that apply)</label>
                        <div className="flex" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                            {['React', 'Node.js', 'Python', 'Machine Learning', 'Design', 'DevOps'].map(tag => (
                                <button key={tag} className="btn" style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '0.9rem'
                                }}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                        Generate Recommendations
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Recommendations;
