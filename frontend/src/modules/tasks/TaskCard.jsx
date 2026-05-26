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
    dispatch(updateTaskStatus({ id: task.id, status }));
  };

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) dispatch(deleteTask(task.id));
  };

  const { cls } = statusMap[task.status] || statusMap['todo'];

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-5 text-slate-950">{task.title}</h3>
          {task.project?.name && (
            <p className="mt-1 text-xs font-medium text-slate-500">{task.project.name}</p>
          )}
        </div>
        {isAdmin && (
          <div className="flex flex-shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            {onEdit && (
              <button onClick={() => onEdit(task)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                aria-label="Edit task">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button onClick={handleDelete}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Delete task">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {task.description && (
        <p className="mt-3 text-sm leading-6 text-slate-500 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={handleStatusClick} disabled={!canChangeStatus}
          className={`${cls} ${canChangeStatus ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
          title={canChangeStatus ? `Click to mark as ${nextStatus[task.status]}` : 'Not assignee'}>
          {statusMap[task.status]?.label}
        </button>
        {task.isOverdue && <span className="badge-overdue">Overdue</span>}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-xs font-semibold text-slate-500">
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
        </div>
        {task.assignedUser ? (
          <div className="flex items-center gap-2" title={task.assignedUser.name}>
            <span className="hidden text-xs font-medium text-slate-500 sm:inline">{task.assignedUser.name}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {task.assignedUser.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <span className="text-xs font-medium text-slate-400">Unassigned</span>
        )}
      </div>
    </article>
  );
}
