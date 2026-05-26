import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, clearError } from './authSlice';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });

  useEffect(() => {
    if (token) navigate('/dashboard');
    return () => dispatch(clearError());
  }, [token, navigate, dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(form));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:grid lg:grid-cols-2 lg:px-0 lg:py-0">
      <section className="hidden bg-slate-900 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">Create workspace access</p>
          <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight">Join the team board with a role that matches your responsibility.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">Admins can manage projects and tasks. Members can focus on assigned work and update progress.</p>
        </div>

        <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Assessment-ready workflow</p>
          <p className="mt-3 text-2xl font-bold">Auth, roles, projects, and tasks stay connected through the same API.</p>
        </div>
      </section>

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center lg:min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm shadow-primary-600/25 lg:mx-0">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Create account</h1>
            <p className="mt-2 text-sm text-slate-500">Set up your profile and choose your workspace role.</p>
          </div>

          <div className="card">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="signup-name">Full Name</label>
                <input id="signup-name" name="name" type="text" required
                  className="input" placeholder="Jane Smith"
                  value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label className="label" htmlFor="signup-email">Email</label>
                <input id="signup-email" name="email" type="email" required
                  className="input" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} />
              </div>
              <div>
                <label className="label" htmlFor="signup-password">Password</label>
                <input id="signup-password" name="password" type="password" required
                  className="input" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} />
              </div>
              <div>
                <label className="label" htmlFor="signup-role">Role</label>
                <select id="signup-role" name="role"
                  className="input" value={form.role} onChange={handleChange}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button id="signup-submit" type="submit" disabled={loading}
                className="btn-primary w-full">
                {loading ? 'Creating account' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
