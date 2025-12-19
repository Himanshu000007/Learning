import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Award, TrendingUp, Users, BookOpen, Zap, ArrowRight, Star } from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [paths, setPaths] = useState([]);

    useEffect(() => {
        // Load user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Fetch courses
        fetch('http://localhost:5000/api/courses')
            .then(res => res.json())
            .then(data => setCourses(data.slice(0, 4)))
            .catch(console.error);

        // Fetch learning paths
        fetch('http://localhost:5000/api/paths')
            .then(res => res.json())
            .then(data => setPaths(data))
            .catch(console.error);
    }, []);

    const stats = [
        { label: 'Hours Learned', value: user?.progress?.hoursLearned || '42.5', icon: Clock, color: '#ec4899' },
        { label: 'Courses Completed', value: user?.progress?.coursesCompleted || '12', icon: Award, color: '#f59e0b' },
        { label: 'Current Streak', value: `${user?.progress?.currentStreak || 5} Days`, icon: TrendingUp, color: '#10b981' },
        { label: 'Skill Score', value: user?.progress?.skillScore || '850', icon: Zap, color: '#6366f1' },
    ];

    return (
        <div className="dashboard-page" style={{ paddingBottom: '3rem' }}>
            {/* Header Section */}
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.name || 'Learner'}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    You're making great progress! Here's what's happening with your learning journey.
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid" style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {stats.map((stat, index) => (
                    <div key={index} className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Continue Learning Section */}
                <section>
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Continue Learning</h2>
                        <Link to="/courses" className="btn" style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {courses.slice(0, 3).map((course, i) => (
                            <Link key={course._id} to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
                                <div className="card" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    padding: '1rem'
                                }}>
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', marginBottom: '0.25rem' }}>
                                            {course.category}
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                            {course.title}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={14} /> {course.duration}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <BookOpen size={14} /> {course.modules?.length || 0} modules
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: 'var(--accent-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Play size={24} fill="white" color="white" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Right Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Learning Paths */}
                    <section>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Your Learning Paths</h3>
                        {paths.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {paths.map(path => (
                                    <Link key={path._id} to="/paths" style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: '1rem' }}>
                                            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{path.title}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                                {path.nodes?.length || 0} steps • {path.estimatedDuration}
                                            </p>
                                            <div style={{
                                                height: '4px',
                                                background: 'var(--bg-primary)',
                                                borderRadius: '2px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${((path.nodes?.filter(n => n.status === 'completed').length || 0) / (path.nodes?.length || 1)) * 100}%`,
                                                    height: '100%',
                                                    background: 'var(--accent-primary)',
                                                    borderRadius: '2px'
                                                }} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No paths yet</p>
                                <Link to="/recommendations" className="btn btn-primary">Find Your Path</Link>
                            </div>
                        )}
                    </section>

                    {/* Quick Actions */}
                    <section>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/recommendations" className="card" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                textDecoration: 'none',
                                color: 'var(--text-primary)'
                            }}>
                                <Zap size={20} color="var(--accent-primary)" />
                                <span>Get Personalized Recommendations</span>
                            </Link>
                            <Link to="/courses" className="card" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                textDecoration: 'none',
                                color: 'var(--text-primary)'
                            }}>
                                <BookOpen size={20} color="var(--accent-secondary)" />
                                <span>Browse All Courses</span>
                            </Link>
                            <Link to="/paths" className="card" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                textDecoration: 'none',
                                color: 'var(--text-primary)'
                            }}>
                                <TrendingUp size={20} color="#10b981" />
                                <span>View Learning Path</span>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>

            {/* Featured Courses Section */}
            <section>
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Featured Courses</h2>
                    <Link to="/courses" className="btn" style={{ color: 'var(--accent-primary)' }}>See All</Link>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {courses.map(course => (
                        <Link key={course._id} to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute',
                                        top: '0.75rem',
                                        right: '0.75rem',
                                        background: 'rgba(0,0,0,0.7)',
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
                                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                        {course.category}
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                        {course.title}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        <span><Clock size={12} /> {course.duration}</span>
                                        <span><Users size={12} /> {course.enrolledCount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Community Activity */}
            <section style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Community Activity</h2>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { user: 'Sarah M.', action: 'completed', course: 'React Fundamentals', time: '2 hours ago', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                        { user: 'John D.', action: 'started', course: 'Node.js Masterclass', time: '4 hours ago', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                        { user: 'Emily C.', action: 'earned badge', course: 'Python Expert', time: '5 hours ago', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
                    ].map((activity, i) => (
                        <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={activity.avatar} alt={activity.user} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{activity.user}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {activity.action} <span style={{ color: 'var(--accent-primary)' }}>{activity.course}</span>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activity.time}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
