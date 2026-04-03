import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Zap, DollarSign, TrendingUp, Activity } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-20 ${colorClass}`} />
        
        <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center opacity-80 ${colorClass}`}>
                <Icon size={20} className="text-white" />
            </div>
            {trend && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                    <TrendingUp size={12} /> {trend}
                </span>
            )}
        </div>
        
        <div>
            <h3 className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
    </div>
);

const Overview = () => {
    const { adminUser } = useOutletContext();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return <div className="text-gray-500 font-mono text-sm animate-pulse">Fetching telemetry...</div>;

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <header className="mb-10">
                <h1 className="text-2xl font-bold text-white mb-2">Systems Overview</h1>
                <p className="text-gray-400 text-sm">Welcome back, {adminUser.name}. Here is the real-time status of the platform.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    title="Total Registered Users" 
                    value={stats?.totalUsers || 0} 
                    icon={Users} 
                    trend={`+${stats?.newSignups24h || 0} (24h)`}
                    colorClass="bg-blue-500" 
                />
                <StatCard 
                    title="Active Automations" 
                    value={stats?.activeAutomations || 0} 
                    icon={Zap} 
                    colorClass="bg-emerald-500" 
                />
                <StatCard 
                    title="Total Configured Tasks" 
                    value={stats?.totalAutomations || 0} 
                    icon={Activity} 
                    colorClass="bg-purple-500" 
                />
                <StatCard 
                    title="Gross Revenue Tracked (Est)" 
                    value={`₹${(stats?.revenue || 0).toLocaleString()}`} 
                    icon={DollarSign} 
                    colorClass="bg-indigo-500" 
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Placeholder for future charts */}
                <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 h-80 flex flex-col items-center justify-center text-gray-500 border-dashed">
                    <Activity size={32} className="mb-3 opacity-50" />
                    <p className="font-mono text-sm">Platform Load Analysis (Incoming)</p>
                </div>
                <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 h-80 flex flex-col items-center justify-center text-gray-500 border-dashed">
                    <DollarSign size={32} className="mb-3 opacity-50" />
                    <p className="font-mono text-sm">Revenue Trajectory Chart (Incoming)</p>
                </div>
            </div>
        </div>
    );
};

export default Overview;
