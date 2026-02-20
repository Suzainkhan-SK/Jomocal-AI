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
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-body transition-colors">
            {/* Background Blobs */}
            <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] bg-indigo-600/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse-slow"></div>

            <div className="w-full max-w-sm md:max-w-md bg-surface backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-xl border border-main p-6 md:p-10 animate-fade-in relative z-10 transition-colors">
                <div className="text-center mb-6 md:mb-10">
                    <Link to="/" className="inline-flex items-center mb-4 md:mb-6 hover:opacity-80 transition-opacity">
                        <img
                            src="/jomocal ai logo.png"
                            alt="Jomocal AI"
                            className="w-32 md:w-40 h-auto object-contain scale-125"
                        />
                    </Link>
                    <h2 className="text-2xl md:text-3xl font-bold text-main mb-2 tracking-tight">Create an account</h2>
                    <p className="text-sm md:text-base text-secondary">Start automating your business today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="label text-main">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300 ${role === 'msme' ? 'border-blue-500 bg-blue-500/10 text-blue-500 shadow-md shadow-blue-500/20' : 'border-main hover:border-blue-500/30 hover:bg-body text-secondary'}`}
                                onClick={() => setRole('msme')}
                                disabled={loading}
                            >
                                <Briefcase size={28} className={role === 'msme' ? 'text-blue-500' : 'text-secondary/50'} />
                                <span className="font-bold">Business</span>
                            </button>
                            <button
                                type="button"
                                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300 ${role === 'creator' ? 'border-purple-500 bg-purple-500/10 text-purple-500 shadow-md shadow-purple-500/20' : 'border-main hover:border-purple-500/30 hover:bg-body text-secondary'}`}
                                onClick={() => setRole('creator')}
                                disabled={loading}
                            >
                                <Camera size={28} className={role === 'creator' ? 'text-purple-500' : 'text-secondary/50'} />
                                <span className="font-bold">Creator</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="label text-main" htmlFor="name">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-secondary group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                id="name"
                                className="input pl-12 bg-body border-main"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label text-main" htmlFor="email">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-secondary group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="email"
                                id="email"
                                className="input pl-12 bg-body border-main"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label text-main" htmlFor="password">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-secondary group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="password"
                                id="password"
                                className="input pl-12 bg-body border-main"
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

                <div className="mt-8 text-center text-sm text-secondary">
                    Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
