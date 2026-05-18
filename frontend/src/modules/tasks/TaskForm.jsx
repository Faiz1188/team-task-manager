import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from './taskSlice';
import api from '../../services/api';

/**
 * TaskForm — reusable create/edit form.
 *
 * When `task` is null → create mode (calls onSubmit(data), then onClose)
 * When `task` is set  → edit mode  (dispatches updateTask, then calls onClose)
 *
 * The parent renders the modal backdrop. This component renders ONLY the form.
 *
 * "Assign To" dropdown:
 *  - Admin: shows ALL registered users (fetched from /api/users)
 *  - Member: shows the `members` prop (project members only)
 */
export default function TaskForm({ task, members = [], onSubmit, onClose }) {
  const dispatch  = useDispatch();
  const { user }  = useSelector((s) => s.auth);
  const isAdmin   = user?.role === 'admin';
  const isEdit    = Boolean(task);

  const [submitting, setSubmitting] = useState(false);
  const [allUsers, setAllUsers]     = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    dueDate: '',
    assignedUserId: '',
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title:          task.title          || '',
        description:    task.description    || '',
        status:         task.status         || 'todo',
        dueDate:        task.dueDate        || '',
        assignedUserId: task.assignedUserId != null ? String(task.assignedUserId) : '',
      });
    }
  }, [task]);

  // Admins see ALL users in the assignee dropdown
  useEffect(() => {
    if (isAdmin) {
      setLoadingUsers(true);
      api.get('/users')
        .then(({ data }) => setAllUsers(data.data || []))
        .catch(() => setAllUsers([]))
        .finally(() => setLoadingUsers(false));
    }
  }, [isAdmin]);

  const assigneeOptions = isAdmin ? allUsers : members;

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
      <h2 className="text-xl font-bold text-white mb-5">
        {isEdit ? 'Edit Task' : 'New Task'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="label">Title *</label>
          <input name="title" className="input" required placeholder="Task title"
            value={form.title} onChange={handleChange} />
        </div>

        {/* Description */}
        <div>
          <label className="label">Description</label>
          <textarea name="description" className="input resize-none" rows={3}
            placeholder="Optional details…"
            value={form.description} onChange={handleChange} />
        </div>

        {/* Status + Due Date */}
        <div className="grid grid-cols-2 gap-3">
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

        {/* Assign To */}
        <div>
          <label className="label">
            Assign To
            {isAdmin && (
              <span className="ml-2 text-xs text-slate-500 font-normal">(all users)</span>
            )}
          </label>
          <select name="assignedUserId" className="input"
            value={form.assignedUserId} onChange={handleChange}
            disabled={loadingUsers}>
            <option value="">
              {loadingUsers ? 'Loading users…' : 'Unassigned'}
            </option>
            {assigneeOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.role}
              </option>
            ))}
          </select>
          {isAdmin && assigneeOptions.length === 0 && !loadingUsers && (
            <p className="text-xs text-amber-400 mt-1">
              No other users found. Make sure members have signed up.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={submitting || loadingUsers}
            className="btn-primary flex-1">
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </>
  );
}
