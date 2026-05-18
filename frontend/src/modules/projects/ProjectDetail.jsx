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
      api.get('/users').then(({ data }) => setAllUsers(data.data)).catch(() => {});
    }
    return () => dispatch(clearCurrentProject());
  }, [id, dispatch, isAdmin]);

  useEffect(() => {
    if (current) setProjectForm({ name: current.name, description: current.description || '' });
  }, [current]);

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
    // TaskForm calls onClose() itself after this resolves
  };

  if (loading && !current) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card animate-pulse h-40" />
      </div>
    );
  }

  if (!current) return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-400">Project not found.</div>
  );

  const tasksByStatus = {
    'todo':        projectTasks.filter((t) => t.status === 'todo'),
    'in-progress': projectTasks.filter((t) => t.status === 'in-progress'),
    'done':        projectTasks.filter((t) => t.status === 'done'),
  };

  const columnConfig = [
    { key: 'todo',        label: 'To Do',       dot: 'bg-slate-400' },
    { key: 'in-progress', label: 'In Progress',  dot: 'bg-amber-400' },
    { key: 'done',        label: 'Done',         dot: 'bg-emerald-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button onClick={() => navigate('/projects')}
        className="flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
         Back to Projects
      </button>

      {/* Project Header */}
      <div className="card mb-6">
        {editingProject ? (
          <form onSubmit={handleSaveProject} className="space-y-3">
            <input className="input text-xl font-bold" value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} required />
            <textarea className="input resize-none" rows={2} value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditingProject(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{current.name}</h1>
              <p className="text-slate-400 mt-1">{current.description || 'No description.'}</p>
              <p className="text-xs text-slate-500 mt-2">Owner: {current.owner?.name}</p>
            </div>
            {isAdmin && (
              <button onClick={() => setEditingProject(true)}
                className="btn-secondary text-sm flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Task Board */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Task Board</h2>
            {isAdmin && (
              <button id="add-task-btn" onClick={() => { setEditTask(null); setShowTaskForm(true); }}
                className="btn-primary text-sm flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columnConfig.map(({ key, label, dot }) => (
              <div key={key} className="bg-dark-800/50 rounded-xl border border-slate-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-sm font-medium text-slate-300">{label}</span>
                  <span className="ml-auto text-xs text-slate-500 bg-dark-700 px-2 py-0.5 rounded-full">
                    {tasksByStatus[key].length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[120px]">
                  {tasksByStatus[key].map((task) => (
                    <TaskCard key={task.id} task={task}
                      onEdit={isAdmin ? (t) => { setEditTask(t); setShowTaskForm(true); } : null} />
                  ))}
                  {tasksByStatus[key].length === 0 && (
                    <p className="text-slate-600 text-xs text-center py-6">No tasks</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Members Panel */}
        <div>
          <div className="card">
            <h2 className="font-semibold text-white mb-4">Members ({current.members?.length || 0})</h2>
            <div className="space-y-2.5">
              {(current.members || []).map((member) => (
                <div key={member.id}
                  className="flex items-center justify-between group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{member.name}</p>
                      <span className={member.role === 'admin' ? 'badge-admin' : 'badge-member'} style={{ fontSize: '10px' }}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                  {isAdmin && member.id !== current.ownerId && (
                    <button onClick={() => handleRemoveMember(member.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1 flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Member */}
            {isAdmin && nonMembers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Add Member</p>
                <select className="input text-sm"
                  onChange={(e) => { if (e.target.value) handleAddMember(Number(e.target.value)); e.target.value = ''; }}
                  defaultValue="">
                  <option value="" disabled>Select user</option>
                  {nonMembers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md shadow-2xl">
            <TaskForm
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
