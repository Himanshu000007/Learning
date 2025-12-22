import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, Lock, ArrowRight, BookOpen } from 'lucide-react';
import API_BASE_URL from '../utils/api';

const PathNode = ({ title, status, x, y, onClick, isSelected }) => {
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';

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
            <div className={`node ${isSelected ? 'selected' : ''}`} style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: isCompleted ? 'var(--accent-primary)' : (isLocked ? 'var(--bg-card)' : 'var(--bg-secondary)'),
                border: `2px solid ${isSelected ? 'white' : (isCompleted ? 'var(--accent-primary)' : 'var(--border-color)')}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSelected ? '0 0 20px var(--accent-glow)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                marginBottom: '1rem'
            }}>
                {isCompleted ? <CheckCircle color="white" /> : (isLocked ? <Lock color="gray" /> : <Circle color="var(--accent-primary)" />)}
            </div>
            <div style={{
                textAlign: 'center',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                minWidth: '140px'
            }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: isCompleted ? 'var(--accent-secondary)' : 'var(--text-muted)' }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
            </div>
        </div>
    );
};

const PathVisualizer = () => {
    const [paths, setPaths] = useState([]);
    const [selectedPath, setSelectedPath] = useState(null);
    const [selectedNode, setSelectedNode] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/paths`)
            .then(res => res.json())
            .then(data => {
                setPaths(data);
                if (data.length > 0) {
                    setSelectedPath(data[0]);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

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
                            onClick={() => {
                                setSelectedPath(path);
                                setSelectedNode(0);
                            }}
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
                            title={node.title}
                            status={node.status}
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
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                {nodes[selectedNode].title}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                {nodes[selectedNode].status === 'completed'
                                    ? 'You have completed this module!'
                                    : nodes[selectedNode].status === 'active'
                                        ? 'Continue where you left off.'
                                        : 'Complete previous modules to unlock.'}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#3730a3', borderRadius: '4px' }}>
                                    Step {selectedNode + 1} of {nodes.length}
                                </span>
                                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#3730a3', borderRadius: '4px' }}>
                                    {selectedPath.estimatedDuration}
                                </span>
                            </div>
                            {nodes[selectedNode].courseId && (
                                <Link
                                    to={`/courses/${nodes[selectedNode].courseId._id || nodes[selectedNode].courseId}`}
                                    className="btn btn-primary"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    <BookOpen size={16} /> View Course
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        No learning paths available. Get personalized recommendations!
                    </p>
                    <Link to="/recommendations" className="btn btn-primary">
                        Get Recommendations <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                </div>
            )}

            {/* Path Info */}
            {selectedPath && (
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Path Details</h2>
                    <div className="card">
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{selectedPath.description}</p>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Category</span>
                                <div style={{ fontWeight: 600 }}>{selectedPath.category}</div>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Duration</span>
                                <div style={{ fontWeight: 600 }}>{selectedPath.estimatedDuration}</div>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Enrolled</span>
                                <div style={{ fontWeight: 600 }}>{selectedPath.enrolledCount?.toLocaleString()} students</div>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Progress</span>
                                <div style={{ fontWeight: 600 }}>
                                    {nodes.filter(n => n.status === 'completed').length}/{nodes.length} completed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PathVisualizer;
