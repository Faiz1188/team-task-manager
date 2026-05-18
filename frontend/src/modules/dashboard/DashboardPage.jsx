import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDashboard } from '../tasks/taskSlice';

const StatCard = ({ label, value, color, icon }) => (
  <div className="card flex items-center gap-4 hover:border-slate-700 transition-colors">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
      <p className="text-sm text-slate-400 mt-0.5">{label}</p>
    </div>
  </div>
);

const statusBadge = (status) => {
  if (status === 'done')        return <span className="badge-done">Done</span>;
  if (status === 'in-progress') return <span className="badge-progress">In Progress</span>;
  return <span className="badge-todo">To Do</span>;
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { dashboard, loading } = useSelector((s) => s.tasks);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  const overdueTasks = dashboard?.tasks?.filter((t) => t.isOverdue) || [];
  const recentTasks  = dashboard?.tasks?.slice(0, 8) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="text-primary-500">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">Here's what's happening with your team today.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 mb-6">
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          Loading dashboard…
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Tasks" value={dashboard?.total}
          color="bg-primary-600/20"
          icon={<svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>}
        />
        <StatCard label="To Do" value={dashboard?.todo}
          color="bg-slate-600/30"
          icon={<svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="In Progress" value={dashboard?.inProgress}
          color="bg-amber-600/20"
          icon={<svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        />
        <StatCard label="Done" value={dashboard?.done}
          color="bg-emerald-600/20"
          icon={<svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Overdue" value={dashboard?.overdue}
          color="bg-red-600/20"
          icon={<svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Tasks</h2>
            <Link to="/tasks" className="text-primary-500 text-sm hover:text-primary-400">View all →</Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">No tasks yet. Create one from a project!</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id}
                  className="flex items-center justify-between p-3 bg-dark-700 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{task.project?.name}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    {task.isOverdue && <span className="badge-overdue">Overdue</span>}
                    {statusBadge(task.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue Tasks */}
        <div className="card">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Overdue Tasks
          </h2>
          {overdueTasks.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">🎉 No overdue tasks!</p>
          ) : (
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <div key={task.id} className="p-3 bg-red-900/20 rounded-lg border border-red-900/40">
                  <p className="text-sm font-medium text-slate-200">{task.title}</p>
                  <p className="text-xs text-red-400 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  {task.assignedUser && (
                    <p className="text-xs text-slate-500 mt-0.5">→ {task.assignedUser.name}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link to="/projects"
          className="card hover:border-primary-600/50 transition-all duration-200 flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center group-hover:bg-primary-600/40 transition-colors">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-white text-sm">View Projects</p>
            <p className="text-xs text-slate-400">Manage your team projects</p>
          </div>
        </Link>
        <Link to="/tasks"
          className="card hover:border-primary-600/50 transition-all duration-200 flex items-center gap-3 group">
          <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-600/40 transition-colors">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M15 11l-3 3-1.5-1.5" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-white text-sm">View All Tasks</p>
            <p className="text-xs text-slate-400">Filter and track task progress</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
