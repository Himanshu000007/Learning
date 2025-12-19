import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
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
  const isAuthPage = ['/login', '/register', '/admin/login'].includes(location.pathname);
  const isNoSidebarPage = isAuthPage || location.pathname === '/path-visualizer';

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {!isNoSidebarPage && <Sidebar />}
      <main style={{
        flex: 1,
        marginLeft: !isNoSidebarPage ? '260px' : '0',
        padding: '2rem',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        // Ensure content doesn't get hidden behind fixed sidebar if styled differently
        transition: 'margin-left 0.3s ease'
      }}>
        <div className="container" style={{ height: '100%' }}>
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
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
