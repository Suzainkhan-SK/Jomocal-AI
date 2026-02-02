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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Message History</h1>
                    <p className="text-slate-500 mt-1">View all conversations between users and your automated assistant.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={exportToCSV}
                        className="btn btn-secondary text-sm bg-white hover:bg-slate-50"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-6 flex flex-wrap gap-3">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === 'all' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                    All Messages ({messages.length})
                </button>
                <button
                    onClick={() => setFilter('success')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === 'success' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                    Successful ({messages.filter(m => m.status === 'success').length})
                </button>
                <button
                    onClick={() => setFilter('failed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === 'failed' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                    Failed ({messages.filter(m => m.status === 'failed').length})
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div className="text-red-700 text-sm font-medium">{error}</div>
                </div>
            )}

            {/* Message List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="card p-12 text-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Loading message history...</p>
                    </div>
                ) : filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                        <div key={message._id} className="card p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {getRecipientName(message)}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            @{getRecipientUsername(message)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-500">
                                        {format(new Date(message.timestamp), 'MMM d, yyyy h:mm a')}
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                        message.status === 'success'
                                            ? 'bg-green-50 text-green-700 border border-green-100'
                                            : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                        {message.status === 'success' ? 'Delivered' : 'Failed'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare size={16} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700">User Message</span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-slate-800">
                                            {getMessageContent(message)}
                                        </p>
                                    </div>
                                </div>
                                                                    
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Bot size={16} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700">Bot Response</span>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-slate-800">
                                            {getBotResponse(message)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {message.details && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="text-sm text-slate-500">
                                        <strong>Error Details:</strong> {message.details}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="card p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-6">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No messages yet</h3>
                        <p className="text-slate-500">
                            Conversation history will appear here once users start interacting with your bot.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageHistory;