import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Loader2, MessageSquare, User, Clock, Bot } from 'lucide-react';
import api from '../utils/api';
import { format } from 'date-fns';

const MessageHistory = () => {
    const [messages, setMessages] = useState([]);

    // Helper function to safely get message content
    const getMessageContent = (message) => {
        if (message.messageData) {
            // If messageData is already an object
            if (typeof message.messageData === 'object' && message.messageData.messageContent) {
                return message.messageData.messageContent.trim();
            }
            // If messageData is a JSON string, parse it
            if (typeof message.messageData === 'string') {
                try {
                    const parsed = JSON.parse(message.messageData);
                    return parsed.messageContent?.trim() || message.action;
                } catch (e) {
                    console.error('Error parsing messageData:', e);
                    return message.action;
                }
            }
        }
        return message.action;
    };

    // Helper function to safely get bot response
    const getBotResponse = (message) => {
        if (message.messageData) {
            // If messageData is already an object
            if (typeof message.messageData === 'object' && message.messageData.botResponse) {
                return message.messageData.botResponse.trim();
            }
            // If messageData is a JSON string, parse it
            if (typeof message.messageData === 'string') {
                try {
                    const parsed = JSON.parse(message.messageData);
                    return parsed.botResponse?.trim() || 'Response logged in backend';
                } catch (e) {
                    console.error('Error parsing messageData:', e);
                    return 'Response logged in backend';
                }
            }
        }
        return 'Response logged in backend';
    };

    // Helper function to safely get recipient name
    const getRecipientName = (message) => {
        if (message.messageData) {
            // If messageData is already an object
            if (typeof message.messageData === 'object') {
                if (message.messageData.recipientName) {
                    return message.messageData.recipientName.trim();
                } else if (message.messageData.recipientUsername) {
                    return message.messageData.recipientUsername.trim();
                }
            }
            // If messageData is a JSON string, parse it
            if (typeof message.messageData === 'string') {
                try {
                    const parsed = JSON.parse(message.messageData);
                    if (parsed.recipientName) {
                        return parsed.recipientName.trim();
                    } else if (parsed.recipientUsername) {
                        return parsed.recipientUsername.trim();
                    }
                } catch (e) {
                    console.error('Error parsing messageData:', e);
                }
            }
        }
        return 'User';
    };

    // Helper function to safely get recipient username
    const getRecipientUsername = (message) => {
        if (message.messageData) {
            // If messageData is already an object
            if (typeof message.messageData === 'object') {
                if (message.messageData.recipientUsername) {
                    return message.messageData.recipientUsername.trim();
                } else if (message.messageData.recipientName) {
                    return message.messageData.recipientName.trim();
                }
            }
            // If messageData is a JSON string, parse it
            if (typeof message.messageData === 'string') {
                try {
                    const parsed = JSON.parse(message.messageData);
                    if (parsed.recipientUsername) {
                        return parsed.recipientUsername.trim();
                    } else if (parsed.recipientName) {
                        return parsed.recipientName.trim();
                    }
                } catch (e) {
                    console.error('Error parsing messageData:', e);
                }
            }
        }
        return 'user';
    };
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchMessageHistory();

        // Refresh every 30 seconds
        const interval = setInterval(fetchMessageHistory, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchMessageHistory = async () => {
        try {
            setError('');
            const res = await api.get('/logs');

            // Get all Telegram messages and debug the structure
            console.log('Raw logs from API:', res.data);
            const telegramMessages = res.data
                .filter(log => log.platform === 'telegram')
                .map(log => {
                    console.log('Processing log:', log);
                    return log;
                })
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setMessages(telegramMessages);
        } catch (err) {
            console.error('Error fetching message history:', err);
            setError(err.response?.data?.msg || err.message || 'Failed to fetch message history');
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = filter === 'all'
        ? messages
        : messages.filter(msg => msg.status === filter);

    const exportToCSV = () => {
        const csvContent = [
            ['Date', 'User', 'Username', 'Message', 'Bot Response', 'Status'],
            ...filteredMessages.map(msg => [
                format(new Date(msg.timestamp), 'yyyy-MM-dd HH:mm:ss'),
                getRecipientName(msg),
                getRecipientUsername(msg),
                `"${getMessageContent(msg)}"`,
                `"${getBotResponse(msg) || 'No response'}"`,
                msg.status
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `message-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 p-6 bg-surface border border-main rounded-2xl transition-colors">
                <div>
                    <h1 className="text-3xl font-bold text-main tracking-tight">Message History</h1>
                    <p className="text-secondary mt-1">View all conversations between users and your automated assistant.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={exportToCSV}
                        className="btn btn-secondary text-sm"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8 bg-surface p-2 rounded-xl border border-main transition-colors">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all'
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-secondary hover:bg-body hover:text-main'
                        }`}
                >
                    All ({messages.length})
                </button>
                <button
                    onClick={() => setFilter('success')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'success'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                        : 'text-secondary hover:bg-body hover:text-main'
                        }`}
                >
                    Success ({messages.filter(m => m.status === 'success').length})
                </button>
                <button
                    onClick={() => setFilter('failed')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'failed'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                        : 'text-secondary hover:bg-body hover:text-main'
                        }`}
                >
                    Failed ({messages.filter(m => m.status === 'failed').length})
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="text-red-400 text-sm font-medium">{error}</div>
                </div>
            )}

            {/* Message List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="card p-12 text-center transition-colors">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-secondary font-medium">Loading message history...</p>
                    </div>
                ) : filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                        <div key={message._id} className="card p-6 border-main/50 hover:border-primary/50 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                                        <User size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-main text-lg">
                                            {getRecipientName(message)}
                                        </h3>
                                        <p className="text-sm text-secondary">
                                            @{getRecipientUsername(message)}
                                        </p>
                                    </div>
                                </div>
                                <div className="sm:text-right">
                                    <div className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-1.5 flex items-center sm:justify-end gap-1.5">
                                        <Clock size={12} />
                                        {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${message.status === 'success' ? 'badge-success' : 'badge-neutral'}`}>
                                        {message.status === 'success' ? 'Delivered' : 'Failed'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MessageSquare size={16} className="text-primary" />
                                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">User Message</span>
                                    </div>
                                    <div className="bg-body p-4 rounded-2xl border border-main transition-colors">
                                        <p className="text-main leading-relaxed text-sm">
                                            {getMessageContent(message)}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Bot size={16} className="text-purple-500" />
                                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Bot Response</span>
                                    </div>
                                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl">
                                        <p className="text-primary leading-relaxed text-sm font-medium">
                                            {getBotResponse(message)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {message.details && (
                                <div className="mt-6 pt-4 border-t border-main">
                                    <div className="text-sm text-red-400 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                        <strong className="text-red-500">Error Details:</strong> {message.details}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="card p-16 text-center shadow-lg transition-colors">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/40 mx-auto mb-6 border border-primary/10">
                            <MessageSquare size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-main mb-2">No messages yet</h3>
                        <p className="text-secondary max-w-sm mx-auto">
                            Conversation history will appear here once users start interacting with your bot.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageHistory;