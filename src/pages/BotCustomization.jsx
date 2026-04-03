import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, Sparkles, MessageCircle, Bot, Loader2, CheckCircle, Zap } from 'lucide-react';
import api from '../utils/api';

const riseUp = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

const BotCustomization = () => {
    const [settings, setSettings] = useState({
        welcomeMessage: '',
        personality: 'friendly',
        responseDelay: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings/telegram');
            setSettings(res.data);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/settings/telegram', settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save settings:', err);
        }
        setSaving(false);
    };

    const personalities = [
        { value: 'professional', label: 'Professional', description: 'Formal and business-like tone — great for B2B', emoji: '💼', color: '#3b82f6' },
        { value: 'friendly', label: 'Friendly', description: 'Warm, approachable — perfect for customer support', emoji: '😊', color: '#10b981' },
        { value: 'casual', label: 'Casual', description: 'Relaxed and conversational — ideal for creators', emoji: '👋', color: '#f59e0b' },
        { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and exciting — great for marketing', emoji: '🎉', color: '#8b5cf6' },
    ];

    const previewMessage = settings.welcomeMessage.replace('{{name}}', 'Rajesh');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                        <Bot size={18} className="absolute inset-0 m-auto text-purple-500" />
                    </div>
                    <p className="text-secondary text-sm font-medium">Loading bot settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-8">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-main font-display tracking-tight mb-0.5">
                    AI Assistant Settings 🤖
                </h1>
                <p className="text-secondary text-[11px] sm:text-xs">Customize how your AI talks to your customers.</p>
            </motion.div>

            {/* Saved toast */}
            <AnimatePresence>
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
                        <CheckCircle size={16} /> Bot settings saved successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Panel */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Welcome Message */}
                    <motion.div variants={riseUp}>
                        <div className="rounded-2xl border overflow-hidden" style={{
                            background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                        }}>
                            <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                    <MessageCircle size={16} />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-main font-display">Welcome Message</h2>
                                    <p className="text-xs text-secondary">First message your bot sends to new users</p>
                                </div>
                            </div>
                            <div className="p-5">
                                <p className="text-xs text-secondary mb-3">
                                    Use <code className="px-1.5 py-0.5 rounded text-[11px] font-bold" style={{ background: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6' }}>{'{{name}}'}</code> to include the customer's name.
                                </p>
                                <textarea
                                    value={settings.welcomeMessage}
                                    onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                                    className="input min-h-[120px] font-mono text-sm resize-y"
                                    placeholder="Hi {{name}}! Welcome to our business. How can I help you today?"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Personality */}
                    <motion.div variants={riseUp}>
                        <div className="rounded-2xl border overflow-hidden" style={{
                            background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                        }}>
                            <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-main font-display">Bot Personality</h2>
                                    <p className="text-xs text-secondary">Decide how your bot communicates</p>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {personalities.map((p) => (
                                        <button
                                            key={p.value}
                                            onClick={() => setSettings({ ...settings, personality: p.value })}
                                            className="group relative p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer"
                                            style={{
                                                borderColor: settings.personality === p.value ? `${p.color}50` : 'var(--color-border)',
                                                background: settings.personality === p.value ? `${p.color}06` : 'transparent',
                                                boxShadow: settings.personality === p.value ? `0 4px 16px ${p.color}12` : 'none',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (settings.personality !== p.value) {
                                                    e.currentTarget.style.borderColor = `${p.color}30`;
                                                    e.currentTarget.style.background = `${p.color}03`;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (settings.personality !== p.value) {
                                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                                    e.currentTarget.style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            {settings.personality === p.value && (
                                                <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: p.color }}>
                                                    <CheckCircle size={12} />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2.5 mb-1.5">
                                                <span className="text-xl">{p.emoji}</span>
                                                <span className="text-sm font-bold" style={{ color: settings.personality === p.value ? p.color : 'var(--color-text-primary)' }}>{p.label}</span>
                                            </div>
                                            <p className="text-[11px] text-secondary leading-relaxed">{p.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Response Delay */}
                    <motion.div variants={riseUp}>
                        <div className="rounded-2xl border overflow-hidden" style={{
                            background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                        }}>
                            <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                    <Settings size={16} />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-main font-display">Response Speed</h2>
                                    <p className="text-xs text-secondary">Add delay to make replies feel more natural</p>
                                </div>
                            </div>
                            <div className="p-5">
                                <input
                                    type="range" min="0" max="60"
                                    value={settings.responseDelay}
                                    onChange={(e) => setSettings({ ...settings, responseDelay: parseInt(e.target.value) })}
                                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    style={{ background: 'var(--color-border)' }}
                                />
                                <div className="flex justify-between text-xs text-secondary mt-2 font-medium">
                                    <span>⚡ Instant</span>
                                    <span className="font-bold text-main text-sm">{settings.responseDelay}s</span>
                                    <span>🕐 1 minute</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Save Button */}
                    <motion.div variants={riseUp}>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-60 cursor-pointer"
                            style={{
                                background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                color: '#ffffff',
                                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.25)',
                            }}
                            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {saving ? (
                                <><Loader2 size={16} className="animate-spin" /> Saving...</>
                            ) : saved ? (
                                <><CheckCircle size={16} /> Saved Successfully!</>
                            ) : (
                                <><Save size={16} /> Save Changes</>
                            )}
                        </button>
                    </motion.div>
                </div>

                {/* Preview Panel */}
                <motion.div variants={riseUp} className="lg:col-span-1">
                    <div className="sticky top-8 rounded-2xl border overflow-hidden" style={{
                        background: 'var(--glass-bg)', borderColor: 'var(--color-border)',
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                        boxShadow: 'var(--shadow-lg)',
                    }}>
                        <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: 'var(--color-border)' }}>
                            <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </span>
                            <h3 className="text-sm font-bold text-main font-display">Live Preview</h3>
                        </div>

                        {/* Chat preview */}
                        <div className="p-5">
                            <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                                        <Bot size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="rounded-xl rounded-tl-sm p-3" style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.12)' }}>
                                            <p className="text-xs text-main whitespace-pre-wrap leading-relaxed">
                                                {previewMessage || 'Your welcome message will appear here...'}
                                            </p>
                                        </div>
                                        <p className="text-[10px] text-secondary mt-1.5 ml-1">Just now</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2.5 rounded-xl p-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                <div className="flex justify-between text-xs">
                                    <span className="text-secondary font-medium">Personality</span>
                                    <span className="font-bold text-main capitalize">{settings.personality}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-secondary font-medium">Response Speed</span>
                                    <span className="font-bold text-main">{settings.responseDelay === 0 ? 'Instant ⚡' : `${settings.responseDelay}s`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default BotCustomization;
