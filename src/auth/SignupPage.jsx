import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './useAuth';
import { registerUser } from './userService';
import { ADDIS_DELIVERY_AREAS } from '../utils/deliveryEstimate';
import { Button } from '../ui/Button';
import { Mail, Lock, Phone, User, MapPin, Building2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export const SignupPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        area: ADDIS_DELIVERY_AREAS[0].name,
        address: '',
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Full name is required');
            return;
        }

        if (!formData.email.trim() || !formData.email.includes('@')) {
            setError('Valid email is required');
            return;
        }

        if (!formData.phone.trim() || formData.phone.length < 9) {
            setError('Valid phone number is required (e.g., 0911234567)');
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const result = registerUser({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password,
                area: formData.area,
                address: formData.address.trim(),
            });

            if (result.success) {
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 500);
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
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
                        <User className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-sans-display">
                        Create Your Account
                    </h1>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        Sign up to order food from Addis Eats
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
                            Full Name *
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="e.g., Abeba Mulatu"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Email Address *
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="abeba.mulatu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Phone Number *
                        </label>
                        <div className="relative">
                            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="+251 91 123 4567 or 0911234567"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Delivery Area *
                        </label>
                        <div className="relative">
                            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E] cursor-pointer"
                            >
                                {ADDIS_DELIVERY_AREAS.map((area) => (
                                    <option key={area.id} value={area.name}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Street Address (Optional)
                        </label>
                        <div className="relative">
                            <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                name="address"
                                placeholder="e.g., Near Edna Mall, 3rd Floor"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Password *
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={handleChange}
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

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                            Confirm Password *
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                required
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9381E]"
                            />
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full mt-6" isLoading={isLoading}>
                        Create Account
                    </Button>
                </form>

                <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 text-center">
                    <p className="text-xs text-stone-500">Already have an account?</p>
                    <Link to="/login" className="text-xs font-bold text-[#D9381E] hover:underline">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
};
