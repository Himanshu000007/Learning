import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, AtSign, ArrowRight, Check, X } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });

    // Debounced username check
    const checkUsername = useCallback(async (username) => {
        if (username.length < 3) {
            setUsernameStatus({ checking: false, available: null, message: 'Username must be at least 3 characters' });
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setUsernameStatus({ checking: false, available: false, message: 'Only letters, numbers, and underscores allowed' });
            return;
        }

        if (username.length > 20) {
            setUsernameStatus({ checking: false, available: false, message: 'Username cannot exceed 20 characters' });
            return;
        }

        setUsernameStatus({ checking: true, available: null, message: 'Checking...' });

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/check-username/${username}`);
            if (!response.ok) {
                throw new Error('Network error');
            }
            const data = await response.json();
            setUsernameStatus({
                checking: false,
                available: data.available,
                message: data.message
            });
        } catch (err) {
            // On network error, allow form submission and let server validate
            setUsernameStatus({ checking: false, available: true, message: 'Username looks good!' });
        }
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.username) {
                checkUsername(formData.username);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.username, checkUsername]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (usernameStatus.available === false) {
            setError('Please choose a different username');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Decode JWT token to get user info
    const decodeJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        } catch {
            return null;
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');

        try {
            // Decode the JWT to get user info
            const decoded = decodeJwt(credentialResponse.credential);

            if (!decoded) {
                throw new Error('Failed to decode Google credentials');
            }

            const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    googleId: decoded.sub,
                    email: decoded.email,
                    name: decoded.name,
                    avatar: decoded.picture
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Google sign-in failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google sign-in failed. Please try again.');
    };

    const inputStyle = {
        width: '100%',
        padding: '1rem 1rem 1rem 3rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-primary)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    const iconStyle = {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1b26 50%, #0a0a0a 100%)',
            padding: '2rem'
        }}>
            <div className="glass" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '3rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        <span style={{ color: 'var(--accent-primary)' }}>Dynamo</span>Learn
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Create your account and start learning today!
                    </p>
                </div>

                {/* Google Sign In Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="filled_black"
                        size="large"
                        width="350"
                        text="signup_with"
                    />
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    color: 'var(--text-muted)'
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                    <span style={{ fontSize: '0.875rem' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1.5rem',
                        color: '#ef4444',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <AtSign size={18} style={iconStyle} />
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                placeholder="your_username"
                                required
                                minLength={3}
                                maxLength={20}
                                style={{
                                    ...inputStyle,
                                    borderColor: usernameStatus.available === true ? '#22c55e' :
                                        usernameStatus.available === false ? '#ef4444' :
                                            'var(--border-color)',
                                    paddingRight: '3rem'
                                }}
                            />
                            {usernameStatus.checking && (
                                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        border: '2px solid var(--text-muted)',
                                        borderTopColor: 'transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                </div>
                            )}
                            {!usernameStatus.checking && usernameStatus.available === true && (
                                <Check size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#22c55e' }} />
                            )}
                            {!usernameStatus.checking && usernameStatus.available === false && (
                                <X size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} />
                            )}
                        </div>
                        {usernameStatus.message && !usernameStatus.checking && (
                            <p style={{
                                fontSize: '0.8rem',
                                marginTop: '0.25rem',
                                color: usernameStatus.available ? '#22c55e' : '#ef4444'
                            }}>
                                {usernameStatus.message}
                            </p>
                        )}
                    </div>

                    {/* Full Name Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Full Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={iconStyle} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={iconStyle} />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={iconStyle} />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                style={inputStyle}
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Must be at least 6 characters
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Confirm Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={iconStyle} />
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || usernameStatus.available === false}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: (loading || usernameStatus.available === false) ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Creating account...' : (
                            <>
                                Create Account <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Register;
