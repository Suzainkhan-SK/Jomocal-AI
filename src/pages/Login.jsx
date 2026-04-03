import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles, Shield, Zap, Users, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

const TRUST_ITEMS = [
    { icon: Shield, text: '100% Secure & Encrypted' },
    { icon: Zap, text: 'Ready in Under 60 Seconds' },
    { icon: Users, text: 'Trusted by 500+ Indian Businesses' },
];

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden" style={{ background: 'var(--color-background)' }}>
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full blur-[100px] animate-pulse-slow" style={{ background: 'rgba(59, 130, 246, 0.08)' }} />
                <div className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] animate-pulse-slow" style={{ background: 'rgba(139, 92, 246, 0.06)', animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px]" style={{ background: 'rgba(16, 185, 129, 0.04)' }} />
            </div>

            {/* Left Panel — Brand / Value Proposition (Desktop only) */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden">
                {/* Decorative gradient border */}
                <div className="absolute inset-y-0 right-0 w-px" style={{
                    background: 'linear-gradient(180deg, transparent, var(--color-border), transparent)',
                }} />

                <div>
                    <Link to="/" className="inline-block mb-16 hover:opacity-80 transition-opacity">
                        <img src="/jomocal ai logo.png" alt="Jomocal AI" className="w-28 h-auto object-contain scale-[2.2] translate-x-10" />
                    </Link>

                    <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-main font-display leading-tight mb-4">
                            Your AI team is
                            <br />
                            <span className="text-gradient-primary">waiting for you.</span>
                        </h1>
                        <p className="text-secondary text-lg leading-relaxed max-w-md">
                            Sign in to your dashboard and let automation handle the busy work — while you focus on growing your business.
                        </p>
                    </div>
                </div>

                {/* Feature highlights */}
                <div className={`space-y-5 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    {[
                        { emoji: '🤖', title: 'AI Customer Support', desc: 'Your bot replies to customers 24/7' },
                        { emoji: '🎥', title: 'Auto Video Creation', desc: 'YouTube videos made and uploaded for you' },
                        { emoji: '🎯', title: 'Lead Generation', desc: 'Find new customers while you sleep' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 group">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                            }}>
                                {item.emoji}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-main">{item.title}</p>
                                <p className="text-xs text-secondary">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel — Login Form */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
                <div className={`w-full max-w-md transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="inline-block mb-4">
                            <img src="/jomocal ai logo.png" alt="Jomocal AI" className="w-32 h-auto object-contain scale-125 mx-auto" />
                        </Link>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10" style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        backdropFilter: 'blur(24px) saturate(1.6)',
                        WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
                        boxShadow: 'var(--shadow-lg)',
                    }}>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-main mb-2 font-display">Welcome back 👋</h2>
                            <p className="text-sm text-secondary">Sign in to manage your AI automations</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="animate-shake rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2" style={{
                                    background: 'rgba(239, 68, 68, 0.08)',
                                    border: '1px solid rgba(239, 68, 68, 0.15)',
                                    color: '#ef4444',
                                }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-secondary" htmlFor="email">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                                    <input
                                        type="email"
                                        id="email"
                                        className="input pl-12"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-sm font-medium text-secondary" htmlFor="password">Password</label>
                                    <a href="#" className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">Forgot password?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        className="input pl-12 pr-12"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-300"
                                        style={{ color: 'var(--color-text-tertiary)' }}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
                                style={{
                                    background: loading ? 'var(--color-border)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                    color: '#ffffff',
                                    boxShadow: loading ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.45)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Trust signals */}
                        <div className="flex items-center justify-center gap-4 mt-6 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                            {TRUST_ITEMS.map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-secondary">
                                    <item.icon size={12} style={{ color: '#10b981' }} />
                                    <span className="text-[10px] font-medium hidden sm:inline">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 text-center text-sm text-secondary">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">
                                Create free account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
