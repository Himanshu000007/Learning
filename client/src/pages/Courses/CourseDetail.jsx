import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, Play, CheckCircle, BookOpen, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import API_BASE_URL from '../../utils/api';
import VideoPlayer from '../../components/Course/VideoPlayer';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(0);
    const [activeLesson, setActiveLesson] = useState({ sectionIndex: 0, lessonIndex: 0 });
    const [completedLessons, setCompletedLessons] = useState([]);
    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
        fetchCourseAndProgress();
    }, [id]);

    const fetchCourseAndProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const [courseRes, progressRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/courses/${id}`, { headers }),
                token ? fetch(`${API_BASE_URL}/api/progress/courses-in-progress`, { headers }) : Promise.resolve(null)
            ]);

            const courseData = await courseRes.json();
            setCourse(courseData);

            // Initialize expanded sections (open first one)
            setExpandedSections({ 0: true });

            if (progressRes) {
                const progressData = await progressRes.json();
                const currentCourseProgress = progressData.find(c => c.courseId?._id === id || c.courseId === id);
                if (currentCourseProgress) {
                    setCompletedLessons(currentCourseProgress.completedLessons || []);
                }
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleLessonComplete = (lessonId) => {
        if (!completedLessons.includes(lessonId)) {
            setCompletedLessons(prev => [...prev, lessonId]);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!course) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <p>Course not found</p>
                <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
            </div>
        );
    }

    const currentSection = course.modules?.[activeLesson.sectionIndex];
    const currentLesson = currentSection?.lessons?.[activeLesson.lessonIndex];

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textDecoration: 'none' }}>
                <ArrowLeft size={18} /> Back to Courses
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                {/* Main Content */}
                <div>
                    {/* Video Player */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        {currentLesson ? (
                            <VideoPlayer
                                videoUrl={currentLesson.youtubeUrl || currentLesson.videoUrl}
                                courseId={id}
                                lessonId={currentLesson._id}
                                onComplete={() => handleLessonComplete(currentLesson._id)}
                            />
                        ) : (
                            <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <p style={{ color: 'var(--text-muted)' }}>Select a lesson to start learning</p>
                            </div>
                        )}
                    </div>

                    {/* Lesson Title & Info */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {currentLesson?.title || course.title}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {currentLesson?.description || course.description}
                        </p>
                    </div>

                    {/* Instructor Info */}
                    {course.instructor && (
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                            <img src={course.instructor.avatar || 'https://via.placeholder.com/60'} alt={course.instructor.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{course.instructor.name}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{course.instructor.bio || 'Instructor'}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Course Content Sidebar */}
                <div className="card" style={{ height: 'fit-content', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', padding: 0 }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Course Content</h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {completedLessons.length} / {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons completed
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {course.modules?.map((module, sectionIndex) => (
                            <div key={sectionIndex} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <button
                                    onClick={() => toggleSection(sectionIndex)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'var(--bg-secondary)',
                                        border: 'none',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    <span>{module.title}</span>
                                    {expandedSections[sectionIndex] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                {expandedSections[sectionIndex] && (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {module.lessons?.map((lesson, lessonIndex) => {
                                            const isActive = activeLesson.sectionIndex === sectionIndex && activeLesson.lessonIndex === lessonIndex;
                                            const isCompleted = completedLessons.includes(lesson._id);

                                            return (
                                                <button
                                                    key={lesson._id || lessonIndex}
                                                    onClick={() => setActiveLesson({ sectionIndex, lessonIndex })}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.75rem',
                                                        padding: '0.75rem 1rem',
                                                        background: isActive ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                                                        border: 'none',
                                                        borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                                                        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                                        cursor: 'pointer',
                                                        textAlign: 'left',
                                                        fontSize: '0.9rem',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {isCompleted ? (
                                                        <CheckCircle size={16} color="var(--accent-primary)" />
                                                    ) : (
                                                        isActive ? <Play size={16} fill="currentColor" /> : <div style={{ width: 16 }} />
                                                    )}
                                                    <span style={{ flex: 1 }}>{lesson.title}</span>
                                                    <span style={{ fontSize: '0.75rem' }}>{lesson.duration}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--accent-primary);
                    animation: spin 1s ease-in-out infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default CourseDetail;
