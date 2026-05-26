import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage     from './modules/auth/LoginPage';
import SignupPage    from './modules/auth/SignupPage';
import DashboardPage from './modules/dashboard/DashboardPage';
import ProjectList   from './modules/projects/ProjectList';
import ProjectDetail from './modules/projects/ProjectDetail';
import TasksPage     from './modules/tasks/TasksPage';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const { token } = useSelector((s) => s.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"  element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <SignupPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><DashboardPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute>
            <Layout><ProjectList /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute>
            <Layout><ProjectDetail /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Layout><TasksPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
}
