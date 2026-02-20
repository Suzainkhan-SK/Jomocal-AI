import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock } from 'lucide-react';
import api from '../utils/api';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-body transition-colors">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse-slow"></div>

            <div className="w-full max-w-sm md:max-w-md bg-surface backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-xl border border-main p-6 md:p-10 animate-fade-in relative z-10 transition-colors">
                <div className="text-center mb-6 md:mb-10">
                    <Link to="/" className="inline-flex items-center mb-4 md:mb-6 hover:opacity-80 transition-opacity">
                        <img
                            src="/jomocal ai logo.png"
                            alt="Jomocal AI"
                            className="w-32 md:w-40 h-auto object-contain scale-125"
                        />
                    </Link>
                    <h2 className="text-2xl md:text-3xl font-bold text-main mb-2 tracking-tight">Welcome back</h2>
                    <p className="text-sm md:text-base text-secondary">Sign in to continue to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="label text-main" htmlFor="email">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-secondary group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="email"
                                id="email"
                                className="input pl-12 bg-body border-main focus:border-blue-500/50"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="label mb-0 text-main" htmlFor="password">Password</label>
                            <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline">Forgot password?</a>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-secondary group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="password"
                                id="password"
                                className="input pl-12 bg-body border-main focus:border-blue-500/50"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full py-4 text-lg shadow-xl shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-secondary">
                    Don't have an account? <Link to="/signup" className="text-blue-500 font-bold hover:underline">Create free account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
