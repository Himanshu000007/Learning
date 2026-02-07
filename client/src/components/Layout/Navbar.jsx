import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, User, LogOut, Settings } from 'lucide-react';

const Navbar = ({ toggleSidebar, user, onLogout }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className="navbar glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            padding: '0.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '2rem',
            backdropFilter: 'blur(12px)',
            background: 'rgba(10, 10, 10, 0.8)'
        }}>
            {/* Left section with Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'none' // Hidden on desktop, show on mobile via CSS media query if needed
                    }}
                >
                    <Menu size={24} />
                </button>

                <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }} />
                    <input
                        type="text"
                        placeholder="What do you want to learn?"
                        style={{
                            width: '100%',
                            padding: '0.6rem 1rem 0.6rem 2.8rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '20px',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            </div>

            {/* Right section with Profile/Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link to="/courses" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                    My Learning
                </Link>

                <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: '8px',
                        height: '8px',
                        background: 'var(--accent-primary)',
                        borderRadius: '50%'
                    }} />
                </button>

                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '0.9rem'
                        }}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="card" style={{
                            position: 'absolute',
                            top: '120%',
                            right: 0,
                            width: '240px',
                            padding: '0.5rem',
                            zIndex: 100,
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user?.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@{user?.username}</div>
                            </div>

                            <Link to="/profile" className="profile-item" style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                                color: 'var(--text-secondary)', textDecoration: 'none', borderRadius: 'var(--radius-sm)'
                            }}>
                                <User size={16} /> Profile
                            </Link>
                            <Link to="/settings" className="profile-item" style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                                color: 'var(--text-secondary)', textDecoration: 'none', borderRadius: 'var(--radius-sm)'
                            }}>
                                <Settings size={16} /> Settings
                            </Link>

                            <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

                            <button onClick={onLogout} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                                color: '#ef4444', background: 'none', border: 'none', width: '100%', cursor: 'pointer',
                                textAlign: 'left', borderRadius: 'var(--radius-sm)'
                            }}>
                                <LogOut size={16} /> Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .profile-item:hover {
          background: var(--bg-secondary);
          color: var(--text-primary) !important;
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
