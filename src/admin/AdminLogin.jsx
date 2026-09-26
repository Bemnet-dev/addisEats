import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth';
import { Button } from '../ui/Button';
import { KeyRound, User, ArrowLeft, Sparkles, Lock } from 'lucide-react';
export const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      const success = login(username.trim(), password.trim());
      setIsLoading(false);
      if (success) {
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
      else {
        setError('Invalid credentials. Please use valid admin credentials.');
      }
    }, 400);
  };
  const handleQuickLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    login('admin', 'admin123');
    navigate('/admin', { replace: true });
  };
  return (<div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] dark:bg-[#0E0A07] px-4 py-12">
    <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200/80 dark:border-stone-800 p-8 sm:p-10 relative">
      <Link to="/" className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-[#D9381E] mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Return to Customer App
      </Link>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#D9381E] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D9381E]/20">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display">
          Addis Eats Admin Portal
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Access restaurant analytics, dishes CRUD manager, and live order status.
        </p>
      </div>
      {error && (<div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-medium border border-rose-200 dark:border-rose-900">
        {error}
      </div>)}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
            Username
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E]" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
            Password
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin123" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E]" />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
          Sign In to Dashboard
        </Button>
      </form>
      <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
        <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 mb-4">
          <p className="font-bold">Preset Demo Credentials:</p>
          <p>Username: <code className="font-mono font-bold">admin</code></p>
          <p>Password: <code className="font-mono font-bold">admin123</code></p>
        </div>
        <button type="button" onClick={handleQuickLogin} className="inline-flex items-center text-xs font-bold text-[#D9381E] hover:underline cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Quick 1-Click Demo Login
        </button>
      </div>
    </div>
  </div>);
};
