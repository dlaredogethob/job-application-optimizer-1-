import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../components/AppProvider';
import { Icons } from '../components/ui/icons';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useAppStore();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setUser({ name: 'John Doe', email: formData.email || 'dummy@gmail.com' });
            navigate('/library');
        }, 800);
    };

    const handleGoogleLogin = () => {
        setUser({ name: 'John Doe', email: 'dummy@gmail.com' });
        navigate('/library');
    };

    return (
        <div className="min-h-screen bg-[#f0f2f8] flex flex-col items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Google Font Import */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@400;600&family=Inter:wght@400;500;600&display=swap');
                .heading-serif { font-family: 'Newsreader', serif; }
            `}</style>

            <div className="w-full max-w-sm">
                {/* App Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                        <Icons.Auth.Briefcase className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="heading-serif text-[2rem] font-semibold text-slate-900 leading-tight">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-emerald-600 font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 px-8 pt-7 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email address</label>
                            <div className="relative">
                                <Icons.Auth.Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-[13px] font-medium text-slate-700">Password</label>
                                <a href="#" className="text-[12px] text-emerald-500 hover:text-emerald-700 font-medium transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Icons.Auth.Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <Icons.Auth.EyeOff className="w-4 h-4" /> : <Icons.Auth.Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-emerald-200 mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign in'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-xs text-slate-400 font-medium">Or continue with</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Google */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50 py-2.5 rounded-lg text-sm font-semibold text-slate-700 transition-all"
                    >
                        {/* Google SVG */}
                        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" fillRule="evenodd">
                                <path d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.6149z" fill="#4285F4" />
                                <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8064.54-1.8368.859-3.0477.859-2.3441 0-4.328-1.5836-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853" />
                                <path d="M3.964 10.71C3.7836 10.17 3.6818 9.5932 3.6818 9s.1018-1.17.2823-1.71V4.9582H.9574C.3477 6.1731 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05" />
                                <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.891 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.672 5.1632 6.6559 3.5795 9 3.5795z" fill="#EA4335" />
                            </g>
                        </svg>
                        Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
