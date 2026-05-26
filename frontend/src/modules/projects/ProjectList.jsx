import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects, createProject, deleteProject } from './projectSlice';

export default function ProjectList() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.role === 'admin';

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await dispatch(createProject(form));
    setSubmitting(false);
    setShowModal(false);
    setForm({ name: '', description: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project? All tasks will be removed.')) {
      dispatch(deleteProject(id));
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Projects</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Team Projects</h1>
          <p className="mt-2 text-sm text-slate-500">{list.length} project{list.length !== 1 ? 's' : ''} available in your workspace.</p>
        </div>
        {isAdmin && (
          <button id="create-project-btn" onClick={() => setShowModal(true)} className="btn-primary self-start sm:self-auto">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        )}
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-slate-100" />
              <div className="mt-6 h-4 w-2/3 rounded bg-slate-100" />
              <div className="mt-3 h-3 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <p className="mt-5 text-lg font-bold text-slate-950">No projects yet</p>
          <p className="mt-2 max-w-md text-sm text-slate-500">Create a project to organize members, assign tasks, and track progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((project) => (
            <article key={project.id} className="card group flex min-h-56 flex-col transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(project.id)}
                    className="rounded-lg p-2 text-slate-400 opacity-100 transition-colors hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Delete project">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-950">{project.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-500 line-clamp-3">
                {project.description || 'No description provided.'}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex -space-x-2">
                  {(project.members || []).slice(0, 4).map((m) => (
                    <div key={m.id} title={m.name}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-xs font-bold text-primary-700">
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {(project.members?.length || 0) > 4 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-600">
                      +{project.members.length - 4}
                    </div>
                  )}
                </div>
                <Link to={`/projects/${project.id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">New Project</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Create project</h2>
              <p className="mt-1 text-sm text-slate-500">Add a workspace for tasks and team members.</p>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Project Name</label>
                <input className="input" required placeholder="e.g. Website Redesign"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input resize-none" rows={3} placeholder="Optional description"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Creating' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
