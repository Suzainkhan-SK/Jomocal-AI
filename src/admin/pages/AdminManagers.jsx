import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, UserPlus, UserMinus, Search, Terminal } from 'lucide-react';
import api from '../../utils/api';

const AdminManagers = () => {
    const { adminUser } = useOutletContext();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (adminUser.role === 'owner') {
            fetchUsersForAdminManagement();
        }
    }, [adminUser]);

    const fetchUsersForAdminManagement = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleManageAdmin = async (userId, currentRole) => {
        const action = currentRole === 'admin' ? 'demote' : 'promote';
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
        
        setActionLoading(userId);
        try {
            const res = await api.post('/admin/manage-admins', { userId, action });
            setUsers(users.map(u => u._id === userId ? { ...u, role: res.data.user.role } : u));
        } catch (err) {
            alert(err.response?.data?.msg || 'Error managing admin role.');
        } finally {
            setActionLoading(null);
        }
    };

    if (adminUser.role !== 'owner') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500 font-mono">
                <ShieldAlert size={48} className="mb-4" />
                <h1 className="text-xl font-bold">ACCESS DENIED</h1>
                <p className="text-sm opacity-60 mt-2">ONLY THE PLATFORM OWNER CAN MANAGE ADMINISTRATORS.</p>
            </div>
        );
    }

    const admins = users.filter(u => u.role === 'admin');
    const filteredSearchUsers = users.filter(u => 
        u.role !== 'owner' && 
        u.role !== 'admin' &&
        (u.email.toLowerCase().includes(search.toLowerCase()) || u.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <header className="mb-10">
                <h1 className="text-2xl font-bold text-white mb-2">Access Control (Owner Only)</h1>
                <p className="text-gray-400 text-sm">Elevate trusted users to Admin status or revoke permissions.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Active Admins */}
                <section>
                    <h2 className="text-sm font-mono text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldCheck size={16} /> Current Administrators
                    </h2>
                    <div className="space-y-3">
                        {admins.map(admin => (
                            <div key={admin._id} className="bg-[#121214] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                                        {admin.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{admin.name}</p>
                                        <p className="text-[11px] text-gray-500 font-mono">{admin.email}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleManageAdmin(admin._id, admin.role)}
                                    disabled={actionLoading === admin._id}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
                                    title="Revoke Admin Access"
                                >
                                    <UserMinus size={18} />
                                </button>
                            </div>
                        ))}
                        {admins.length === 0 && (
                            <div className="p-8 border border-dashed border-white/5 rounded-xl text-center text-gray-600 text-sm italic">
                                No secondary administrators assigned.
                            </div>
                        )}
                    </div>
                </section>

                {/* Promote New Admins */}
                <section>
                    <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <UserPlus size={16} /> Promote Operator
                    </h2>
                    
                    <div className="relative mb-4">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Find user to promote..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div className="bg-[#0f0f11] border border-white/5 rounded-xl max-h-[400px] overflow-y-auto divide-y divide-white/5">
                        {search && filteredSearchUsers.map(user => (
                            <div key={user._id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-200">{user.name}</p>
                                    <p className="text-[10px] text-gray-500 font-mono">{user.email}</p>
                                </div>
                                <button 
                                    onClick={() => handleManageAdmin(user._id, user.role)}
                                    disabled={actionLoading === user._id}
                                    className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 text-sm font-bold rounded-lg transition-all border border-indigo-500/20 hover:text-white"
                                >
                                    Promote
                                </button>
                            </div>
                        ))}
                        {search && filteredSearchUsers.length === 0 && (
                            <div className="p-8 text-center text-gray-600 text-xs font-mono">NO RESULTS FOUND.</div>
                        )}
                        {!search && (
                            <div className="p-8 text-center text-gray-600 text-xs font-mono italic">ENTER SEARCH TO FILTER USERS.</div>
                        )}
                    </div>
                </section>
            </div>

            <div className="mt-12 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
                <Terminal className="text-red-400 shrink-0 mt-1" size={20} />
                <div>
                    <h3 className="text-red-400 font-bold text-sm uppercase font-mono mb-1">Owner Override Protocol</h3>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
                        Promoting a user to Administrator grants them full read/write access to user data, including the power to suspend accounts. 
                        Revoking access does not delete the user account; it merely strips their administrative credentials and returns them to a standard user role.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminManagers;
