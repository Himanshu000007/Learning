import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Clock, Award, TrendingUp, BookOpen, Zap, ArrowRight, Star, Users, Search, Filter, Flame } from 'lucide-react';
import API_BASE_URL from '../utils/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        hoursLearned: '0',
        coursesCompleted: 0,
        coursesInProgress: 0,
        currentStreak: 0,
        skillScore: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', 'Frontend', 'Backend', 'DSA', 'Computer Science', 'System Design', 'Design'];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/login');
            return;
        }

        setUser(JSON.parse(storedUser));

        // Fetch user stats
        fetch(`${API_BASE_URL}/api/progress/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.hoursLearned !== undefined) {
                    setStats(data);
                }
            })
            .catch(console.error);

        // Fetch courses
        fetch(`${API_BASE_URL}/api/courses`)
            .then(res => res.json())
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [navigate]);

    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const statsCards = [
        { label: 'Hours Learned', value: stats.hoursLearned || '0', icon: Clock, color: '#22c55e' },
        { label: 'Courses Completed', value: stats.coursesCompleted || 0, icon: Award, color: '#f59e0b' },
        { label: 'Day Streak', value: stats.currentStreak || 0, icon: Flame, color: '#ef4444' },
        { label: 'Skill Score', value: stats.skillScore || 0, icon: Zap, color: '#22c55e' }
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid var(--border-color)',
                        borderTop: '3px solid var(--accent-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page" style={{ paddingBottom: '3rem' }}>
            {/* Hero Section */}
            <header style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.name || 'Learner'}</span>! 👋
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            {stats.currentStreak > 0
                                ? `🔥 You're on a ${stats.currentStreak} day streak! Keep it going!`
                                : 'Start learning today and build your streak!'}
                        </p>
                    </div>
                    <Link to="/courses" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                        Continue Learning <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginBottom: '2.5rem'
            }}>
                {statsCards.map((stat, index) => (
                    <div key={index} className="card" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.25rem',
                        background: `linear-gradient(135deg, ${stat.color}10, transparent)`,
                        borderColor: `${stat.color}30`
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            background: `${stat.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: stat.color
                        }}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', lineHeight: 1, color: stat.color }}>
                                {stat.value}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                                {stat.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter Bar */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                alignItems: 'center'
            }}>
                <div style={{
                    flex: 1,
                    position: 'relative'
                }}>
                    <Search size={20} style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.875rem 1rem 0.875rem 3rem',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '0.75rem 1.25rem',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                background: selectedCategory === cat
                                    ? 'var(--accent-primary)'
                                    : 'var(--bg-card)',
                                color: selectedCategory === cat
                                    ? 'white'
                                    : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Grid */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {selectedCategory === 'All' ? 'All Courses' : selectedCategory}
                        <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '1rem', marginLeft: '0.5rem' }}>
                            ({filteredCourses.length} courses)
                        </span>
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {filteredCourses.map(course => (
                        <Link key={course._id} to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>
                                <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400';
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '0.75rem',
                                        left: '0.75rem',
                                        background: 'var(--accent-primary)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        textTransform: 'uppercase'
                                    }}>
                                        {course.category}
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '0.75rem',
                                        right: '0.75rem',
                                        background: 'rgba(0,0,0,0.8)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <Star size={12} fill="#fbbf24" color="#fbbf24" /> {course.rating}
                                    </div>
                                </div>
                                <div style={{ padding: '1.25rem' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        marginBottom: '0.5rem',
                                        color: 'var(--text-primary)',
                                        lineHeight: 1.3
                                    }}>
                                        {course.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)',
                                        marginBottom: '1rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {course.description}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.8rem',
                                        borderTop: '1px solid var(--border-color)',
                                        paddingTop: '1rem'
                                    }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={14} /> {course.duration}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <BookOpen size={14} /> {course.modules?.length || 0} modules
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Users size={14} /> {course.enrolledCount?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'var(--text-muted)'
                    }}>
                        <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No courses found matching your criteria.</p>
                    </div>
                )}
            </section>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
