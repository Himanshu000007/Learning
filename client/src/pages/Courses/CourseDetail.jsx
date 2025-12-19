import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, Play, CheckCircle, BookOpen } from 'lucide-react';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState(0);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/courses/${id}`);
            const data = await response.json();
            setCourse(data);
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Loading course...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Course not found</p>
                <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Back to Courses
                </Link>
            </div>
        );
    }

    const currentVideo = course.modules?.[activeModule];

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Back Button */}
            <Link
                to="/courses"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                    textDecoration: 'none'
                }}
            >
                <ArrowLeft size={18} /> Back to Courses
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
                {/* Main Content */}
                <div>
                    {/* Video Player */}
                    <div style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        background: '#000',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        marginBottom: '1.5rem'
                    }}>
                        {currentVideo?.videoUrl ? (
                            <iframe
                                src={currentVideo.videoUrl}
                                title={currentVideo.title}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)'
                            }}>
                                No video available
                            </div>
                        )}
                    </div>

                    {/* Course Title & Info */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--accent-secondary)',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem',
                            fontWeight: 600
                        }}>
                            {course.category} • {course.difficulty}
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            {course.title}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                            {course.description}
                        </p>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        padding: '1.5rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '2rem'
                    }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Duration</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                <Clock size={16} /> {course.duration}
                            </div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Students</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                <Users size={16} /> {course.enrolledCount?.toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Rating</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#fbbf24' }}>
                                <Star size={16} fill="#fbbf24" /> {course.rating}
                            </div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Modules</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                <BookOpen size={16} /> {course.modules?.length || 0}
                            </div>
                        </div>
                    </div>

                    {/* Instructor */}
                    {course.instructor && (
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                                src={course.instructor.avatar}
                                alt={course.instructor.name}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Instructor</div>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{course.instructor.name}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Modules */}
                <div>
                    <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            Course Curriculum
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {course.modules?.map((module, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveModule(index)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: activeModule === index ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                        border: activeModule === index ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        color: 'var(--text-primary)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: activeModule === index ? 'var(--accent-primary)' : 'var(--bg-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {activeModule > index ? (
                                            <CheckCircle size={18} />
                                        ) : (
                                            <Play size={16} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{module.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{module.duration}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
                        >
                            Enroll Now - Free
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
