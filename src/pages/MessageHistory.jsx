import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Loader2, MessageSquare, User, Clock, Bot, Filter } from 'lucide-react';
import api from '../utils/api';
import { format } from 'date-fns';

const riseUp = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };

const MessageHistory = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const getMessageContent = (message) => {
        if (message.messageData) {
            if (typeof message.messageData === 'object' && message.messageData.messageContent) return message.messageData.messageContent.trim();
            if (typeof message.messageData === 'string') {
                try { return JSON.parse(message.messageData).messageContent?.trim() || message.action; } catch { return message.action; }
            }
        }
        return message.action;
    };

    const getBotResponse = (message) => {
        if (message.messageData) {
            if (typeof message.messageData === 'object' && message.messageData.botResponse) return message.messageData.botResponse.trim();
            if (typeof message.messageData === 'string') {
                try { return JSON.parse(message.messageData).botResponse?.trim() || 'Response logged in backend'; } catch { return 'Response logged in backend'; }
            }
        }
        return 'Response logged in backend';
    };

    const getRecipientName = (message) => {
        if (message.messageData) {
            if (typeof message.messageData === 'object') return (message.messageData.recipientName || message.messageData.recipientUsername || 'User').trim();
            if (typeof message.messageData === 'string') {
                try { const p = JSON.parse(message.messageData); return (p.recipientName || p.recipientUsername || 'User').trim(); } catch { return 'User'; }
            }
        }
        return 'User';
    };

    const getRecipientUsername = (message) => {
        if (message.messageData) {
            if (typeof message.messageData === 'object') return (message.messageData.recipientUsername || message.messageData.recipientName || 'user').trim();
            if (typeof message.messageData === 'string') {
                try { const p = JSON.parse(message.messageData); return (p.recipientUsername || p.recipientName || 'user').trim(); } catch { return 'user'; }
            }
        }
        return 'user';
    };

    useEffect(() => {
        fetchMessageHistory();
        const interval = setInterval(fetchMessageHistory, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchMessageHistory = async () => {
        try {
            setError('');
            const res = await api.get('/logs');
            const telegramMessages = res.data
                .filter(log => log.platform === 'telegram')
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setMessages(telegramMessages);
        } catch (err) {
            setError(err.response?.data?.msg || err.message || 'Failed to fetch message history');
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = (() => {
        let msgs = filter === 'all' ? messages : messages.filter(msg => msg.status === filter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            msgs = msgs.filter(msg => {
                const content = getMessageContent(msg).toLowerCase();
                const name = getRecipientName(msg).toLowerCase();
                return content.includes(q) || name.includes(q);
            });
        }
        return msgs;
    })();

    const exportToCSV = () => {
        const csvContent = [
            ['Date', 'User', 'Username', 'Message', 'Bot Response', 'Status'],
            ...filteredMessages.map(msg => [
                format(new Date(msg.timestamp), 'yyyy-MM-dd HH:mm:ss'),
                getRecipientName(msg), getRecipientUsername(msg),
                `"${getMessageContent(msg)}"`, `"${getBotResponse(msg)}"`, msg.status,
            ])
        ].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `message-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    const filterButtons = [
        { key: 'all', label: 'All', count: messages.length },
        { key: 'success', label: 'Delivered', count: messages.filter(m => m.status === 'success').length, color: '#10b981' },
        { key: 'failed', label: 'Failed', count: messages.filter(m => m.status === 'failed').length, color: '#ef4444' },
    ];

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-main font-display tracking-tight mb-0.5">
                        Conversations 💬
                    </h1>
                    <p className="text-secondary text-[11px] sm:text-xs">View all conversations between users and your AI bot.</p>
                </div>
                <button onClick={exportToCSV} className="btn btn-secondary text-sm flex-shrink-0">
                    <Download size={16} /> Export CSV
                </button>
            </motion.div>

            {/* Search & Filters */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                    <input
                        type="text" placeholder="Search by name or message..."
                        className="input pl-11 py-2.5 text-sm"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-1.5 rounded-xl p-1.5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    {filterButtons.map(btn => (
                        <button key={btn.key} onClick={() => setFilter(btn.key)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer"
                            style={{
                                background: filter === btn.key ? (btn.color || '#3b82f6') : 'transparent',
                                color: filter === btn.key ? '#fff' : 'var(--color-text-secondary)',
                                boxShadow: filter === btn.key ? `0 4px 12px ${btn.color || '#3b82f6'}30` : 'none',
                            }}
                        >
                            {btn.label} ({btn.count})
                        </button>
                    ))}
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

            {/* Messages */}
            {loading ? (
                <div className="rounded-2xl border p-16 text-center" style={{ background: 'var(--glass-bg)', borderColor: 'var(--color-border)' }}>
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#3b82f6' }} />
                    <p className="text-secondary font-medium">Loading messages...</p>
                </div>
            ) : filteredMessages.length > 0 ? (
                <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
                    {filteredMessages.map((message) => (
                        <motion.div key={message._id} variants={riseUp}>
                            <div className="group rounded-2xl border p-4 md:p-5 transition-all duration-300" style={{
                                background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4 gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                                            background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)',
                                        }}>
                                            <User size={18} style={{ color: '#3b82f6' }} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-main truncate">{getRecipientName(message)}</h3>
                                            <p className="text-[11px] text-secondary">@{getRecipientUsername(message)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-[10px] text-secondary font-medium flex items-center gap-1 justify-end mb-1">
                                            <Clock size={10} />
                                            {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${message.status === 'success' ? 'badge-success' : 'badge-neutral'}`}>
                                            {message.status === 'success' ? '✅ Delivered' : '❌ Failed'}
                                        </span>
                                    </div>
                                </div>

                                {/* Chat bubbles */}
                                <div className="grid md:grid-cols-2 gap-3">
                                    {/* User message */}
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <MessageSquare size={12} style={{ color: '#3b82f6' }} />
                                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">User</span>
                                        </div>
                                        <div className="rounded-xl p-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                            <p className="text-xs text-main leading-relaxed">{getMessageContent(message)}</p>
                                        </div>
                                    </div>
                                    {/* Bot response */}
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Bot size={12} style={{ color: '#8b5cf6' }} />
                                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">AI Bot</span>
                                        </div>
                                        <div className="rounded-xl p-3" style={{ background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                                            <p className="text-xs leading-relaxed" style={{ color: '#8b5cf6' }}>{getBotResponse(message)}</p>
                                        </div>
                                    </div>
                                </div>

                                {message.details && (
                                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                                        <div className="text-xs rounded-lg p-2.5" style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                            <strong>Error:</strong> {message.details}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="rounded-2xl border p-16 text-center" style={{ background: 'var(--glass-bg)', borderColor: 'var(--color-border)' }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                        <MessageSquare size={28} style={{ color: 'var(--color-text-tertiary)' }} />
                    </div>
                    <h3 className="text-xl font-bold text-main mb-2">No messages yet</h3>
                    <p className="text-sm text-secondary max-w-sm mx-auto">Conversations will appear here once users start chatting with your bot.</p>
                </div>
            )}
        </div>
    );
};

export default MessageHistory;