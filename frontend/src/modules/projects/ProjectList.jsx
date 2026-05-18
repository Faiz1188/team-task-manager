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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">{list.length} project{list.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button id="create-project-btn" onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        )}
      </div>

      {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse h-40 bg-dark-700" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">No projects yet</p>
          {isAdmin && <p className="text-slate-500 text-sm mt-1">Create your first project to get started.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((project) => (
            <div key={project.id}
              className="card hover:border-slate-700 transition-all duration-200 group flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(project.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <h3 className="font-semibold text-white text-lg">{project.name}</h3>
              <p className="text-slate-400 text-sm mt-1 flex-1 line-clamp-2">
                {project.description || 'No description provided.'}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {(project.members || []).slice(0, 4).map((m) => (
                    <div key={m.id} title={m.name}
                      className="w-7 h-7 bg-primary-600 rounded-full border-2 border-dark-800 flex items-center justify-center text-xs font-bold text-white">
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {(project.members?.length || 0) > 4 && (
                    <div className="w-7 h-7 bg-slate-700 rounded-full border-2 border-dark-800 flex items-center justify-center text-xs text-slate-300">
                      +{project.members.length - 4}
                    </div>
                  )}
                </div>
                <Link to={`/projects/${project.id}`}
                  className="text-primary-500 text-sm hover:text-primary-400 font-medium transition-colors">
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5">New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Project Name</label>
                <input className="input" required placeholder="e.g. Website Redesign"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input resize-none" rows={3} placeholder="Optional description…"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Creating…' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
