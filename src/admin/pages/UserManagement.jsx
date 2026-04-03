import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, ShieldCheck, MoreVertical, Trash2, Ban, Eye } from 'lucide-react';
import api from '../../utils/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // stores ID of user being updated

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuspend = async (userId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 're-activate' : 'suspend'} this user?`)) return;
        setActionLoading(userId);
        try {
            const res = await api.put(`/admin/users/${userId}/suspend`);
            setUsers(users.map(u => u._id === userId ? { ...u, isSuspended: res.data.user.isSuspended } : u));
        } catch (err) {
            alert(err.response?.data?.msg || 'Error updating user.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('CRITICAL WARNING: This will permanently destroy this user and ALL their data. Proceed?')) return;
        setActionLoading(userId);
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert(err.response?.data?.msg || 'Error deleting user.');
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(u => 
        u.email.toLowerCase().includes(search.toLowerCase()) || 
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="text-gray-500 font-mono text-sm">Loading user directory...</div>;

    return (
        <div className="max-w-[1400px] mx-auto animate-fade-in">
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">User Directory</h1>
                    <p className="text-gray-400 text-sm">Manage entire user base permissions, access, and records.</p>
                </div>
                
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search email or name..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-80 bg-[#121214] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
            </header>

            <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0f0f11] text-xs font-mono text-gray-500 uppercase tracking-wider border-b border-white/5">
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Joined Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-900/50 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white truncate max-w-[200px]">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider border ${
                                            user.role === 'owner' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                            user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            'bg-gray-800 text-gray-400 border-gray-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isSuspended ? (
                                            <span className="flex items-center gap-1.5 text-xs text-red-400"><Ban size={14} /> Suspended</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs text-green-400"><ShieldCheck size={14} /> Active</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                disabled={user.role === 'owner' || actionLoading === user._id}
                                                onClick={() => handleSuspend(user._id, user.isSuspended)}
                                                className={`p-2 rounded-lg transition-colors border ${
                                                    user.isSuspended 
                                                    ? 'text-green-400 hover:bg-green-500/10 border-transparent hover:border-green-500/20' 
                                                    : 'text-amber-400 hover:bg-amber-500/10 border-transparent hover:border-amber-500/20'
                                                } disabled:opacity-30 disabled:cursor-not-allowed`}
                                                title={user.isSuspended ? "Reactivate" : "Suspend User"}
                                            >
                                                {user.isSuspended ? <ShieldCheck size={16} /> : <Ban size={16} />}
                                            </button>
                                            <button 
                                                disabled={user.role === 'owner' || actionLoading === user._id}
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-red-500 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Delete User Permanently"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-center text-xs text-gray-600 mt-4 font-mono">Showing {filteredUsers.length} total users</p>
        </div>
    );
};

export default UserManagement;
