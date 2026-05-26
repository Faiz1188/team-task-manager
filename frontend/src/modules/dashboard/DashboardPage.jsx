import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDashboard } from '../tasks/taskSlice';

const StatCard = ({ label, value, tone, icon }) => (
  <div className="card flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${tone}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold tracking-tight text-slate-950">{value ?? ''}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
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
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Monitor workload, overdue items, and team activity from one clean workspace.</p>
        </div>
        <Link to="/tasks" className="btn-primary self-start sm:self-auto">View Tasks</Link>
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          Loading dashboard
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Tasks" value={dashboard?.total}
          tone="bg-primary-50 text-primary-600"
          icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard label="To Do" value={dashboard?.todo}
          tone="bg-slate-100 text-slate-600"
          icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="In Progress" value={dashboard?.inProgress}
          tone="bg-amber-50 text-amber-600"
          icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        />
        <StatCard label="Done" value={dashboard?.done}
          tone="bg-emerald-50 text-emerald-600"
          icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Overdue" value={dashboard?.overdue}
          tone="bg-red-50 text-red-600"
          icon={<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="card xl:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Recent Tasks</h2>
              <p className="mt-1 text-sm text-slate-500">Latest work across your accessible projects.</p>
            </div>
            <Link to="/tasks" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View all</Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <p className="font-semibold text-slate-700">No tasks yet</p>
              <p className="mt-1 text-sm text-slate-500">Create tasks from a project to start tracking progress.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{task.title}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">{task.project?.name || 'No project'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {task.isOverdue && <span className="badge-overdue">Overdue</span>}
                    {statusBadge(task.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card border-red-100 bg-red-50/40">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <div>
              <h2 className="text-lg font-bold text-slate-950">Overdue Tasks</h2>
              <p className="mt-1 text-sm text-slate-500">Items needing quick attention.</p>
            </div>
          </div>

          {overdueTasks.length === 0 ? (
            <div className="rounded-2xl border border-red-100 bg-white px-5 py-8 text-center">
              <p className="font-semibold text-slate-700">No overdue tasks</p>
              <p className="mt-1 text-sm text-slate-500">Your board is currently on schedule.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-red-100 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                  <p className="mt-2 text-xs font-semibold text-red-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  {task.assignedUser && (
                    <p className="mt-1 text-xs text-slate-500">Assigned to {task.assignedUser.name}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link to="/projects" className="card group flex items-center justify-between gap-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Projects</p>
            <p className="mt-2 text-lg font-bold text-slate-950">Manage team projects</p>
            <p className="mt-1 text-sm text-slate-500">Review project membership and tasks.</p>
          </div>
          <span className="rounded-full bg-primary-50 px-3 py-2 text-primary-600 transition-colors group-hover:bg-primary-100">View</span>
        </Link>
        <Link to="/tasks" className="card group flex items-center justify-between gap-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Tasks</p>
            <p className="mt-2 text-lg font-bold text-slate-950">Open task queue</p>
            <p className="mt-1 text-sm text-slate-500">Filter work by project and status.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-600 transition-colors group-hover:bg-emerald-100">View</span>
        </Link>
      </div>
    </div>
  );
}
