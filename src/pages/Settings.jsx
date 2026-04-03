import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Save, CheckCircle, Loader2, Shield, Mail, Phone, Building2, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const riseUp = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

/* ─── Premium Toggle ─── */
const PremiumToggle = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 md:p-5 rounded-xl border transition-all duration-300" style={{
        background: 'var(--color-surface)',
        borderColor: checked ? 'rgba(59, 130, 246, 0.2)' : 'var(--color-border)',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-surface)'; }}
    >
        <div className="pr-4">
            <p className="text-sm font-bold text-main">{label}</p>
            <p className="text-xs text-secondary mt-0.5">{description}</p>
        </div>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`toggle-switch ${checked ? 'active' : ''} flex-shrink-0`}
            role="switch"
            aria-checked={checked}
        >
            <span className="toggle-knob" />
        </button>
    </div>
);

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const [userData, setUserData] = useState({ name: '', email: '', company: '', phone: '' });
    const [notifications, setNotifications] = useState({ email: true, failedAlerts: true, weeklyReport: false });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/user');
                setUserData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    company: res.data.company || '',
                    phone: res.data.phone || '',
                });
            } catch (err) {
                console.error('Failed to fetch user:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        // Simulate save for now
        await new Promise(r => setTimeout(r, 800));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                    </div>
                    <p className="text-secondary text-sm font-medium">Loading settings...</p>
                </div>
            </div>
        );
    }

    const initials = userData.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'JA';

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-8">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-main font-display tracking-tight mb-0.5">
                    Preferences & Account ⚙️
                </h1>
                <p className="text-secondary text-[11px] sm:text-xs">Manage your account, appearance, and security.</p>
            </motion.div>

            {/* Saved toast */}
            {saved && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-medium"
                    style={{
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                    }}
                >
                    <CheckCircle size={16} /> Changes saved successfully!
                </motion.div>
            )}

            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-6 max-w-4xl">
                {/* Profile */}
                <motion.div variants={riseUp}>
                    <div className="rounded-2xl border overflow-hidden" style={{
                        background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    }}>
                        <div className="flex items-center gap-4 p-5 md:p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-lg flex-shrink-0" style={{
                                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                color: '#ffffff',
                            }}>
                                {initials}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-main">Profile Information</h2>
                                <p className="text-xs text-secondary">Update your personal details</p>
                            </div>
                        </div>

                        <div className="p-5 md:p-6">
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="label">
                                        <User size={12} className="inline mr-1.5" />Full Name
                                    </label>
                                    <input type="text" className="input" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="label">
                                        <Mail size={12} className="inline mr-1.5" />Email Address
                                    </label>
                                    <input type="email" className="input" value={userData.email} disabled style={{ opacity: 0.6 }} />
                                </div>
                                <div>
                                    <label className="label">
                                        <Building2 size={12} className="inline mr-1.5" />Company Name
                                    </label>
                                    <input type="text" className="input" placeholder="Your business name" value={userData.company} onChange={(e) => setUserData({...userData, company: e.target.value})} />
                                </div>
                                <div>
                                    <label className="label">
                                        <Phone size={12} className="inline mr-1.5" />Phone Number
                                    </label>
                                    <input type="tel" className="input" placeholder="+91 98765 43210" value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})} />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                                <button onClick={handleSave} disabled={saving} className="btn btn-primary text-sm">
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Appearance */}
                <motion.div variants={riseUp}>
                    <div className="rounded-2xl border overflow-hidden" style={{
                        background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    }}>
                        <div className="flex items-center gap-3 p-5 md:p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                <Palette size={18} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-main">Appearance</h2>
                                <p className="text-xs text-secondary">Customize how your dashboard looks</p>
                            </div>
                        </div>
                        <div className="p-5 md:p-6">
                            <PremiumToggle
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                                label="Dark Mode"
                                description="Switch between light and dark themes for comfortable viewing."
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div variants={riseUp}>
                    <div className="rounded-2xl border overflow-hidden" style={{
                        background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    }}>
                        <div className="flex items-center gap-3 p-5 md:p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                <Bell size={18} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-main">Notifications</h2>
                                <p className="text-xs text-secondary">Choose how you receive alerts</p>
                            </div>
                        </div>
                        <div className="p-5 md:p-6 space-y-3">
                            <PremiumToggle
                                checked={notifications.email}
                                onChange={(v) => setNotifications({...notifications, email: v})}
                                label="Email Notifications"
                                description="Receive emails about your automation activity."
                            />
                            <PremiumToggle
                                checked={notifications.failedAlerts}
                                onChange={(v) => setNotifications({...notifications, failedAlerts: v})}
                                label="Failed Automation Alerts"
                                description="Get notified immediately if an automation fails."
                            />
                            <PremiumToggle
                                checked={notifications.weeklyReport}
                                onChange={(v) => setNotifications({...notifications, weeklyReport: v})}
                                label="Weekly Summary Report"
                                description="Get a weekly email summary of all your automation activity."
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Security */}
                <motion.div variants={riseUp}>
                    <div className="rounded-2xl border overflow-hidden" style={{
                        background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    }}>
                        <div className="flex items-center gap-3 p-5 md:p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <Shield size={18} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-main">Security</h2>
                                <p className="text-xs text-secondary">Update your password and security settings</p>
                            </div>
                        </div>
                        <div className="p-5 md:p-6">
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="label">Current Password</label>
                                    <input type="password" className="input" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="label">New Password</label>
                                    <input type="password" className="input" placeholder="••••••••" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                                <button className="btn btn-secondary text-sm">
                                    <Lock size={14} /> Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Settings;
