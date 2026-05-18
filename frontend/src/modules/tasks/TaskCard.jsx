import { useDispatch, useSelector } from 'react-redux';
import { updateTaskStatus, deleteTask } from './taskSlice';

const statusMap = {
  'todo':        { label: 'To Do',       cls: 'badge-todo' },
  'in-progress': { label: 'In Progress', cls: 'badge-progress' },
  'done':        { label: 'Done',        cls: 'badge-done' },
};
const nextStatus = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };

export default function TaskCard({ task, onEdit }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const isAdmin  = user?.role === 'admin';
  const isOwn    = task.assignedUserId === user?.id;
  const canChangeStatus = isAdmin || isOwn;

  const handleStatusClick = () => {
    if (!canChangeStatus) return;
    const status = nextStatus[task.status];
    if (isAdmin) {
      dispatch(updateTaskStatus({ id: task.id, status }));
    } else {
      dispatch(updateTaskStatus({ id: task.id, status }));
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) dispatch(deleteTask(task.id));
  };

  const { cls } = statusMap[task.status] || statusMap['todo'];

  return (
    <div className="bg-dark-800 rounded-lg border border-slate-800 p-3.5 hover:border-slate-700 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-slate-100 leading-tight">{task.title}</p>
        {isAdmin && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {onEdit && (
              <button onClick={() => onEdit(task)}
                className="text-slate-500 hover:text-primary-400 p-0.5 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button onClick={handleDelete}
              className="text-slate-500 hover:text-red-400 p-0.5 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 mb-2.5 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-1.5">
        <div className="flex items-center gap-1.5">
          <button onClick={handleStatusClick} disabled={!canChangeStatus}
            className={`${cls} cursor-${canChangeStatus ? 'pointer' : 'default'} hover:opacity-80 transition-opacity`}
            title={canChangeStatus ? `Click to mark as ${nextStatus[task.status]}` : 'Not assignee'}>
            {statusMap[task.status]?.label}
          </button>
          {task.isOverdue && <span className="badge-overdue">Overdue</span>}
        </div>

        <div className="flex items-center gap-1.5">
          {task.dueDate && (
            <span className="text-xs text-slate-500">
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
          {task.assignedUser && (
            <div title={task.assignedUser.name}
              className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {task.assignedUser.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
