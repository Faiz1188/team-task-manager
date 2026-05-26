import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from './authSlice';

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (token) navigate('/dashboard');
    return () => dispatch(clearError());
  }, [token, navigate, dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:grid lg:grid-cols-2 lg:px-0 lg:py-0">
      <section className="hidden bg-primary-700 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.5-4.5L12 2 3.5 5.5v6.2c0 5.1 3.6 9.8 8.5 10.8 4.9-1 8.5-5.7 8.5-10.8V5.5z" />
            </svg>
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-primary-100">TaskFlow</p>
          <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight">A clean workspace for projects, people, and delivery.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-primary-100">Sign in to review team progress, manage project membership, and keep assigned tasks moving through the board.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-primary-50">
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-2xl font-bold">3</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-100">Task states</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-2xl font-bold">2</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-100">User roles</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-2xl font-bold">1</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-100">Team view</p>
          </div>
        </div>
      </section>

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center lg:min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm shadow-primary-600/25 lg:mx-0">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">Sign in to continue to your team dashboard.</p>
          </div>

          <div className="card">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label" htmlFor="login-email">Email</label>
                <input id="login-email" name="email" type="email" required
                  className="input" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} />
              </div>
              <div>
                <label className="label" htmlFor="login-password">Password</label>
                <input id="login-password" name="password" type="password" required
                  className="input" placeholder="Enter your password"
                  value={form.password} onChange={handleChange} />
              </div>
              <button id="login-submit" type="submit" disabled={loading}
                className="btn-primary w-full">
                {loading ? 'Signing in' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
