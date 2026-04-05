import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Briefcase, Camera, ArrowRight, CheckCircle, Sparkles, Shield, Zap, Eye, EyeOff, Check } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../utils/api';

const Signup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('msme');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            setLoading(true);
            try {
                // Send the 'code' to your backend instead of the access token
                const res = await api.post('/auth/google', { code: codeResponse.code });
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard');
            } catch (err) {
                setError(err.response?.data?.msg || 'Google signup failed');
            } finally {
                setLoading(false);
            }
        },
        onError: () => setError('Google signup was cancelled or failed'),
        flow: 'auth-code',
    });

    const passwordStrength = (() => {
        if (!password) return { score: 0, label: '', color: '' };
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
        if (score <= 3) return { score, label: 'Fair', color: '#f59e0b' };
        return { score, label: 'Strong', color: '#10b981' };
    })();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/signup', { name, email, password, role, phoneNumber });
            setSuccessMsg(res.data.msg || 'Registration successful! Please check your email to verify your account.');
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Success State
    if (successMsg) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden" style={{ background: 'var(--color-background)' }}>
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: 'rgba(16, 185, 129, 0.08)' }} />
                </div>
                <div className="w-full max-w-md rounded-2xl md:rounded-3xl p-8 md:p-10 animate-fade-in-scale text-center" style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(24px) saturate(1.6)',
                    boxShadow: 'var(--shadow-lg)',
                }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}>
                        <CheckCircle size={32} style={{ color: '#10b981' }} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-main mb-3 font-display">Check Your Email 📧</h2>
                    <p className="text-secondary text-sm leading-relaxed mb-8">{successMsg}</p>
                    <Link
                        to="/login"
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 group"
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                        }}
                    >
                        Go to Login <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex relative overflow-hidden" style={{ background: 'var(--color-background)' }}>
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full blur-[100px] animate-pulse-slow" style={{ background: 'rgba(139, 92, 246, 0.07)' }} />
                <div className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] animate-pulse-slow" style={{ background: 'rgba(59, 130, 246, 0.06)', animationDelay: '2s' }} />
            </div>

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden">
                <div className="absolute inset-y-0 right-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, var(--color-border), transparent)' }} />

                <div>
                    <Link to="/" className="inline-block mb-16 hover:opacity-80 transition-opacity">
                        <img src="/jomocal ai logo.png" alt="Jomocal AI" className="w-28 h-auto object-contain scale-[2.2] translate-x-10" />
                    </Link>

                    <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-main font-display leading-tight mb-4">
                            Put your business on
                            <br />
                            <span className="text-gradient-primary">autopilot today.</span>
                        </h1>
                        <p className="text-secondary text-lg leading-relaxed max-w-md">
                            Join 500+ Indian businesses and creators who save 40+ hours every month with AI-powered automation.
                        </p>
                    </div>
                </div>

                {/* Social Proof */}
                <div className={`space-y-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-lg">⭐</span>
                        ))}
                        <span className="text-sm font-bold text-main ml-1">4.9/5</span>
                    </div>
                    <p className="text-sm text-secondary italic leading-relaxed">
                        "Jomocal AI has completely transformed how I run my shop. The AI replies to my WhatsApp customers even when I'm sleeping!"
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                            RK
                        </div>
                        <div>
                            <p className="text-xs font-bold text-main">Rajesh Kumar</p>
                            <p className="text-[11px] text-secondary">Local Shop Owner, Bengaluru</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                        {[
                            { icon: Shield, text: 'Data Secure' },
                            { icon: Zap, text: 'No Coding' },
                            { icon: Sparkles, text: 'Free Trial' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <item.icon size={12} style={{ color: '#10b981' }} />
                                <span className="text-[11px] font-medium text-secondary">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Signup Form */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
                <div className={`w-full max-w-md transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-6">
                        <Link to="/" className="inline-block mb-3">
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
                        <div className="text-center mb-6">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-main mb-2 font-display">Create your account ✨</h2>
                            <p className="text-sm text-secondary">Start automating your business in minutes</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            {/* Role Picker */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-secondary">I am a...</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'msme', label: 'Business Owner', icon: Briefcase, color: '#3b82f6', desc: 'Shop, MSME, Startup' },
                                        { value: 'creator', label: 'Content Creator', icon: Camera, color: '#8b5cf6', desc: 'YouTube, Social, Blog' },
                                    ].map((item) => (
                                        <button
                                            key={item.value}
                                            type="button"
                                            className="relative p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 cursor-pointer group"
                                            style={{
                                                borderColor: role === item.value ? `${item.color}60` : 'var(--color-border)',
                                                background: role === item.value ? `${item.color}08` : 'transparent',
                                                boxShadow: role === item.value ? `0 4px 16px ${item.color}15` : 'none',
                                            }}
                                            onClick={() => setRole(item.value)}
                                            disabled={loading}
                                            onMouseEnter={(e) => {
                                                if (role !== item.value) {
                                                    e.currentTarget.style.borderColor = `${item.color}30`;
                                                    e.currentTarget.style.background = `${item.color}04`;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (role !== item.value) {
                                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                                    e.currentTarget.style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            {role === item.value && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: item.color, color: '#fff' }}>
                                                    <Check size={10} strokeWidth={3} />
                                                </div>
                                            )}
                                            <item.icon size={22} style={{ color: role === item.value ? item.color : 'var(--color-text-tertiary)' }} />
                                            <span className="text-xs font-bold" style={{ color: role === item.value ? item.color : 'var(--color-text-primary)' }}>{item.label}</span>
                                            <span className="text-[10px] text-secondary">{item.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-secondary" htmlFor="name">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                                    <input
                                        type="text" id="name" className="input pl-12"
                                        placeholder="Your full name"
                                        value={name} onChange={(e) => setName(e.target.value)}
                                        required disabled={loading} autoComplete="name"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-secondary" htmlFor="email">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                                    <input
                                        type="email" id="email" className="input pl-12"
                                        placeholder="you@example.com"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        required disabled={loading} autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Phone (Optional) */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-secondary" htmlFor="phone">Phone Number <span className="text-[10px] opacity-60">(Optional)</span></label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                                    <input
                                        type="tel" id="phone" className="input pl-12"
                                        placeholder="+91 12345 67890"
                                        value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                                        disabled={loading} autoComplete="tel"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-secondary" htmlFor="password">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'} id="password" className="input pl-12 pr-12"
                                        placeholder="Create a strong password"
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        required disabled={loading} autoComplete="new-password"
                                    />
                                    <button
                                        type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                                        style={{ color: 'var(--color-text-tertiary)' }} tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {/* Password strength meter */}
                                {password && (
                                    <div className="mt-2 space-y-1.5">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{
                                                    background: i < passwordStrength.score ? passwordStrength.color : 'var(--color-border)',
                                                }} />
                                            ))}
                                        </div>
                                        <p className="text-[11px] font-medium" style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label} password
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group mt-2"
                                style={{
                                    background: loading ? 'var(--color-border)' : 'linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6)',
                                    color: '#ffffff',
                                    boxShadow: loading ? 'none' : '0 4px 20px rgba(139, 92, 246, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(139, 92, 246, 0.45)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(139, 92, 246, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Free Account
                                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="px-2 text-secondary bg-transparent backdrop-blur-md">Or register with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => loginWithGoogle()}
                                disabled={loading}
                                className="w-full h-[52px] flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all duration-300 group cursor-pointer"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" style={{ fill: '#4285F4' }} />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" style={{ fill: '#34A853' }} />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" style={{ fill: '#FBBC05' }} />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" style={{ fill: '#EA4335' }} />
                                </svg>
                                <span className="text-sm font-bold text-main">Google Account</span>
                            </button>

                            <p className="text-[10px] text-secondary text-center leading-relaxed">
                                By creating an account, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </form>

                        <div className="mt-6 text-center text-sm text-secondary">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
