import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, LogOut, Code, Terminal, Activity, Settings } from 'lucide-react';
import api from '../../utils/api';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        // Authenticate admin strictly
        (async () => {
            try {
                const res = await api.get('/auth/user');
                if (res.data.role !== 'admin' && res.data.role !== 'owner') {
                    navigate('/dashboard'); // not authorized
                } else {
                    setAdminUser(res.data);
                }
            } catch (err) {
                navigate('/admin/login');
            }
        })();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    if (!adminUser) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-mono text-sm">INITIALIZING GOD MODE...</div>;

    const navItems = [
        { path: '/admin', label: 'Overview', icon: LayoutDashboard },
        { path: '/admin/users', label: 'User Directory', icon: Users },
        ...(adminUser.role === 'owner' ? [{ path: '/admin/managers', label: 'Access Control', icon: Shield }] : []),
        { path: '/admin/logs', label: 'System Logs', icon: Terminal },
    ];

    return (
        <div className="min-h-screen flex bg-[#0a0a0a] text-gray-300 font-sans selection:bg-indigo-500/30">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
            />

            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-[#0f0f11]/80 backdrop-blur-xl flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                        <Code size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-sm tracking-widest font-mono">GOD MODE</h1>
                        <p className="text-[10px] text-gray-500 uppercase">Jomocal Internal</p>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    isActive 
                                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                <Icon size={16} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-xs font-bold text-white">
                            {adminUser.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm text-white font-medium">{adminUser.name}</p>
                            <p className="text-[10px] text-indigo-400 uppercase font-mono">{adminUser.role}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={14} /> Kill Session
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 min-h-screen flex flex-col relative z-10">
                <header className="h-16 border-b border-white/10 bg-[#0f0f11]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
                    <h2 className="text-lg font-semibold text-white">
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)] animate-pulse" />
                            <span className="text-[10px] uppercase tracking-wider text-green-400 font-bold font-mono">Systems Operational</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-x-hidden">
                    <Outlet context={{ adminUser }} />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
