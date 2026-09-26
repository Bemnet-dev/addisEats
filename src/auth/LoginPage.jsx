import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { loginUser } from './userService';
import { Button } from '../ui/Button';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Email and password are required');
            return;
        }

        setIsLoading(true);
        try {
            const result = loginUser(email.trim(), password);

            if (result.success) {
                login(result.user);
                const from = location.state?.from?.pathname || '/';
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 300);
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = () => {
        const result = loginUser('demo@addiseats.com', 'demo123456');
        if (result.success) {
            login(result.user);
            navigate('/', { replace: true });
        } else {
            setError('Demo account not found. Please sign up first.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] dark:bg-[#0E0A07] px-4 py-12">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200/80 dark:border-stone-800 p-8 sm:p-10">
                <Link to="/" className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-[#D9381E] mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Store
                </Link>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#D9381E] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D9381E]/20">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display">
                        Sign In to Your Account
                    </h1>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        Access your orders and delivery tracking
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-medium border border-rose-200 dark:border-rose-900">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                }}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 space-y-4">
                    <div>
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="inline-flex items-center text-xs font-bold text-[#D9381E] hover:underline cursor-pointer"
                        >
                            <Sparkles className="w-3.5 h-3.5 mr-1" /> Try Demo Account
                        </button>
                        <p className="text-[11px] text-stone-400 mt-1">Email: demo@addiseats.com | Pass: demo123456</p>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-stone-500 mb-1">Don't have an account?</p>
                        <Link to="/signup" className="text-xs font-bold text-[#D9381E] hover:underline">
                            Create one now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
