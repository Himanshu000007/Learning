import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar'; // Import Navbar
import MickAI from './components/AI/MickAI';

// Pages
import Dashboard from './pages/Dashboard';
import PathVisualizer from './pages/PathVisualizer';
import Recommendations from './pages/Recommendations';
import CourseList from './pages/Courses/CourseList';
import CourseDetail from './pages/Courses/CourseDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import Feedback from './pages/Feedback';

// Settings placeholder
const Settings = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Settings</h1>
    <div className="card">
      <h3 style={{ marginBottom: '1rem' }}>Account Settings</h3>
      <p style={{ color: 'var(--text-secondary)' }}>Manage your account preferences and profile.</p>
    </div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isAuthPage = ['/login', '/register', '/admin/login'].includes(location.pathname);
  const isNoSidebarPage = isAuthPage || location.pathname === '/path-visualizer';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {!isNoSidebarPage && (
        <div style={{
          width: sidebarOpen ? '260px' : '0',
          transition: 'width 0.3s ease',
          overflow: 'hidden'
        }}>
          <Sidebar user={user} />
        </div>
      )}

      <main style={{
        flex: 1,
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {!isNoSidebarPage && (
          <Navbar
            user={user}
            onLogout={handleLogout}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        )}

        <div className="container" style={{
          height: '100%',
          padding: isNoSidebarPage ? '0' : '0 2rem',
          maxWidth: '100%',
          width: '100%'
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/paths" element={<PathVisualizer />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </div>
      </main>
      <MickAI />
    </div>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
