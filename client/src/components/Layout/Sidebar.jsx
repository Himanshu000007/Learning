import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, BookOpen, Settings, Zap, LogIn, LogOut, UserPlus, HelpCircle, Shield } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Compass, label: 'Path Visualizer', path: '/paths' },
    { icon: Zap, label: 'Recommendations', path: '/recommendations' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: HelpCircle, label: 'Help & Feedback', path: '/feedback' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Admin nav item (only shown to admins)
  const adminNavItem = { icon: Shield, label: 'Admin Panel', path: '/admin' };

  return (
    <aside className="sidebar glass" style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50
    }}>
      <div className="logo" style={{ marginBottom: '3rem', paddingLeft: '1rem', color: 'var(--text-primary)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--accent-primary)' }}>Dynamo</span>Learn
        </h1>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              fontWeight: isActive ? 500 : 400
            })}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}

        {/* Admin Panel Link (only for admins) */}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? '#f59e0b' : '#f59e0b',
              background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              fontWeight: 500
            })}
          >
            <Shield size={20} />
            Admin Panel
          </NavLink>
        )}

        {/* Auth Links */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {!user ? (
            <>
              <NavLink
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <LogIn size={20} />
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  textDecoration: 'none'
                }}
              >
                <UserPlus size={18} />
                Sign Up
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                color: '#ef4444',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={20} />
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* User Profile */}
      {user && (
        <div className="user-profile" style={{
          marginTop: '1rem',
          padding: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
