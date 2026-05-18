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

  // When admin opens the create modal, pre-select first project and load its members
  const handleOpenCreate = async () => {
    const firstProject = projects[0];
    if (firstProject) {
      setSelectedProjectId(String(firstProject.id));
      await loadMembers(firstProject.id);
    }
    setShowTaskForm(true);
  };

  const loadMembers = async (projectId) => {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProjectMembers(data.data?.members || []);
    } catch {
      setProjectMembers([]);
    }
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

  const filtered = list.filter((t) => {
    if (filters.status    && t.status    !== filters.status)                  return false;
    if (filters.projectId && String(t.projectId) !== String(filters.projectId)) return false;
    return true;
  });

  const projectsForFilter = [
    ...new Map(list.map((t) => [t.projectId, t.project]).filter(([, p]) => p)).values(),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">All Tasks</h1>
          <p className="text-slate-400 mt-1">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && projects.length > 0 && (
          <button id="create-task-btn" onClick={handleOpenCreate}
            className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        )}
        {isAdmin && projects.length === 0 && (
          <p className="text-slate-500 text-sm italic">Create a project first to add tasks.</p>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[160px]">
          <label className="label">Filter by Status</label>
          <select name="status" className="input" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="label">Filter by Project</label>
          <select name="projectId" className="input" value={filters.projectId} onChange={handleFilterChange}>
            <option value="">All Projects</option>
            {projectsForFilter.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        {(filters.status || filters.projectId) && (
          <div className="flex items-end">
            <button className="btn-secondary text-sm"
              onClick={() => { setLocalFilters({ status: '', projectId: '' }); dispatch(fetchTasks()); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card animate-pulse h-28 bg-dark-700" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-14 h-14 bg-dark-700 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">No tasks found</p>
          <p className="text-slate-500 text-sm mt-1">
            {filters.status || filters.projectId ? 'Try clearing your filters.' : 'Create a task from a project or use the button above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md shadow-2xl">
            {/* Project selector at top of modal */}
            <div className="mb-5">
              <label className="label">Project *</label>
              <select className="input" value={selectedProjectId} onChange={handleProjectChange}>
                <option value="">Select a project…</option>
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
