import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const QuizModal = ({ quiz, onClose, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [passed, setPassed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOptionSelect = (optionIndex) => {
        setAnswers({ ...answers, [currentQuestion]: optionIndex });
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        let correctCount = 0;
        quiz.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                correctCount++;
            }
        });

        const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
        const isPassed = finalScore >= quiz.passingScore;

        setScore(finalScore);
        setPassed(isPassed);
        setShowResult(true);

        try {
            await fetch(`${API_BASE_URL}/api/progress/complete-quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    quizId: quiz._id,
                    score: finalScore,
                    passed: isPassed
                })
            });
            if (isPassed) {
                setTimeout(() => {
                    onComplete(); // Refresh path data
                }, 2000);
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!quiz) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="card" style={{ width: '90%', maxWidth: '600px', padding: '2rem', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                {!showResult ? (
                    <>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            {quiz.title} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>({currentQuestion + 1}/{quiz.questions.length})</span>
                        </h2>

                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{quiz.questions[currentQuestion].question}</p>
                            <div className="grid gap-4">
                                {quiz.questions[currentQuestion].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        className="btn"
                                        style={{
                                            textAlign: 'left',
                                            padding: '1rem',
                                            background: answers[currentQuestion] === idx ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                            border: '1px solid var(--border-color)',
                                            color: answers[currentQuestion] === idx ? 'white' : 'var(--text-primary)'
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={answers[currentQuestion] === undefined}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'} <ArrowRight size={16} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        {passed ? (
                            <CheckCircle size={64} color="var(--accent-primary)" style={{ margin: '0 auto 1.5rem' }} />
                        ) : (
                            <AlertCircle size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
                        )}
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {passed ? 'Quiz Passed!' : 'Quiz Failed'}
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            You scored {score}% (Required: {quiz.passingScore}%)
                        </p>
                        <button onClick={onClose} className="btn btn-primary">
                            {passed ? 'Continue Learning' : 'Try Again'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizModal;
