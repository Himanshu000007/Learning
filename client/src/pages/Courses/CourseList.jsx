import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Search, Filter } from 'lucide-react';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const categories = ['All', 'Web Development', 'Data Science', 'Machine Learning', 'Mobile Development', 'DevOps', 'Design'];

    useEffect(() => {
        fetchCourses();
    }, [category]);

    const fetchCourses = async () => {
        try {
            let url = 'http://localhost:5000/api/courses';
            const params = new URLSearchParams();
            if (category && category !== 'All') params.append('category', category);
            if (search) params.append('search', search);
            if (params.toString()) url += '?' + params.toString();

            const response = await fetch(url);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses();
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Explore <span style={{ color: 'var(--accent-primary)' }}>Courses</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Discover {courses.length}+ courses taught by industry experts
                </p>
            </header>

            {/* Search & Filters */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
            }}>
                <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search courses..."
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem'
                        }}
                    />
                </form>
            </div>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '2rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat === 'All' ? '' : cat)}
                        className="btn"
                        style={{
                            background: (category === cat || (cat === 'All' && !category))
                                ? 'var(--accent-primary)'
                                : 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            whiteSpace: 'nowrap',
                            padding: '0.5rem 1rem'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Course Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    Loading courses...
                </div>
            ) : (
                <div className="grid" style={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '2rem'
                }}>
                    {courses.map(course => (
                        <Link
                            key={course._id}
                            to={`/courses/${course._id}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="card" style={{
                                padding: 0,
                                overflow: 'hidden',
                                height: '100%',
                                transition: 'transform 0.3s, box-shadow 0.3s'
                            }}>
                                {/* Thumbnail */}
                                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'rgba(0,0,0,0.8)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem'
                                    }}>
                                        {course.difficulty}
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--accent-secondary)',
                                        textTransform: 'uppercase',
                                        marginBottom: '0.5rem',
                                        fontWeight: 600
                                    }}>
                                        {course.category}
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                        marginBottom: '0.75rem',
                                        color: 'var(--text-primary)'
                                    }}>
                                        {course.title}
                                    </h3>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9rem',
                                        marginBottom: '1rem',
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {course.description}
                                    </p>

                                    {/* Meta */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.85rem'
                                    }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={14} /> {course.duration}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Users size={14} /> {course.enrolledCount?.toLocaleString()}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                                            <Star size={14} fill="#fbbf24" /> {course.rating}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {!loading && courses.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    color: 'var(--text-secondary)'
                }}>
                    No courses found. Try a different search or category.
                </div>
            )}
        </div>
    );
};

export default CourseList;
