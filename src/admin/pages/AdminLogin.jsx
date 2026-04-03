import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Terminal, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // CRITICAL: Clear any existing session to prevent interceptor conflicts
            localStorage.removeItem('token');

            // Step 1: Standard login hit
            const res = await api.post('/auth/login', credentials);
            const newToken = res.data.token;
            
            // Step 2: Immediate Role Verification with the NEW token
            // We bypass the interceptor by passing it directly
            const authRes = await api.get('/auth/user', {
                headers: { 'x-auth-token': newToken }
            });

            console.log("GOD MODE AUTH CHECK:", {
                role: authRes.data.role,
                email: authRes.data.email
            });

            if (authRes.data.role === 'admin' || authRes.data.role === 'owner') {
                // SUCCESS: Save token and flush session to clean admin space
                localStorage.setItem('token', newToken);
                window.location.replace('/admin');
            } else {
                setError(`ACCESS DENIED: Role '${authRes.data.role}' is not authorized for God Mode.`);
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Authentication failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-indigo-500/30 font-sans relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
            />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-[#0f0f11]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                            <ShieldAlert className="text-indigo-400" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wide font-mono uppercase">System Override</h1>
                        <p className="text-sm text-gray-500 mt-2 font-mono uppercase tracking-widest">Restricted Access Only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm font-mono animate-pulse">
                                <Terminal size={16} className="mt-0.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2 bg-[#050505] w-max px-1 relative top-2 left-2 z-10">
                                    Operator Email
                                </label>
                                <input
                                    type="email"
                                    autoFocus
                                    required
                                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2 bg-[#050505] w-max px-1 relative top-2 left-2 z-10">
                                    Secure Phrase
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 overflow-hidden flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    INITIATE LOGIN SEQUENCE <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <p className="text-center text-[10px] text-gray-500 font-mono mt-6 uppercase tracking-widest">
                    Unauthorized access is strictly prohibited and logged.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
