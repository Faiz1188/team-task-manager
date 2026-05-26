import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../modules/auth/authSlice';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h8V3H3v10zm10 8h8V3h-8v18zM3 21h8v-6H3v6z" />
      </svg>
    ),
  },
  {
    to: '/projects',
    label: 'Projects',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    to: '/tasks',
    label: 'Tasks',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4" />
      </svg>
    ),
  },
];

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-100'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`;

function Brand() {
  return (
    <NavLink to="/dashboard" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm shadow-primary-600/30">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.5-4.5L12 2 3.5 5.5v6.2c0 5.1 3.6 9.8 8.5 10.8 4.9-1 8.5-5.7 8.5-10.8V5.5z" />
        </svg>
      </div>
      <div>
        <p className="text-base font-bold leading-none text-slate-950">TaskFlow</p>
        <p className="mt-1 text-xs font-medium text-slate-500">Team workspace</p>
      </div>
    </NavLink>
  );
}

export default function Navbar() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm">
        <Brand />

        <div className="mt-8 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signed in as</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
              <span className={user?.role === 'admin' ? 'badge-admin mt-1' : 'badge-member mt-1'}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">Team Task Manager</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Track project ownership, assigned tasks, and delivery status from one workspace.</p>
          <button id="logout-btn" onClick={handleLogout} className="btn-secondary mt-4 w-full">
            Logout
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Brand />
          <button onClick={handleLogout} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            Logout
          </button>
        </div>
        <nav className="mt-3 grid grid-cols-3 gap-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors ${
                isActive ? 'bg-primary-50 text-primary-700' : 'bg-slate-50 text-slate-600'
              }`
            }>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  );
}
