import React, { useState, useEffect } from 'react';
import { RefreshCw, Terminal, AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp, Search, Filter, Activity } from 'lucide-react';
import api from '../../utils/api';

const StatusBadge = ({ status }) => {
    const styles = {
        success: "border-green-500/20 bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]",
        error: "border-red-500/20 bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
        failed: "border-red-500/20 bg-red-500/10 text-red-400",
        pending: "border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
    };

    const icons = {
        success: <CheckCircle size={10} />,
        error: <AlertCircle size={10} />,
        failed: <AlertCircle size={10} />,
        pending: <Clock size={10} />
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.pending}`}>
            {icons[status] || icons.pending}
            {status}
        </span>
    );
};

const LogRow = ({ log }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasError = log.status === 'error' || log.status === 'failed';

    return (
        <React.Fragment>
            <tr 
                className={`group border-b border-white/5 transition-colors cursor-pointer ${isExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <td className="px-6 py-4">
                    <p className="text-[11px] font-mono text-gray-500">{new Date(log.timestamp || log.createdAt).toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{log.userId?.name || 'Unknown User'}</span>
                        <span className="text-[10px] font-mono text-gray-500 truncate max-w-[180px]">{log.userId?.email || 'System Account'}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <p className="text-sm text-gray-300 font-medium">{log.automationName || log.action}</p>
                </td>
                <td className="px-6 py-4">
                    <StatusBadge status={log.status} />
                </td>
                <td className="px-6 py-4 text-right">
                    {(hasError || log.details) && (
                        <div className="flex justify-end text-gray-500 group-hover:text-white transition-colors">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                    )}
                </td>
            </tr>
            {isExpanded && (log.details || log.messageData) && (
                <tr>
                    <td colSpan="5" className="px-6 py-0 bg-black/40">
                        <div className="py-6 animate-in slide-in-from-top-2 duration-200">
                            <div className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Terminal size={12} /> Execution Details
                                    </span>
                                    {hasError && <span className="text-[10px] font-mono text-red-500 uppercase font-bold animate-pulse">FAILURE DETECTED</span>}
                                </div>
                                <div className="p-4 overflow-x-auto">
                                    <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {typeof log.details === 'string' ? log.details : JSON.stringify(log.details || log.messageData, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filters = ['All', 'Success', 'Error', 'Pending'];

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/admin/logs?status=${filter}`);
            setLogs(res.data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    const filteredLogs = logs.filter(log => 
        log.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.automationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto animate-fade-in font-sans selection:bg-indigo-500/30">
            {/* Header Area */}
            <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                            <Activity size={18} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Mission Control</h1>
                    </div>
                    <p className="text-gray-400 text-sm">Real-time automation telemetry and system-wide execution logs.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search telemetry..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#121214] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                        />
                    </div>
                    <button 
                        onClick={fetchLogs}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl border border-white/5 transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        <span className="text-sm font-bold">Refresh</span>
                    </button>
                </div>
            </header>

            {/* Filter Ribbons */}
            <div className="flex gap-2 mb-6">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            filter === f 
                            ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                            : 'bg-[#121214] border-white/5 text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Data Feed */}
            <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden relative shadow-2xl">
                {!isLoading && filteredLogs.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-500 grayscale opacity-50">
                        <Terminal size={48} className="mb-4" />
                        <p className="font-mono text-sm uppercase tracking-widest">No telemetry data detected.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/5">
                                    <th className="px-6 py-4 font-bold">Timestamp</th>
                                    <th className="px-6 py-4 font-bold">Operator</th>
                                    <th className="px-6 py-4 font-bold">Automation Node</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Raw Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan="5" className="px-6 py-8">
                                                <div className="h-4 bg-white/5 rounded-full animate-pulse w-full" />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredLogs.map((log) => <LogRow key={log._id} log={log} />)
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Visual Footer */}
                <div className="bg-black/40 px-6 py-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-600 uppercase">TELEMETRY LINK: ESTABLISHED</span>
                    <span className="text-[10px] font-mono text-gray-600 uppercase">RECORDS: {filteredLogs.length}</span>
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;
