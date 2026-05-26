import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, setFilters } from './taskSlice';
import { fetchProjects } from '../projects/projectSlice';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import api from '../../services/api';

export default function TasksPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.tasks);
  const { list: projects } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.role === 'admin';

  const [filters, setLocalFilters] = useState({ status: '', projectId: '' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  const loadMembers = async (projectId) => {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProjectMembers(data.data?.members || []);
    } catch {
      setProjectMembers([]);
    }
  };

  const handleOpenCreate = async () => {
    const firstProject = projects[0];
    if (firstProject) {
      setSelectedProjectId(String(firstProject.id));
      await loadMembers(firstProject.id);
    }
    setShowTaskForm(true);
  };

  const handleProjectChange = async (e) => {
    const id = e.target.value;
    setSelectedProjectId(id);
    if (id) await loadMembers(id);
  };

  const handleCreateTask = async (data) => {
    if (!selectedProjectId) return;
    await dispatch(createTask({ ...data, projectId: Number(selectedProjectId) }));
    dispatch(fetchTasks());
  };

  const handleFilterChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setLocalFilters(updated);
    const params = {};
    if (updated.status)    params.status    = updated.status;
    if (updated.projectId) params.projectId = updated.projectId;
    dispatch(setFilters(params));
    dispatch(fetchTasks(params));
  };

  const handleClearFilters = () => {
    setLocalFilters({ status: '', projectId: '' });
    dispatch(fetchTasks());
  };

  const filtered = list.filter((t) => {
    if (filters.status    && t.status    !== filters.status)                  return false;
    if (filters.projectId && String(t.projectId) !== String(filters.projectId)) return false;
    return true;
  });

  const projectsForFilter = [
    ...new Map(list.map((t) => [t.projectId, t.project]).filter(([, p]) => p)).values(),
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Tasks</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Work Queue</h1>
          <p className="mt-2 text-sm text-slate-500">{filtered.length} task{filtered.length !== 1 ? 's' : ''} match the current view.</p>
        </div>
        {isAdmin && projects.length > 0 && (
          <button id="create-task-btn" onClick={handleOpenCreate} className="btn-primary self-start sm:self-auto">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        )}
        {isAdmin && projects.length === 0 && (
          <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">Create a project first to add tasks.</p>
        )}
      </div>

      <section className="card">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Filters</h2>
            <p className="mt-1 text-sm text-slate-500">Narrow the task queue by current status or project.</p>
          </div>
          {(filters.status || filters.projectId) && (
            <button className="btn-secondary self-start" onClick={handleClearFilters}>Clear Filters</button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">Filter by Status</label>
            <select name="status" className="input" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="label">Filter by Project</label>
            <select name="projectId" className="input" value={filters.projectId} onChange={handleFilterChange}>
              <option value="">All Projects</option>
              {projectsForFilter.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="h-4 w-2/3 rounded bg-slate-100" />
              <div className="mt-3 h-3 w-full rounded bg-slate-100" />
              <div className="mt-8 h-8 w-24 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="mt-5 text-lg font-bold text-slate-950">No tasks found</p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            {filters.status || filters.projectId ? 'Try clearing your filters to see more work.' : 'Create a task from a project or use the new task button.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <label className="label">Project *</label>
              <select className="input" value={selectedProjectId} onChange={handleProjectChange}>
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <TaskForm
              task={null}
              members={projectMembers}
              onSubmit={handleCreateTask}
              onClose={() => setShowTaskForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
