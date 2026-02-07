import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import API_BASE_URL from '../../utils/api';

const VideoPlayer = ({ videoUrl, courseId, lessonId, onComplete, initialProgress = 0, onProgressUpdate }) => {
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(initialProgress);
    const [duration, setDuration] = useState(0);
    const [completed, setCompleted] = useState(false);
    const progressInterval = useRef(null);

    // Sync progress to backend every 30 seconds
    useEffect(() => {
        if (playing) {
            progressInterval.current = setInterval(() => {
                syncProgress();
            }, 30000);
        } else {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [playing, courseId, lessonId]);

    const syncProgress = async (currentProgress = null) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Update session time (approx 30s or elapsed)
            await fetch(`${API_BASE_URL}/api/progress/end-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ duration: 0.5 }) // 30 seconds = 0.5 minutes
            });

            // If progress passed, update course progress
            if (currentProgress !== null) {
                // Logic to update course percentage could go here
            }

        } catch (error) {
            console.error('Error syncing progress:', error);
        }
    };

    const handleProgress = (state) => {
        // state.played is 0-1
        const percentage = state.played * 100;
        setProgress(percentage);
        if (onProgressUpdate) onProgressUpdate(percentage);

        // Mark complete if > 90%
        if (percentage > 90 && !completed) {
            setCompleted(true);
            markLessonComplete();
            if (onComplete) onComplete();
        }
    };

    const markLessonComplete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await fetch(`${API_BASE_URL}/api/progress/complete-lesson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ courseId, lessonId })
            });
        } catch (error) {
            console.error('Error marking complete:', error);
        }
    };

    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const handlePlay = async () => {
        setPlaying(true);
        // Start session
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch(`${API_BASE_URL}/api/progress/start-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ courseId, lessonId })
                });
            }
        } catch (e) { console.error(e); }
    };

    const handlePause = () => {
        setPlaying(false);
        syncProgress(); // Sync immediately on pause
    };

    return (
        <>
            <div className="video-player-wrapper" style={{
                position: 'relative',
                paddingTop: '56.25%', /* 16:9 Aspect Ratio */
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#000'
            }}>
                <ReactPlayer
                    ref={playerRef}
                    url={videoUrl}
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    playing={playing}
                    controls={true}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onError={(e) => console.error('Video Error:', e)}
                    config={{
                        youtube: {
                            playerVars: {
                                showinfo: 1,
                                origin: window.location.origin,
                                modestbranding: 1,
                                rel: 0
                            }
                        }
                    }}
                />
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderBottomLeftRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Video not playing? <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Watch on YouTube</a>
                </p>
            </div>
        </>
    );
};

export default VideoPlayer;
