import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock, Briefcase, Camera, User } from 'lucide-react';
import api from '../utils/api';

const Signup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('msme'); // 'msme' or 'creator'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/signup', { name, email, password, role });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] bg-indigo-400/20 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse-slow"></div>

            <div className="w-full max-w-sm md:max-w-md bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-xl border border-white/20 p-6 md:p-10 animate-fade-in">
                <div className="text-center mb-6 md:mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl md:text-2xl text-slate-900 mb-4 md:mb-6 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <Bot size={20} className="md:w-6 md:h-6" />
                        </div>
                        <span>AI Auto Studio</span>
                    </Link>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">Create an account</h2>
                    <p className="text-sm md:text-base text-slate-500">Start automating your business today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="label">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300 ${role === 'msme' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-500'}`}
                                onClick={() => setRole('msme')}
                                disabled={loading}
                            >
                                <Briefcase size={28} className={role === 'msme' ? 'text-blue-600' : 'text-slate-400'} />
                                <span className="font-bold">Business</span>
                            </button>
                            <button
                                type="button"
                                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300 ${role === 'creator' ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md shadow-purple-500/10' : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50 text-slate-500'}`}
                                onClick={() => setRole('creator')}
                                disabled={loading}
                            >
                                <Camera size={28} className={role === 'creator' ? 'text-purple-600' : 'text-slate-400'} />
                                <span className="font-bold">Creator</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="label" htmlFor="name">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                id="name"
                                className="input pl-12 bg-white/50"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label" htmlFor="email">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="email"
                                id="email"
                                className="input pl-12 bg-white/50"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label" htmlFor="password">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="password"
                                id="password"
                                className="input pl-12 bg-white/50"
                                placeholder="Create a password"
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
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
