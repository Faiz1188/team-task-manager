import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProject, addMember, removeMember, updateProject, clearCurrentProject } from './projectSlice';
import { fetchTasks, createTask } from '../tasks/taskSlice';
import TaskCard from '../tasks/TaskCard';
import TaskForm from '../tasks/TaskForm';
import api from '../../services/api';

export default function ProjectDetail() {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { current, loading } = useSelector((s) => s.projects);
  const { list: tasks }      = useSelector((s) => s.tasks);
  const { user }             = useSelector((s) => s.auth);
  const isAdmin = user?.role === 'admin';

  const [allUsers, setAllUsers]       = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask]         = useState(null);
  const [editingProject, setEditingProject] = useState(false);
  const [projectForm, setProjectForm]   = useState({ name: '', description: '' });

  useEffect(() => {
    dispatch(fetchProject(id));
    dispatch(fetchTasks({ projectId: id }));
    if (isAdmin) {
      api.get('/users').then(({ data }) => setAllUsers(data.data || [])).catch(() => {});
    }
    return () => dispatch(clearCurrentProject());
  }, [id, dispatch, isAdmin]);

  const projectTasks = tasks.filter((t) => String(t.projectId) === String(id));
  const memberIds    = (current?.members || []).map((m) => m.id);
  const nonMembers   = allUsers.filter((u) => !memberIds.includes(u.id));

  const handleAddMember = (userId) => dispatch(addMember({ projectId: id, userId }));
  const handleRemoveMember = (uid) => {
    if (window.confirm('Remove this member?')) dispatch(removeMember({ projectId: id, uid }));
  };
  const handleSaveProject = async (e) => {
    e.preventDefault();
    await dispatch(updateProject({ id: Number(id), ...projectForm }));
    setEditingProject(false);
  };

  const handleCreateTask = async (data) => {
    await dispatch(createTask({ ...data, projectId: Number(id) }));
  };

  if (loading && !current) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm" />
      </div>
    );
  }

  if (!current) return (
    <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">Project not found.</div>
  );

  const tasksByStatus = {
    'todo':        projectTasks.filter((t) => t.status === 'todo'),
    'in-progress': projectTasks.filter((t) => t.status === 'in-progress'),
    'done':        projectTasks.filter((t) => t.status === 'done'),
  };

  const columnConfig = [
    { key: 'todo',        label: 'To Do',        tone: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
    { key: 'in-progress', label: 'In Progress',  tone: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
    { key: 'done',        label: 'Done',         tone: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <button onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary-700">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </button>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {editingProject ? (
          <form onSubmit={handleSaveProject} className="space-y-4">
            <div>
              <label className="label">Project Name</label>
              <input className="input text-lg font-semibold" value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input resize-none" rows={3} value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setEditingProject(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Project</button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Project Workspace</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{current.name}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{current.description || 'No description provided.'}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">Owner: {current.owner?.name || 'Unknown'}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">{current.members?.length || 0} member{(current.members?.length || 0) !== 1 ? 's' : ''}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">{projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            {isAdmin && (
              <button onClick={() => {
                setProjectForm({ name: current.name, description: current.description || '' });
                setEditingProject(true);
              }} className="btn-secondary self-start">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Project
              </button>
            )}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <section className="xl:col-span-3">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Task Board</h2>
              <p className="mt-1 text-sm text-slate-500">Move work through the project lifecycle.</p>
            </div>
            {isAdmin && (
              <button id="add-task-btn" onClick={() => { setEditTask(null); setShowTaskForm(true); }} className="btn-primary self-start sm:self-auto">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {columnConfig.map(({ key, label, tone, dot }) => (
              <div key={key} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone}`}>{label}</span>
                  <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {tasksByStatus[key].length}
                  </span>
                </div>
                <div className="space-y-3 min-h-40">
                  {tasksByStatus[key].map((task) => (
                    <TaskCard key={task.id} task={task}
                      onEdit={isAdmin ? (t) => { setEditTask(t); setShowTaskForm(true); } : null} />
                  ))}
                  {tasksByStatus[key].length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-400">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="card h-fit">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-950">Members</h2>
            <p className="mt-1 text-sm text-slate-500">{current.members?.length || 0} people assigned.</p>
          </div>

          <div className="space-y-3">
            {(current.members || []).map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{member.name}</p>
                    <span className={member.role === 'admin' ? 'badge-admin mt-1' : 'badge-member mt-1'}>{member.role}</span>
                  </div>
                </div>
                {isAdmin && member.id !== current.ownerId && (
                  <button onClick={() => handleRemoveMember(member.id)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove member">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {isAdmin && nonMembers.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <label className="label">Add Member</label>
              <select className="input"
                onChange={(e) => { if (e.target.value) handleAddMember(Number(e.target.value)); e.target.value = ''; }}
                defaultValue="">
                <option value="" disabled>Select user</option>
                {nonMembers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          )}
        </aside>
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <TaskForm
              key={editTask?.id ?? 'new'}
              task={editTask}
              members={current.members || []}
              onSubmit={handleCreateTask}
              onClose={() => setShowTaskForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
