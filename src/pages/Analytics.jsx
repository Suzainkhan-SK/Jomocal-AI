import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Clock, MessageSquare, ArrowUp, ArrowDown, Sparkles, Bot } from 'lucide-react';
import api from '../utils/api';

const riseUp = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

/* ─── Animated Counter ─── */
const AnimatedNumber = ({ value, duration = 1200 }) => {
    const [display, setDisplay] = useState(0);
    const numValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) || 0 : value;
    
    useEffect(() => {
        let start = 0;
        const end = numValue;
        if (end === 0) { setDisplay(0); return; }
        const startTime = performance.now();
        const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(start + (end - start) * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [numValue, duration]);

    return <>{new Intl.NumberFormat('en-IN').format(display)}</>;
};

/* ─── Stat Card ─── */
const StatCard = ({ name, value, icon: Icon, color, change, index }) => (
    <motion.div variants={riseUp} className="group">
        <div className="relative h-full p-5 md:p-6 rounded-2xl border overflow-hidden transition-all duration-500 group-hover:-translate-y-1" style={{
            background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.boxShadow = `0 8px 32px ${color}12`; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle, ${color}15, transparent 70%)`, transform: 'translate(20%, -30%)' }} />
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: `${color}12`, color: color, border: `1px solid ${color}20` }}>
                        <Icon size={20} />
                    </div>
                    {change && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{
                            background: change.startsWith('+') ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                            color: change.startsWith('+') ? '#10b981' : '#ef4444',
                            border: `1px solid ${change.startsWith('+') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                        }}>
                            {change.startsWith('+') ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                            {change}
                        </span>
                    )}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-main font-display tracking-tight mb-1">
                    {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
                </h3>
                <p className="text-xs text-secondary font-semibold uppercase tracking-widest">{name}</p>
            </div>
        </div>
    </motion.div>
);

/* ─── Simple Bar (SVG) ─── */
const BarItem = ({ day, height, maxHeight, color, index }) => (
    <div className="flex flex-col items-center gap-2 flex-1">
        <div className="w-full rounded-xl overflow-hidden flex items-end" style={{ height: `${maxHeight}px`, background: 'var(--color-surface-hover)' }}>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${height}px`, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-lg transition-colors duration-300 group cursor-pointer"
                style={{ background: `linear-gradient(180deg, ${color}, ${color}90)` }}
                whileHover={{ filter: 'brightness(1.2)' }}
            />
        </div>
        <div className="text-center">
            <p className="text-xs font-bold text-main">{day.messagesSent}</p>
            <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
        </div>
    </div>
);

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics/dashboard');
                setAnalytics(res.data);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                        <BarChart3 size={18} className="absolute inset-0 m-auto text-blue-500" />
                    </div>
                    <p className="text-secondary text-sm font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const stats = [
        { name: 'Messages Processed', value: analytics?.totals?.messagesReceived || 0, icon: MessageSquare, color: '#3b82f6', change: '+12%' },
        { name: 'Auto-Replies Sent', value: analytics?.totals?.messagesSent || 0, icon: TrendingUp, color: '#10b981', change: '+8%' },
        { name: 'Unique Users', value: analytics?.totals?.uniqueUsers || 0, icon: Users, color: '#8b5cf6', change: '+5%' },
        { name: 'Time Saved', value: `${analytics?.totals?.timeSaved || 0} min`, icon: Clock, color: '#f59e0b', change: '+15%' },
    ];

    const efficiencyRate = analytics?.totals?.messagesSent > 0
        ? Math.round((analytics.totals.messagesSent / analytics.totals.messagesReceived) * 100) : 0;

    return (
        <div className="animate-fade-in">
            {/* Hero Header */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-8">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-main font-display tracking-tight mb-0.5">
                    Performance Overview 📊
                </h1>
                <p className="text-secondary text-[11px] sm:text-xs">Track how your AI automations are performing — last 30 days.</p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => <StatCard key={stat.name} {...stat} index={i} />)}
            </motion.div>

            {/* Chart Section */}
            <motion.div variants={riseUp} initial="hidden" animate="visible" className="mb-8">
                <div className="rounded-2xl border p-5 md:p-7" style={{
                    background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <BarChart3 size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-main font-display">Activity Over Time</h2>
                            <p className="text-xs text-secondary">Messages sent in the last 7 days</p>
                        </div>
                    </div>

                    {analytics?.chartData && analytics.chartData.length > 0 ? (
                        <div>
                            <div className="flex gap-2 md:gap-4 lg:gap-6">
                                {analytics.chartData.slice(-7).map((day, i) => {
                                    const maxValue = Math.max(...analytics.chartData.map(d => d.messagesSent));
                                    const height = maxValue > 0 ? (day.messagesSent / maxValue) * 180 : 16;
                                    return <BarItem key={i} day={day} height={height} maxHeight={180} color="#3b82f6" index={i} />;
                                })}
                            </div>
                            <div className="flex items-center gap-6 pt-5 mt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3b82f6' }} />
                                    <span className="text-xs text-secondary font-semibold">Messages Sent</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10b981' }} />
                                    <span className="text-xs text-secondary font-semibold">Messages Received</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <BarChart3 className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
                            <p className="text-secondary font-medium">No data available yet</p>
                            <p className="text-xs text-secondary mt-1">Start automating to see your analytics!</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Quick Insights */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: 'Efficiency Rate', value: `${efficiencyRate}%`, desc: 'Auto-reply success rate', color: '#3b82f6', icon: TrendingUp },
                    { title: 'Avg. Response Time', value: '<1s', desc: 'Lightning fast automation', color: '#10b981', icon: Sparkles },
                    { title: 'Active Automations', value: '1', desc: 'Running 24/7 for you', color: '#8b5cf6', icon: Bot },
                ].map((item, i) => (
                    <motion.div key={i} variants={riseUp}>
                        <div className="group rounded-2xl border p-5 md:p-6 transition-all duration-500 group-hover:-translate-y-1" style={{
                            background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${item.color}30`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                        >
                            <div className="flex items-center gap-2.5 mb-3">
                                <item.icon size={14} style={{ color: item.color }} />
                                <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">{item.title}</h3>
                            </div>
                            <p className="text-3xl font-extrabold font-display mb-1" style={{ color: item.color }}>{item.value}</p>
                            <p className="text-xs text-secondary font-medium">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Analytics;
