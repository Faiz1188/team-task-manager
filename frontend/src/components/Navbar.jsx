import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../modules/auth/authSlice';

export default function Navbar() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-dark-800 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">TaskFlow</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/dashboard"
              className="text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-dark-700">
              Dashboard
            </Link>
            <Link to="/projects"
              className="text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-dark-700">
              Projects
            </Link>
            <Link to="/tasks"
              className="text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-dark-700">
              Tasks
            </Link>
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3">
              <span className={user.role === 'admin' ? 'badge-admin' : 'badge-member'}>
                {user.role}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-300 hidden sm:block">{user.name}</span>
              </div>
              <button id="logout-btn" onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 text-sm transition-colors ml-1">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
