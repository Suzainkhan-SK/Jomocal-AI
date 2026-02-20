import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Zap, Plus, Link as LinkIcon, CheckCircle, Clock, AlertCircle, MessageSquare, Users, Calendar, Loader, AlertCircle as AlertIcon, TrendingUp, Activity } from 'lucide-react';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);
    const [automationsStats, setAutomationsStats] = useState({ active: 0, paused: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [proTipIndex, setProTipIndex] = useState(0);

    const proTips = [
        "Connect your WhatsApp Business account to enable auto-replies for new leads immediately.",
        "Use the 'Schedule' trigger to run your automations at specific times every day.",
        "Check your 'Activity Logs' to debug any issues with your recent workflows.",
        "Integrate with Google Sheets to keep a backup record of all your new leads."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProTipIndex((prev) => (prev + 1) % proTips.length);
        }, 5000); // Change tip every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch user data
                const userResponse = await api.get('/auth/user');
                setUserData(userResponse.data);

                // Fetch analytics data
                const analyticsResponse = await api.get('/analytics/dashboard');
                setAnalyticsData(analyticsResponse.data);

                // Fetch recent logs
                const logsResponse = await api.get('/logs');
                setRecentLogs(logsResponse.data.slice(0, 5)); // Get only 5 recent logs

                // Fetch automations to calculate stats
                const automationsResponse = await api.get('/automations');
                const automations = automationsResponse.data;

                const active = automations.filter(auto => auto.status === 'active').length;
                const paused = automations.filter(auto => auto.status === 'paused').length;
                const pending = automations.filter(auto => auto.status === 'inactive').length;

                setAutomationsStats({ active, paused, pending });

                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="animate-fade-in flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-secondary">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="animate-fade-in">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-main tracking-tight">Dashboard</h1>
                        <p className="text-secondary mt-1">Overview of your automations and activities</p>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-red-800">Error loading dashboard</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const userName = userData?.name || 'User';
    const totalActions = analyticsData?.totals?.messagesSent || 0;

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-main tracking-tight">Welcome back, {userName}! 👋</h1>
                    <p className="text-secondary mt-1">Here's what's happening with your automations today.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/dashboard/automations">
                        <button className="btn btn-primary shadow-blue-500/20">
                            <Plus size={18} /> New Automation
                        </button>
                    </Link>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
                <div className="card group hover:border-emerald-500/30 transition-colors p-5 md:p-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
                            <CheckCircle size={24} />
                        </div>
                        <span className="badge-success">
                            {automationsStats.active > 0 ? `+${Math.floor(Math.random() * 20) + 1}%` : '0%'}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-secondary font-medium mb-1">Active</p>
                        <p className="text-3xl font-bold text-main">{automationsStats.active}</p>
                    </div>
                </div>

                <div className="card group hover:border-orange-500/30 transition-colors p-5 md:p-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 transition-transform group-hover:scale-110">
                            <Clock size={24} />
                        </div>
                        <span className="badge-warning">
                            {automationsStats.pending > 0 ? 'Action Needed' : 'All Set'}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-secondary font-medium mb-1">Pending</p>
                        <p className="text-3xl font-bold text-main">{automationsStats.pending}</p>
                    </div>
                </div>

                <div className="card group hover:border-blue-500/30 transition-colors p-5 md:p-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
                            <Zap size={24} />
                        </div>
                        <span className="badge-neutral">Today</span>
                    </div>
                    <div>
                        <p className="text-sm text-secondary font-medium mb-1">Actions</p>
                        <p className="text-3xl font-bold text-main">{totalActions}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Activity Grid */}
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6 md:gap-8">
                {/* Side Panel (Quick Actions + Pro Tip) */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-lg font-bold text-main hidden lg:block">Quick Actions</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                        <Link to="/dashboard/automations" className="group bg-surface p-4 rounded-xl border border-main shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 text-center md:text-left transition-colors duration-300">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Plus size={20} className="md:w-6 md:h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-main text-sm md:text-base">New Bot</p>
                                <p className="text-xs text-secondary hidden md:block">Start from scratch</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/apps" className="group bg-surface p-4 rounded-xl border border-main shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 text-center md:text-left transition-colors duration-300">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <LinkIcon size={20} className="md:w-6 md:h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-main text-sm md:text-base">Connect</p>
                                <p className="text-xs text-secondary hidden md:block">Add integration</p>
                            </div>
                        </Link>
                    </div>

                    {/* Pro Tip Card - Rotates every few seconds */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border border-slate-700/50">
                        {/* Animated Background Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse-slow"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -ml-12 -mb-12 animate-pulse-slow delay-500"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4 text-blue-300 font-bold text-sm uppercase tracking-wider">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Pro Tip
                            </div>

                            <div className="min-h-[80px] flex items-center">
                                <p className="text-sm md:text-base text-slate-200 leading-relaxed font-light animate-fade-in key-{proTipIndex}">
                                    {proTips[proTipIndex]}
                                </p>
                            </div>

                            <button className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                                Explore Feature
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-main">Recent Activity</h2>
                        <Link to="/dashboard/activity" className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline">View All</Link>
                    </div>

                    <div className="bg-surface rounded-2xl border border-main shadow-sm overflow-hidden transition-colors duration-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-table-header border-b border-main">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Automation</th>
                                        <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Time</th>
                                        <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-main">
                                    {recentLogs.length > 0 ? (
                                        recentLogs.map((log, index) => {
                                            // Determine icon based on automation name
                                            let icon = MessageSquare;
                                            let iconColor = 'blue';
                                            if (log.automationName.toLowerCase().includes('lead')) {
                                                icon = Users;
                                                iconColor = 'green';
                                            } else if (log.automationName.toLowerCase().includes('schedule')) {
                                                icon = Calendar;
                                                iconColor = 'purple';
                                            }

                                            // Status badge
                                            let badgeClass = 'badge-success';
                                            let statusIcon = CheckCircle;
                                            let statusText = 'Success';

                                            if (log.status.toLowerCase().includes('pending') || log.status.toLowerCase().includes('waiting')) {
                                                badgeClass = 'badge-warning';
                                                statusIcon = Clock;
                                                statusText = 'Pending';
                                            } else if (log.status.toLowerCase().includes('error') || log.status.toLowerCase().includes('failed')) {
                                                badgeClass = 'badge-neutral'; // Or make a badge-danger
                                                statusIcon = AlertIcon;
                                                statusText = 'Failed';
                                            }

                                            // Format time
                                            const logTime = new Date(log.timestamp);
                                            const now = new Date();
                                            const diffMs = now - logTime;
                                            const diffMins = Math.floor(diffMs / 60000);
                                            const diffHours = Math.floor(diffMins / 60);

                                            let timeString = 'Just now';
                                            if (diffMins >= 1 && diffMins < 60) {
                                                timeString = `${diffMins} min ago`;
                                            } else if (diffHours >= 1 && diffHours < 24) {
                                                timeString = `${diffHours} hr ago`;
                                            } else if (diffHours >= 24) {
                                                timeString = logTime.toLocaleDateString();
                                            }

                                            return (
                                                <tr key={log._id || index} className="hover:bg-primary/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg bg-${iconColor}-500/10 flex items-center justify-center text-${iconColor}-500/80`}>
                                                                {icon === MessageSquare && <MessageSquare size={16} />}
                                                                {icon === Users && <Users size={16} />}
                                                                {icon === Calendar && <Calendar size={16} />}
                                                            </div>
                                                            <span className="text-sm font-semibold text-main">{log.automationName || 'Unknown Automation'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${badgeClass}`}>
                                                            {statusIcon === CheckCircle && <CheckCircle size={12} />}
                                                            {statusIcon === Clock && <Clock size={12} />}
                                                            {statusIcon === AlertIcon && <AlertIcon size={12} />}
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-secondary">{timeString}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-secondary hover:text-main">
                                                            <AlertCircle size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-secondary">
                                                <Activity className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                                                <p>No recent activity found</p>
                                                <p className="text-sm mt-1">Your automations will appear here once they start running</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Dashboard;
