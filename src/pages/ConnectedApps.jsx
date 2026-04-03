import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw, Loader2, Unplug, CheckCircle, Link as LinkIcon, X } from 'lucide-react';
import api from '../utils/api';

const riseUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };

/* Ultra-reliable CDNs (SimpleIcons/Wikimedia) that bypass adblockers */
const APP_ICONS = {
    google: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
    whatsapp: 'https://cdn.simpleicons.org/whatsapp/25D366',
    telegram: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
    instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
    facebook: 'https://cdn.simpleicons.org/facebook/1877F2',
    linkedin: 'https://cdn.simpleicons.org/linkedin/0A66C2',
    gmail: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
    youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
    google_calendar: 'https://cdn.simpleicons.org/googlecalendar/4285F4',
    google_sheets: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg',
    stripe: 'https://cdn.simpleicons.org/stripe/008CDD',
    razorpay: 'https://cdn.simpleicons.org/razorpay/02042B',
    shopify: 'https://cdn.simpleicons.org/shopify/95BF47',
    mailchimp: 'https://cdn.simpleicons.org/mailchimp/FFE01B',
    zoho: 'https://cdn.simpleicons.org/zohocorporation/000000',
    calendly: 'https://cdn.simpleicons.org/calendly/006BFF'
};

const APP_CONFIG = {
    google: { name: 'Google Account', placeholder: null, credentialKey: null, oauthOnly: true },
    whatsapp: { name: 'WhatsApp', placeholder: 'API Key or Access Token', credentialKey: 'token' },
    telegram: { name: 'Telegram Bot', placeholder: 'Bot Token', credentialKey: 'token', hint: 'From BotFather' },
    instagram: { name: 'Instagram', placeholder: 'Access Token', credentialKey: 'token' },
    facebook: { name: 'Facebook', placeholder: 'Page Access Token', credentialKey: 'token' },
    linkedin: { name: 'LinkedIn', placeholder: 'Access Token', credentialKey: 'token' },
    gmail: { name: 'Gmail', placeholder: null, credentialKey: null, oauthOnly: true },
    youtube: { name: 'YouTube', placeholder: null, credentialKey: null, oauthOnly: true },
    google_calendar: { name: 'Google Calendar', placeholder: null, credentialKey: null, oauthOnly: true },
    google_sheets: { name: 'Google Sheets', placeholder: null, credentialKey: null, oauthOnly: true },
    stripe: { name: 'Stripe', placeholder: 'Secret Key (sk_...)', credentialKey: 'token' },
    razorpay: { name: 'Razorpay', placeholder: 'Key ID + Key Secret', credentialKey: 'token' },
    shopify: { name: 'Shopify', placeholder: 'Store URL + Access Token', credentialKey: 'token' },
    mailchimp: { name: 'Mailchimp', placeholder: 'API Key', credentialKey: 'token' },
    zoho: { name: 'Zoho CRM', placeholder: 'API Key', credentialKey: 'token' },
    calendly: { name: 'Calendly', placeholder: 'API Key', credentialKey: 'token' }
};

const APP_CATEGORIES = [
    { id: 'messaging', label: '💬 Messaging & Support', apps: ['whatsapp', 'telegram'] },
    { id: 'social', label: '📱 Social Media Accounts', apps: ['google', 'instagram', 'facebook', 'linkedin', 'youtube'] },
    { id: 'productivity', label: '📊 Workspace Apps', apps: ['gmail', 'google_calendar', 'google_sheets', 'calendly'] },
    { id: 'business', label: '💼 Payments & Sales CRM', apps: ['stripe', 'razorpay', 'shopify', 'mailchimp', 'zoho'] },
];

const GOOGLE_SERVICES = [
    { id: 'youtube', label: 'YouTube' },
    { id: 'gmail', label: 'Gmail' },
    { id: 'sheets', label: 'Sheets' },
];

const ConnectedApps = () => {
    const [integrations, setIntegrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [token, setToken] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [disconnectingId, setDisconnectingId] = useState(null);
    const [youtubeRedirecting, setYoutubeRedirecting] = useState(false);
    const [googleRedirecting, setGoogleRedirecting] = useState(false);
    const [showYoutubeConnectedToast, setShowYoutubeConnectedToast] = useState(false);
    const [showGoogleConnectedToast, setShowGoogleConnectedToast] = useState(false);

    const location = useLocation();

    useEffect(() => { fetchIntegrations(); }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('youtube') === 'connected') {
            setShowYoutubeConnectedToast(true);
            const t = setTimeout(() => setShowYoutubeConnectedToast(false), 4000);
            return () => clearTimeout(t);
        }
        if (params.get('google') === 'connected') {
            setShowGoogleConnectedToast(true);
            fetchIntegrations();
            const t = setTimeout(() => setShowGoogleConnectedToast(false), 4000);
            return () => clearTimeout(t);
        }
        return undefined;
    }, [location.search]);

    const fetchIntegrations = async () => {
        try {
            const res = await api.get('/integrations');
            setIntegrations(res.data || []);
        } catch (err) { console.error('Error fetching integrations:', err); }
        finally { setLoading(false); }
    };

    const startGoogleOAuth = async () => {
        setGoogleRedirecting(true);
        try {
            const res = await api.get('/oauth/google/start', { params: { services: 'youtube,gmail,sheets' } });
            const { url } = res.data || {};
            if (!url) throw new Error('Missing OAuth URL');
            window.location.href = url;
        } catch (err) { console.error('Failed to start Google OAuth:', err); setGoogleRedirecting(false); }
    };

    const handleConnectClick = (appId) => {
        if (['google', 'gmail', 'google_sheets', 'youtube', 'google_drive', 'google_calendar'].includes(appId)) {
            startGoogleOAuth();
            return;
        }
        setSelectedApp(appId);
        setShowModal(true);
        setToken('');
    };

    const handleConnectSubmit = async (e) => {
        e.preventDefault();
        if (!selectedApp) return;
        setConnecting(true);
        try {
            const config = APP_CONFIG[selectedApp];
            const credentialKey = config?.credentialKey || 'token';
            const res = await api.post('/integrations/connect', {
                platform: selectedApp,
                credentials: { [credentialKey]: token.trim() }
            });
            setIntegrations((prev) => [...prev.filter((i) => i.platform !== selectedApp), res.data]);
            setShowModal(false);
        } catch (err) {
            console.error('Error connecting app:', err);
            alert(err.response?.data?.msg || 'Failed to connect app. Please check your token and try again.');
        } finally { setConnecting(false); }
    };

    const isConnected = (platform) => {
        if (platform === 'youtube') {
            return integrations.some((i) => i.platform === 'youtube' && i.isConnected) ||
                integrations.some((i) => i.platform === 'google' && i.isConnected && (i.connected_services || []).includes('youtube'));
        }
        if (platform === 'gmail') return integrations.some((i) => i.platform === 'google' && i.isConnected && (i.connected_services || []).includes('gmail'));
        if (platform === 'google_sheets' || platform === 'sheets') return integrations.some((i) => i.platform === 'google' && i.isConnected && (i.connected_services || []).includes('sheets'));
        return integrations.some((i) => i.platform === platform && i.isConnected);
    };

    const getIntegration = (platform) => integrations.find((i) => i.platform === platform);

    const getGoogleConnectedServices = () => {
        const googleInt = getIntegration('google');
        if (googleInt?.isConnected && Array.isArray(googleInt.connected_services)) return googleInt.connected_services;
        if (isConnected('youtube')) return ['youtube'];
        return [];
    };
    const googleConnectedServices = getGoogleConnectedServices();
    const isGoogleConnected = googleConnectedServices.length > 0;

    const handleDisconnect = async (platform) => {
        setDisconnectingId(platform);
        try {
            if (['google', 'gmail', 'google_sheets', 'youtube'].includes(platform)) {
                const hasUnifiedGoogle = integrations.some(i => i.platform === 'google' && i.isConnected);
                if (hasUnifiedGoogle) {
                    await api.post('/oauth/google/disconnect');
                } else if (platform === 'youtube' || platform === 'google') {
                    const hasLegacy = integrations.some(i => i.platform === 'youtube' && i.isConnected);
                    if (hasLegacy) await api.post('/oauth/google/youtube/disconnect');
                    else await api.post('/integrations/disconnect', { platform });
                } else {
                    await api.post('/integrations/disconnect', { platform });
                }
            } else {
                await api.post('/integrations/disconnect', { platform });
            }
            const res = await api.get('/integrations');
            setIntegrations(res.data || []);
        } catch (err) {
            console.error('Error disconnecting:', err);
            alert(err.response?.data?.msg || 'Failed to disconnect. Please try again.');
            fetchIntegrations();
        } finally { setDisconnectingId(null); }
    };

    const connectedCount = integrations.filter(i => i.isConnected).length;

    return (
        <div className="animate-fade-in">
            {/* Toast */}
            <AnimatePresence>
                {(showYoutubeConnectedToast || showGoogleConnectedToast) && (
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
                        <CheckCircle size={16} />
                        {showGoogleConnectedToast
                            ? 'Google Account connected. YouTube, Gmail & Sheets are now available for automations.'
                            : 'YouTube Connected. Your channel is now available for automations.'}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-main font-display tracking-tight mb-0.5">
                        Integrations Hub 🔗
                    </h1>
                    <p className="text-secondary text-[11px] sm:text-xs">Connect your apps. Each integration powers your automations.</p>
                </div>
                {connectedCount > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0" style={{
                        background: 'rgba(16, 185, 129, 0.06)',
                        border: '1px solid rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                    }}>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {connectedCount} App{connectedCount !== 1 ? 's' : ''} Connected
                    </div>
                )}
            </motion.div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                            <LinkIcon size={18} className="absolute inset-0 m-auto text-blue-500" />
                        </div>
                        <p className="text-secondary text-sm font-medium">Loading connected apps…</p>
                    </div>
                </div>
            ) : (
                <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
                    {APP_CATEGORIES.map((cat) => (
                        <motion.section key={cat.id} variants={riseUp}>
                            <h2 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                                {cat.label}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {cat.apps.map((appId) => {
                                    const config = APP_CONFIG[appId];
                                    const icon = APP_ICONS[appId];
                                    const isGoogleCard = appId === 'google';
                                    const connected = isGoogleCard ? isGoogleConnected : isConnected(appId);
                                    const integration = getIntegration(appId);
                                    const googleInt = getIntegration('google');
                                    if (!config) return null;

                                    return (
                                        <div
                                            key={appId}
                                            className="group rounded-2xl border p-5 flex flex-col items-center text-center transition-all duration-500 overflow-hidden relative"
                                            style={{
                                                background: 'var(--glass-bg)',
                                                borderColor: connected ? 'rgba(16, 185, 129, 0.25)' : 'var(--color-border)',
                                                backdropFilter: 'blur(12px)',
                                                WebkitBackdropFilter: 'blur(12px)',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = connected
                                                    ? '0 8px 30px rgba(16, 185, 129, 0.1)'
                                                    : 'var(--shadow-lg)';
                                                if (!connected) e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                                if (!connected) e.currentTarget.style.borderColor = 'var(--color-border)';
                                            }}
                                        >
                                            {/* Status indicator */}
                                            {connected && (
                                                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                                                    <div className="w-full h-full rounded-full bg-emerald-500 animate-ping opacity-50" />
                                                </div>
                                            )}

                                            <div className="w-14 h-14 mb-3 rounded-xl p-2.5 flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105" style={{
                                                background: 'var(--color-surface)',
                                                border: '1px solid var(--color-border)',
                                            }}>
                                                {icon ? <img src={icon} alt="" className="w-9 h-9 object-contain" style={{ filter: (document.documentElement.classList.contains('dark') && ['twitter', 'tiktok', 'notion', 'zoho', 'freshdesk', 'intercom', 'google_drive'].includes(appId)) ? 'invert(1)' : 'none' }} /> : <span className="text-secondary font-bold text-lg">{config.name[0]}</span>}
                                            </div>

                                            <h3 className="font-bold text-main text-[15px] mb-0.5">{config.name}</h3>

                                            {isGoogleCard ? (
                                                <>
                                                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Connected services</p>
                                                    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                                                        {GOOGLE_SERVICES.map((s) => {
                                                            const enabled = googleConnectedServices.includes(s.id);
                                                            return (
                                                                <span key={s.id} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider" style={{
                                                                    background: enabled ? 'rgba(16, 185, 129, 0.08)' : 'var(--color-surface)',
                                                                    color: enabled ? '#10b981' : 'var(--color-text-secondary)',
                                                                    border: `1px solid ${enabled ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-border)'}`,
                                                                }}>
                                                                    {s.label}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                    {!connected && (
                                                        <p className="text-[11px] text-amber-500 mb-2 font-medium">Enable to use YouTube, Gmail & Sheets automations.</p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{
                                                    color: connected ? '#10b981' : 'var(--color-text-secondary)',
                                                }}>
                                                    {connected && appId === 'youtube' && (integration?.youtube_channel_title || googleInt?.youtube_channel_title)
                                                        ? `Connected: ${integration?.youtube_channel_title || googleInt?.youtube_channel_title}`
                                                        : connected ? 'Connected' : 'Not Connected'}
                                                </p>
                                            )}

                                            {connected ? (
                                                <div className="w-full flex gap-2">
                                                    <button
                                                        type="button" onClick={() => handleConnectClick(appId)}
                                                        className="flex-1 btn btn-secondary text-xs py-2"
                                                        disabled={googleRedirecting}
                                                    >
                                                        <RefreshCw size={12} /> Reconnect
                                                    </button>
                                                    <button
                                                        type="button" onClick={() => handleDisconnect(appId)}
                                                        disabled={disconnectingId === appId}
                                                        className="flex-1 btn btn-secondary text-xs py-2 transition-colors duration-300"
                                                        style={{ color: '#ef4444' }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                                                    >
                                                        {disconnectingId === appId ? <Loader2 size={12} className="animate-spin mx-auto" /> : <><Unplug size={12} /> Disconnect</>}
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button" onClick={() => handleConnectClick(appId)}
                                                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer"
                                                    disabled={googleRedirecting}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                                        color: '#fff',
                                                        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 130, 246, 0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                                >
                                                    <Plus size={14} />
                                                    {isGoogleCard ? 'Connect Google Account' : `Connect ${config.name}`}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.section>
                    ))}
                </motion.div>
            )}

            {/* Connect Modal */}
            <AnimatePresence>
                {showModal && selectedApp && (() => {
                    const config = APP_CONFIG[selectedApp];
                    const icon = APP_ICONS[selectedApp];
                    return (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full max-w-md rounded-2xl overflow-hidden"
                                style={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    boxShadow: 'var(--shadow-lg)',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl p-2 flex items-center justify-center shrink-0" style={{
                                                background: 'var(--color-surface-hover)',
                                                border: '1px solid var(--color-border)',
                                            }}>
                                                {icon ? <img src={icon} alt="" className="w-8 h-8 object-contain" /> : <span className="text-secondary font-bold text-lg">{config?.name[0]}</span>}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-main font-display">Connect {config?.name}</h2>
                                                <p className="text-xs text-secondary">Enter your credentials to link your account.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowModal(false)} className="p-2 rounded-lg cursor-pointer transition-colors" style={{ color: 'var(--color-text-secondary)' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleConnectSubmit} className="space-y-4">
                                        <div>
                                            <label className="label text-[10px] uppercase tracking-widest font-bold">{config?.placeholder}</label>
                                            <input
                                                type="text" className="input" required
                                                placeholder={selectedApp === 'telegram' ? '8252223104:AAGHV...' : 'Paste your key or token'}
                                                value={token} onChange={(e) => setToken(e.target.value)}
                                            />
                                            {config?.hint && <p className="text-[10px] text-secondary font-medium mt-2">{config.hint}</p>}
                                            {selectedApp === 'telegram' && (
                                                <p className="text-[10px] text-secondary font-medium mt-1">
                                                    Get your token from <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-bold">@BotFather</a> on Telegram.
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1 py-2.5 text-sm" disabled={connecting}>Cancel</button>
                                            <button type="submit" className="btn btn-primary flex-1 py-2.5 text-sm" disabled={connecting}>
                                                {connecting ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Connect'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
};

export default ConnectedApps;
