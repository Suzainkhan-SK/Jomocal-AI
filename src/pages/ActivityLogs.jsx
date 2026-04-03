import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Loader2, Clock, MessageSquare, Users, User, Bot as BotIcon, ChevronRight, RefreshCw, Zap, Calendar } from 'lucide-react';
import api from '../utils/api';
import { formatDistanceToNow } from 'date-fns';

const riseUp = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } };

const getAutomationMeta = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('lead')) return { icon: Users, color: '#10b981', emoji: '🎯' };
    if (n.includes('schedule') || n.includes('calendar')) return { icon: Calendar, color: '#8b5cf6', emoji: '📅' };
    if (n.includes('youtube') || n.includes('video')) return { icon: Zap, color: '#ef4444', emoji: '🎥' };
    if (n.includes('email') || n.includes('gmail')) return { icon: MessageSquare, color: '#3b82f6', emoji: '📧' };
    if (n.includes('telegram') || n.includes('bot')) return { icon: BotIcon, color: '#0088cc', emoji: '🤖' };
    return { icon: MessageSquare, color: '#3b82f6', emoji: '⚡' };
};

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const getMessageContent = (log) => {
        if (log.messageData) {
            if (typeof log.messageData === 'object') return (log.messageData.messageContent || log.messageData.userQuery || log.messageData.text || '').trim();
            if (typeof log.messageData === 'string') {
                try { const p = JSON.parse(log.messageData); return (p.messageContent || p.userQuery || p.text || log.action).trim(); } catch { return log.action; }
            }
        }
        return log.action;
    };

    const getBotResponse = (log) => {
        if (log.messageData) {
            if (typeof log.messageData === 'object') return (log.messageData.botResponse || log.messageData.response || 'Response logged in backend').trim();
            if (typeof log.messageData === 'string') {
                try { const p = JSON.parse(log.messageData); return (p.botResponse || p.response || 'Response logged in backend').trim(); } catch { return 'Response logged in backend'; }
            }
        }
        return 'Response logged in backend';
    };

    const getRecipientUsername = (log) => {
        if (log.messageData) {
            if (typeof log.messageData === 'object') return (log.messageData.recipientUsername || log.messageData.recipientName || log.messageData.senderName || 'Unknown').trim();
            if (typeof log.messageData === 'string') {
                try { const p = JSON.parse(log.messageData); return (p.recipientUsername || p.recipientName || p.senderName || 'Unknown').trim(); } catch { return 'Unknown'; }
            }
        }
        return 'Unknown';
    };

    const fetchLogs = useCallback(async (isRefresh = false) => {
        try {
            setError('');
            if (isRefresh) setRefreshing(true);
            const res = await api.get('/logs');
            setLogs(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || err.message || 'Failed to fetch logs');
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(() => fetchLogs(), 15000);
        return () => clearInterval(interval);
    }, [fetchLogs]);

    const filteredLogs = searchQuery
        ? logs.filter(log => {
            const q = searchQuery.toLowerCase();
            return (log.automationName || '').toLowerCase().includes(q) ||
                   (log.action || '').toLowerCase().includes(q) ||
                   getRecipientUsername(log).toLowerCase().includes(q);
        })
        : logs;

    const exportToCSV = () => {
        const csvContent = [
            ['Automation', 'Action', 'User', 'Status', 'Timestamp'],
            ...logs.map(log => [
                log.automationName, log.action, getRecipientUsername(log), log.status,
                new Date(log.timestamp).toISOString(),
            ])
        ].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-main font-display tracking-tight mb-0.5">
                        Activity Feed 📋
                    </h1>
                    <p className="text-secondary text-[11px] sm:text-xs">Track every action performed by your AI automations.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => fetchLogs(true)} className="btn btn-secondary text-sm" disabled={refreshing}>
                        <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button onClick={exportToCSV} className="btn btn-secondary text-sm">
                        <Download size={14} /> Export
                    </button>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
                <div className="relative max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                    <input
                        type="text" placeholder="Search by automation, action, or user..."
                        className="input pl-11 py-2.5 text-sm"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Error */}
            {error && (
                <div className="mb-4 rounded-xl px-4 py-3 text-sm font-medium" style={{
                    background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#ef4444',
                }}>
                    {error}
                </div>
            )}

            {/* Logs */}
            {loading ? (
                <div className="rounded-2xl border p-16 text-center" style={{ background: 'var(--glass-bg)', borderColor: 'var(--color-border)' }}>
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#3b82f6' }} />
                    <p className="text-secondary font-medium">Loading activity logs...</p>
                </div>
            ) : filteredLogs.length > 0 ? (
                <div className="rounded-2xl border overflow-hidden" style={{
                    background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                }}>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-secondary uppercase tracking-widest">Automation</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-secondary uppercase tracking-widest">Details</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-secondary uppercase tracking-widest">Time</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log, index) => {
                                    const meta = getAutomationMeta(log.automationName);
                                    return (
                                        <tr key={`${log._id}-${index}`}
                                            className="group transition-colors duration-200 cursor-pointer"
                                            style={{ borderBottom: '1px solid var(--color-border)' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style={{
                                                        background: `${meta.color}10`, border: `1px solid ${meta.color}18`,
                                                    }}>
                                                        {meta.emoji}
                                                    </div>
                                                    <span className="text-sm font-bold text-main">{log.automationName}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 max-w-md">
                                                {log.messageData ? (
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <User size={11} className="text-secondary" />
                                                            <span className="font-bold text-main text-[11px]">{getRecipientUsername(log)}</span>
                                                        </div>
                                                        <p className="text-[11px] text-secondary line-clamp-1">{getMessageContent(log)}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-secondary">{log.action}</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-secondary whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={12} />
                                                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${log.status === 'success' ? 'badge-success' : 'badge-neutral'}`}>
                                                    {log.status === 'success' ? '✅ Success' : '❌ Failed'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden">
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                            {filteredLogs.map((log, index) => {
                                const meta = getAutomationMeta(log.automationName);
                                return (
                                    <motion.div variants={riseUp} key={`mobile-${log._id}-${index}`} className="p-4 space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-base">{meta.emoji}</span>
                                                <span className="text-sm font-bold text-main">{log.automationName}</span>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${log.status === 'success' ? 'badge-success' : 'badge-neutral'}`}>
                                                {log.status === 'success' ? 'Success' : 'Failed'}
                                            </span>
                                        </div>
                                        {log.messageData && (
                                            <div className="rounded-lg p-2.5 text-xs" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                                <p className="text-secondary line-clamp-2">{getMessageContent(log)}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-[11px] text-secondary">
                                            <Clock size={11} />
                                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                        <span className="text-[11px] text-secondary font-medium">Showing {filteredLogs.length} of {logs.length} logs</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-secondary">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Auto-refreshing
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border p-16 text-center" style={{ background: 'var(--glass-bg)', borderColor: 'var(--color-border)' }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transform rotate-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        <Clock size={28} style={{ color: 'var(--color-text-tertiary)' }} />
                    </div>
                    <h3 className="text-xl font-bold text-main mb-2">No activity yet</h3>
                    <p className="text-sm text-secondary">Your automation logs will appear here once they start running.</p>
                </div>
            )}
        </div>
    );
};

export default ActivityLogs;
