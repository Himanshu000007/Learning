import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, Lock, ArrowRight, BookOpen, FileQuestion, Star } from 'lucide-react';
import API_BASE_URL from '../utils/api';
import QuizModal from '../components/Quiz/QuizModal';

const PathNode = ({ node, x, y, onClick, isSelected }) => {
    const isLocked = node.status === 'locked';
    const isCompleted = node.status === 'completed';
    const isActive = node.status === 'active';
    const isQuiz = node.type === 'quiz';

    return (
        <div
            onClick={() => !isLocked && onClick()}
            className="node-container"
            style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '180px'
            }}
        >
            <div className={`node ${isSelected ? 'selected' : ''} ${isActive ? 'animate-pulse' : ''}`} style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: isCompleted ? 'var(--accent-primary)' : (isLocked ? 'var(--bg-card)' : (isQuiz ? '#8b5cf6' : 'var(--bg-secondary)')),
                border: `2px solid ${isSelected ? 'white' : (isCompleted ? 'var(--accent-primary)' : (isActive ? 'var(--accent-primary)' : 'var(--border-color)'))}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSelected || isActive ? '0 0 20px var(--accent-glow)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                marginBottom: '1rem',
                position: 'relative'
            }}>
                {isCompleted ? <CheckCircle color="white" size={24} /> :
                    isLocked ? <Lock color="gray" size={20} /> :
                        isQuiz ? <FileQuestion color="white" size={24} /> :
                            <BookOpen color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} size={24} />}

                {isQuiz && <div style={{ position: 'absolute', top: -5, right: -5, background: '#fbbf24', borderRadius: '50%', padding: '2px', display: 'flex' }}><Star size={12} fill="white" color="white" /></div>}
            </div>
            <div style={{
                textAlign: 'center',
                background: 'rgba(23, 23, 23, 0.8)',
                backdropFilter: 'blur(4px)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                minWidth: '140px',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s'
            }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{node.title}</div>
                <div style={{ fontSize: '0.75rem', color: isCompleted ? 'var(--accent-secondary)' : 'var(--text-muted)' }}>
                    {isQuiz ? 'Quiz Challenge' : 'Module'}
                </div>
            </div>
        </div >
    );
};

const PathVisualizer = () => {
    const [paths, setPaths] = useState([]);
    const [selectedPath, setSelectedPath] = useState(null);
    const [selectedNode, setSelectedNode] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);

    useEffect(() => {
        // Initial fetch of all paths
        fetch(`${API_BASE_URL}/api/paths`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                setPaths(data);
                if (data.length > 0) {
                    // Fetch details for the first path
                    fetchPathDetails(data[0]._id);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const fetchPathDetails = async (pathId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/paths/${pathId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setSelectedPath(data);

            // Find first active node to select by default
            const activeIndex = data.nodes.findIndex(n => n.status === 'active');
            if (activeIndex !== -1) setSelectedNode(activeIndex);
        } catch (error) {
            console.error('Error fetching path details:', error);
        }
    };

    const handlePathSelect = (pathId) => {
        fetchPathDetails(pathId);
        setSelectedNode(0);
    };

    const nodes = selectedPath?.nodes || [];
    const connections = selectedPath?.connections || [];

    const renderConnection = (conn) => {
        const start = nodes[conn.from]?.position;
        const end = nodes[conn.to]?.position;
        if (!start || !end) return null;

        return (
            <line
                key={`${conn.from}-${conn.to}`}
                x1={`${start.x}%`}
                y1={`${start.y}%`}
                x2={`${end.x}%`}
                y2={`${end.y}%`}
                stroke="var(--border-color)"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.5"
            />
        );
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Loading learning paths...</p>
            </div>
        );
    }

    return (
        <div style={{ height: 'calc(100vh - 4rem)', position: 'relative', overflow: 'hidden' }}>
            <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Learning Path</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {selectedPath?.title || 'Select a path to visualize'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {paths.map(path => (
                        <button
                            key={path._id}
                            onClick={() => handlePathSelect(path._id)}
                            className="btn"
                            style={{
                                background: selectedPath?._id === path._id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)'
                            }}
                        >
                            {path.title}
                        </button>
                    ))}
                </div>
            </header>

            {selectedPath ? (
                <div className="card" style={{
                    width: '100%',
                    height: '500px',
                    position: 'relative',
                    background: 'radial-gradient(circle at 50% 50%, #1a1b26 0%, #0a0a0a 100%)',
                    overflow: 'hidden'
                }}>
                    {/* SVG Layer for lines */}
                    <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        {connections.map(conn => renderConnection(conn))}
                    </svg>

                    {nodes.map((node, index) => (
                        <PathNode
                            key={index}
                            node={node}
                            x={node.position?.x || 50}
                            y={node.position?.y || 50}
                            isSelected={selectedNode === index}
                            onClick={() => setSelectedNode(index)}
                        />
                    ))}

                    {/* Floating Detail Panel */}
                    {nodes[selectedNode] && (
                        <div style={{
                            position: 'absolute',
                            bottom: '1.5rem',
                            right: '1.5rem',
                            width: '320px',
                            background: 'rgba(23, 23, 23, 0.95)',
                            backdropFilter: 'blur(20px)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                        }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                {nodes[selectedNode].title}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                {nodes[selectedNode].status === 'completed'
                                    ? 'You have completed this module!'
                                    : nodes[selectedNode].status === 'active'
                                        ? (nodes[selectedNode].type === 'quiz' ? 'Take the quiz to proceed!' : 'Continue reading to learn.')
                                        : 'Complete previous modules to unlock.'}
                            </p>

                            {nodes[selectedNode].status !== 'locked' && (
                                nodes[selectedNode].type === 'quiz' ? (
                                    <button
                                        onClick={() => setShowQuiz(true)}
                                        className="btn btn-primary"
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <FileQuestion size={16} /> Start Quiz
                                    </button>
                                ) : (
                                    nodes[selectedNode].courseId && (
                                        <Link
                                            to={`/courses/${nodes[selectedNode].courseId._id || nodes[selectedNode].courseId}`}
                                            className="btn btn-primary"
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        >
                                            <BookOpen size={16} /> View Course
                                        </Link>
                                    )
                                )
                            )}
                        </div>
                    )}
                </div>
            ) : null}

            {showQuiz && nodes[selectedNode]?.type === 'quiz' && (
                <QuizModal
                    quiz={nodes[selectedNode].quizId}
                    onClose={() => setShowQuiz(false)}
                    onComplete={() => {
                        setShowQuiz(false);
                        fetchPathDetails(selectedPath._id); // Refresh to show completion
                    }}
                />
            )}
        </div>
    );
};

export default PathVisualizer;
