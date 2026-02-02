import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Loader2, Clock, MessageSquare, Users, Calendar, User, Bot as BotIcon, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import { formatDistanceToNow } from 'date-fns';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);

    // Helper function to safely get message content
    const getMessageContent = (log) => {
        if (log.messageData) {
            // If messageData is already an object
            if (typeof log.messageData === 'object' && log.messageData.messageContent) {
                return log.messageData.messageContent.trim();
            }
            // If messageData is a JSON string, parse it
            if (typeof log.messageData === 'string') {
                try {
                    const parsed = JSON.parse(log.messageData);
                    return parsed.messageContent?.trim() || log.action;
                } catch (e) {
                    console.error('Error parsing messageData:', e);
                    return log.action;
                }
            }
        }
        return log.action;
    };

    // Helper function to safely get bot response
    const getBotResponse = (log) => {
        if (log.messageData) {
            // If messageData is already an object
            if (typeof log.messageData === 'object' && log.messageData.botResponse) {
                return log.messageData.botResponse.trim();
            }
            // If messageData is a JSON string, parse it
            if (typeof log.messageData === 'string') {
                try {
                    const parsed = JSON.parse(log.messageData);
                    return parsed.botResponse?.trim() || 'Response logged in backend';
                } catch (e) {
                    console.error('Error parsing messageData:', e);
                    return 'Response logged in backend';
                }
            }
        }
        return 'Response logged in backend';
    };

    // Helper function to safely get recipient username
    const getRecipientUsername = (log) => {
        if (log.messageData) {
            // If messageData is already an object
            if (typeof log.messageData === 'object') {
                if (log.messageData.recipientUsername) {
                    return log.messageData.recipientUsername.trim();
                } else if (log.messageData.recipientName) {
                    return log.messageData.recipientName.trim();
                }
            }
            // If messageData is a JSON string, parse it
            if (typeof log.messageData === 'string') {
                try {
                    const parsed = JSON.parse(log.messageData);
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
        return 'Unknown';
    };
    const getAutomationIcon = (name) => {
        const lowerName = name?.toLowerCase() || '';
        if (lowerName.includes('lead')) return <Users size={18} className="text-emerald-600" />;
        if (lowerName.includes('schedule')) return <Calendar size={18} className="text-purple-600" />;
        return <MessageSquare size={18} className="text-blue-600" />;
    };

    const getIconBgColor = (name) => {
        const lowerName = name?.toLowerCase() || '';
        if (lowerName.includes('lead')) return 'bg-emerald-100';
        if (lowerName.includes('schedule')) return 'bg-purple-100';
        return 'bg-blue-100';
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLogs();

        // Refresh logs every 10 seconds
        const interval = setInterval(fetchLogs, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchLogs = async () => {
        try {
            setError('');

            // Debug localStorage
            console.log('=== LOCAL STORAGE DEBUG ===');
            console.log('All localStorage items:', Object.keys(localStorage));
            console.log('Token item:', localStorage.getItem('token'));

            const res = await api.get('/logs');
            console.log('=== DEBUG INFO ===');
            console.log('Fetched logs count:', res.data.length);

            // Get current user ID from token
            const token = localStorage.getItem('token');
            let currentUserId = null;
            if (token) {
                try {
                    // Split JWT token and decode payload
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    const payload = JSON.parse(jsonPayload);
                    // JWT payload structure is { user: { id: 'user_id' } }
                    currentUserId = payload.user?.id;
                    console.log('Current user ID from token:', currentUserId);
                    console.log('Full token payload structure:', Object.keys(payload));
                    console.log('User object in payload:', payload.user);
                } catch (e) {
                    console.log('Could not decode token:', e.message);
                    console.log('Token present:', !!token);
                    console.log('Token length:', token?.length);
                }
            } else {
                console.log('No token found in localStorage');
            }

            // Show log user IDs
            if (res.data.length > 0) {
                console.log('Log user IDs in response:');
                res.data.slice(0, 5).forEach((log, index) => {
                    console.log(`  ${index + 1}. Log ID: ${log._id} | User ID: ${log.userId} | Match: ${log.userId === currentUserId}`);
                });
            } else {
                console.log('No logs found in response');
            }

            setLogs(res.data);
        } catch (err) {
            console.error('Error fetching logs:', err);
            setError(err.response?.data?.msg || err.message || 'Failed to fetch logs');

            // Check if it's an auth error
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Activity Logs</h1>
                    <p className="text-slate-500 mt-1">Track every action performed by your automations.</p>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-secondary text-sm bg-white hover:bg-slate-50">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="card p-0 overflow-hidden border border-slate-200 shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-white items-center">
                    <div className="relative w-full sm:w-auto flex-1 max-w-md group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="input pl-10 py-2.5 text-sm bg-slate-50 border-transparent focus:bg-white focus:border-blue-200 w-full transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="btn btn-secondary text-sm py-2 px-4 flex-1 sm:flex-none justify-center">
                            <Filter size={16} /> Filter
                        </button>
                        <button className="btn btn-secondary text-sm py-2 px-4 flex-1 sm:flex-none justify-center" onClick={fetchLogs}>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 border-b border-red-100 animate-fade-in">
                        <div className="text-red-700 text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    </div>
                )}

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Automation</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                                        <p className="text-slate-500 font-medium">Fetching activity logs...</p>
                                    </td>
                                </tr>
                            ) : logs.length > 0 ? (
                                logs.map((log, index) => (
                                    <tr key={`${log._id}-${index}`} className="hover:bg-slate-50 transition-colors group border-b border-transparent hover:border-slate-100">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-lg ${getIconBgColor(log.automationName)} flex items-center justify-center shrink-0`}>
                                                    {getAutomationIcon(log.automationName)}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-900">{log.automationName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 group-hover:text-slate-700 font-medium">{log.action}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 max-w-md">
                                            {log.messageData ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-2">
                                                        <User size={14} className="mt-0.5 text-slate-400" />
                                                        <span className="font-medium text-slate-700 text-xs">{getRecipientUsername(log)}</span>
                                                    </div>

                                                    <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-2 border border-slate-100/50">
                                                        <MessageSquare size={14} className="mt-0.5 text-slate-400 shrink-0" />
                                                        <span className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                                                            {getMessageContent(log)}
                                                        </span>
                                                    </div>

                                                    {getBotResponse(log) !== 'Response logged in backend' && (
                                                        <div className="flex items-start gap-2 ml-4">
                                                            <BotIcon size={14} className="mt-0.5 text-blue-500" />
                                                            <span className="text-slate-500 text-xs line-clamp-1 italic">
                                                                {getBotResponse(log)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic text-xs">No additional details</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${log.status === 'success'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                                    }`}>
                                                    {log.status === 'success' ? 'Success' : 'Failed'}
                                                </span>
                                                <button className="text-slate-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-6 transform rotate-12">
                                            <Clock size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">No activity yet</h3>
                                        <p className="text-slate-500">Your automation actions will appear here once they start running.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-100">
                    {loading ? (
                        <div className="px-4 py-20 text-center">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">Fetching activity logs...</p>
                        </div>
                    ) : logs.length > 0 ? (
                        logs.map((log, index) => (
                            <div key={`mobile-${log._id}-${index}`} className="p-4 space-y-3 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-slate-900">{log.automationName}</div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${log.status === 'success'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}>
                                        {log.status === 'success' ? 'Success' : 'Failed'}
                                    </span>
                                </div>

                                <div className="text-sm text-slate-600">
                                    <span className="font-medium text-slate-500 text-xs uppercase tracking-wide mr-2">Action:</span>
                                    {log.action}
                                </div>

                                {log.messageData && (
                                    <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-2 border border-slate-100">
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>User: {getRecipientUsername(log)}</span>
                                        </div>
                                        <div className="text-slate-600 border-l-2 border-blue-200 pl-2">
                                            {getMessageContent(log)?.substring(0, 100)}
                                            {getMessageContent(log)?.length > 100 ? '...' : ''}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-6 transform rotate-12">
                                <Clock size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">No activity yet</h3>
                            <p className="text-slate-500">Your automation actions will appear here once they start running.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs md:text-sm text-slate-500 bg-slate-50/50">
                    <span>Showing {logs.length} logs</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white hover:shadow-sm transition-all disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white hover:shadow-sm transition-all" onClick={fetchLogs}>Refresh</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogs;
