import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from './taskSlice';
import api from '../../services/api';

export default function TaskForm({ task, members = [], onSubmit, onClose }) {
  const dispatch  = useDispatch();
  const { user }  = useSelector((s) => s.auth);
  const isAdmin   = user?.role === 'admin';
  const isEdit    = Boolean(task);

  const [submitting, setSubmitting] = useState(false);
  const [allUsers, setAllUsers]     = useState(null);
  const [form, setForm] = useState(() => ({
    title:          task?.title          || '',
    description:    task?.description    || '',
    status:         task?.status         || 'todo',
    dueDate:        task?.dueDate        || '',
    assignedUserId: task?.assignedUserId != null ? String(task.assignedUserId) : '',
  }));

  useEffect(() => {
    if (!isAdmin) return;

    let cancelled = false;
    api.get('/users')
      .then(({ data }) => {
        if (!cancelled) setAllUsers(data.data || []);
      })
      .catch(() => {
        if (!cancelled) setAllUsers([]);
      });

    return () => { cancelled = true; };
  }, [isAdmin]);

  const loadingUsers = isAdmin && allUsers === null;
  const assigneeOptions = isAdmin ? (allUsers || []) : members;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        assignedUserId: form.assignedUserId ? Number(form.assignedUserId) : null,
        dueDate:        form.dueDate || null,
      };

      if (isEdit) {
        await dispatch(updateTask({ id: task.id, ...payload }));
      } else {
        await onSubmit(payload);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">{isEdit ? 'Edit Task' : 'New Task'}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">{isEdit ? 'Update task details' : 'Create task'}</h2>
        <p className="mt-1 text-sm text-slate-500">Set ownership, status, and timing for this piece of work.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Title *</label>
          <input name="title" className="input" required placeholder="Task title"
            value={form.title} onChange={handleChange} />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea name="description" className="input resize-none" rows={3}
            placeholder="Optional details"
            value={form.description} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Status</label>
            <select name="status" className="input" value={form.status} onChange={handleChange}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="label">Due Date</label>
            <input name="dueDate" type="date" className="input"
              value={form.dueDate} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="label">
            Assign To
            {isAdmin && (
              <span className="ml-2 text-xs font-medium text-slate-400">all users</span>
            )}
          </label>
          <select name="assignedUserId" className="input"
            value={form.assignedUserId} onChange={handleChange}
            disabled={loadingUsers}>
            <option value="">
              {loadingUsers ? 'Loading users' : 'Unassigned'}
            </option>
            {assigneeOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} - {u.role}
              </option>
            ))}
          </select>
          {isAdmin && assigneeOptions.length === 0 && !loadingUsers && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              No other users found. Make sure members have signed up.
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={submitting || loadingUsers}
            className="btn-primary flex-1">
            {submitting ? 'Saving' : isEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </>
  );
}
