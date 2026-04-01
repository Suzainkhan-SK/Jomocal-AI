import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    Settings,
    Play,
    Pause,
    Zap,
    Info,
    X,
    ExternalLink,
    RefreshCw,
    Clock,
    Mail,
    Send,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import { DEFAULT_AUTOMATION_META, YOUTUBE_CONTENT_TYPES } from '../data/automationCatalog';
import api from '../utils/api';
import LeadHunterSetup from './LeadHunterSetup';

/* ─── Color map ─── */
const COLOR_CLASSES = {
    blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    violet:  'bg-violet-500/10 text-violet-400 border-violet-500/20',
    amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
    slate:   'bg-surface text-secondary border-main',
    indigo:  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    teal:    'bg-teal-500/10 text-teal-400 border-teal-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red:     'bg-red-500/10 text-red-400 border-red-500/20',
};

/* ─── Icon glow map (matches COLOR_CLASSES keys) ─── */
const GLOW_CLASSES = {
    blue:    'group-hover:shadow-blue-500/20',
    green:   'group-hover:shadow-emerald-500/20',
    violet:  'group-hover:shadow-violet-500/20',
    amber:   'group-hover:shadow-amber-500/20',
    slate:   '',
    indigo:  'group-hover:shadow-indigo-500/20',
    teal:    'group-hover:shadow-teal-500/20',
    emerald: 'group-hover:shadow-emerald-500/20',
    red:     'group-hover:shadow-red-500/20',
};

const TONE_OPTIONS = [
    { value: '', label: 'Select tone (optional)' },
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
];

const VOICE_STYLE_OPTIONS = [
    { value: '', label: 'Default (optional)' },
    { value: 'warm', label: 'Warm & Calm' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'neutral', label: 'Neutral' },
];

const VIDEO_LENGTH_OPTIONS = [
    { value: '', label: 'Default (optional)' },
    { value: '30', label: '30 seconds' },
    { value: '60', label: '60 seconds' },
    { value: '90', label: '90 seconds' },
];

/* ═══════════════════════════════════════════════════
   PORTAL MODAL — centered on desktop / bottom-sheet
   on mobile. Uses createPortal to escape any parent
   stacking-context / overflow / transform.
═══════════════════════════════════════════════════ */
function ModalDrawer({ open, onClose, title, subtitle, icon: Icon, colorClass, footer, children }) {
    const [mounted, setMounted]   = useState(false);
    const [visible, setVisible]   = useState(false);

    /* Mount → next-tick show (drives the CSS transition) */
    useEffect(() => {
        let raf;
        if (open) {
            setMounted(true);
            raf = requestAnimationFrame(() => setVisible(true));
            document.body.style.overflow = 'hidden';
        } else {
            setVisible(false);
            const t = setTimeout(() => {
                setMounted(false);
                document.body.style.overflow = '';
            }, 320);
            return () => clearTimeout(t);
        }
        return () => cancelAnimationFrame(raf);
    }, [open]);

    /* Escape key */
    useEffect(() => {
        if (!open) return;
        const h = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [open, onClose]);

    if (!mounted) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-[1000] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
            aria-modal="true"
            role="dialog"
            aria-label={title}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel container — bottom on mobile, centered on sm+ */}
            <div className="absolute inset-0 flex items-end sm:items-center justify-center pointer-events-none sm:p-4">
                <div
                    className={`
                        relative pointer-events-auto
                        bg-surface border border-main shadow-2xl
                        flex flex-col
                        w-full sm:max-w-lg
                        rounded-t-3xl sm:rounded-2xl
                        max-h-[92vh] sm:max-h-[85vh]
                        transition-all duration-300 ease-out
                        ${visible
                            ? 'translate-y-0 opacity-100 sm:scale-100'
                            : 'translate-y-6 opacity-0 sm:scale-95 sm:translate-y-0'
                        }
                    `}
                    style={{ willChange: 'transform, opacity' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Mobile drag handle */}
                    <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
                        <div className="w-10 h-1 rounded-full bg-main/20" />
                    </div>

                    {/* ── Sticky Header ── */}
                    <div className="sticky top-0 z-10 bg-surface border-b border-main px-5 py-4 flex items-center gap-3 shrink-0 rounded-t-3xl sm:rounded-t-2xl">
                        {Icon && (
                            <div className={`p-2 rounded-xl shrink-0 border ${colorClass}`}>
                                <Icon size={17} />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-main text-base leading-tight">{title}</h2>
                            {subtitle && (
                                <p className="text-xs text-secondary mt-0.5 line-clamp-1">{subtitle}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-xl text-secondary hover:bg-body hover:text-main transition-colors shrink-0 ml-1"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* ── Scrollable Body ── */}
                    <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                        {children}
                    </div>

                    {/* ── Sticky Footer ── */}
                    {footer && (
                        <div className="sticky bottom-0 z-10 bg-surface border-t border-main px-5 py-4 shrink-0">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ═══════════════════════════════════════════════════
   AUTOMATION CARD
═══════════════════════════════════════════════════ */
function AutomationCard({
    item,
    IconComponent,
    userAutomation,
    onToggle,
    onConfigure,
    onSaveConfig,
    toggleLoading,
    onRun,
    onRetry,
    runLoading,
    youtubeConnected,
    lastRunStatus,
    runSuccessMessage,
    runError,
    onDismissRunMessage,
    onDismissRunError,
    onToggleEmail,
}) {
    const [configOpen,      setConfigOpen]      = useState(false);
    const [detailsOpen,     setDetailsOpen]     = useState(false);
    const [tone,            setTone]            = useState(userAutomation?.config?.tone ?? '');
    const [customNotes,     setCustomNotes]     = useState(userAutomation?.config?.customNotes ?? '');
    const [contentType,     setContentType]     = useState(userAutomation?.config?.contentType ?? '');
    const [voiceStyle,      setVoiceStyle]      = useState(userAutomation?.config?.voiceStyle ?? '');
    const [videoLength,     setVideoLength]     = useState(userAutomation?.config?.videoLength ?? '');
    const [botPersonality,  setBotPersonality]  = useState(userAutomation?.botPersonality ?? 'Professional and helpful');
    const [botWelcomeMessage, setBotWelcomeMessage] = useState(userAutomation?.botWelcomeMessage ?? 'Hello! How can I help you?');
    const [manualText,      setManualText]      = useState('');
    const [pdfFile,         setPdfFile]         = useState(null);
    const [configSaving,    setConfigSaving]    = useState(false);
    const [configError,     setConfigError]     = useState('');
    const [configSuccess,   setConfigSuccess]   = useState('');
    const [activePlatform,  setActivePlatform]  = useState('telegram');
    const [leadHunterConfig, setLeadHunterConfig] = useState(userAutomation?.config || {});

    const isYoutubeAutomation    = userAutomation?.type?.startsWith('youtube_');
    const isLeadHunterAutomation = userAutomation?.type === 'lead_hunter' || item?.type === 'lead_hunter';

    /* Sync config state when userAutomation changes */
    useEffect(() => {
        setTone(userAutomation?.config?.tone ?? '');
        setCustomNotes(userAutomation?.config?.customNotes ?? '');
        setContentType(userAutomation?.config?.contentType ?? '');
        setVoiceStyle(userAutomation?.config?.voiceStyle ?? '');
        setVideoLength(userAutomation?.config?.videoLength ?? '');
        setBotPersonality(userAutomation?.botPersonality ?? 'Professional and helpful');
        setBotWelcomeMessage(userAutomation?.botWelcomeMessage ?? 'Hello! How can I help you?');
        setLeadHunterConfig(userAutomation?.config || {});
    }, [
        userAutomation?._id,
        userAutomation?.config?.tone,
        userAutomation?.config?.customNotes,
        userAutomation?.config?.contentType,
        userAutomation?.config?.voiceStyle,
        userAutomation?.config?.videoLength,
        userAutomation?.config,
        userAutomation?.botPersonality,
        userAutomation?.botWelcomeMessage,
    ]);

    /* Derived state */
    const isActive   = userAutomation?.status === 'active';
    const isPaused   = userAutomation?.status === 'paused';
    const isInactive = userAutomation && !isActive && !isPaused;
    const canToggle  = !!userAutomation;
    const isTelegramAutomation = userAutomation?.type === 'auto_reply';

    const colorClass = COLOR_CLASSES[item.color] || COLOR_CLASSES.blue;
    const glowClass  = GLOW_CLASSES[item.color]  || '';

    const pricing            = item.pricing            ?? DEFAULT_AUTOMATION_META.pricing;
    const howItWorks         = item.howItWorks         ?? item.useCase ?? '';
    const tutorialUrl        = item.tutorialUrl        ?? DEFAULT_AUTOMATION_META.tutorialUrl;
    const permissionsRequired = item.permissionsRequired;
    const howToUse           = item.howToUse;

    const canRunYoutube = youtubeConnected && [
        'islamic_stories_hindi',
        'scifi_future_worlds_hindi',
        'scifi_future_worlds_english',
        'mythical_creatures',
    ].includes(contentType);

    const showRetryButton = isYoutubeAutomation && lastRunStatus === 'failed';

    /* ── Save config handler ── */
    const handleSaveConfig = useCallback(async () => {
        /* Lead Hunter */
        if (isLeadHunterAutomation) {
            const payload = { automationId: item.id, userAutomationId: userAutomation?._id, ...leadHunterConfig };
            setConfigSaving(true);
            Promise.resolve(onSaveConfig?.(item, payload)).finally(() => {
                setConfigSaving(false);
                setConfigOpen(false);
            });
            return;
        }

        /* YouTube validation */
        if (isYoutubeAutomation && !contentType) {
            setConfigError('Please select a content type.');
            return;
        }

        const isAiBot =
            ['dm-response-systems', 'customer-inquiry-management', 'ai-enterprise-support'].includes(item.id) ||
            userAutomation?.type === 'auto_reply';

        /* AI Bot Brain */
        if (isAiBot) {
            setConfigSaving(true);
            setConfigError('');
            setConfigSuccess('');
            try {
                const formData = new FormData();
                formData.append('personality', botPersonality);
                formData.append('welcomeMessage', botWelcomeMessage);
                if (pdfFile) formData.append('pdfFile', pdfFile);
                if (manualText) formData.append('manualText', manualText);

                const res = await api.post('/automations/config', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (onSaveConfig) {
                    onSaveConfig(item, { ...res.data.automation, userAutomationId: userAutomation?._id });
                }
                setConfigSuccess('AI Brain Updated ✓');
                setManualText('');
                setPdfFile(null);
                setTimeout(() => setConfigOpen(false), 1500);
            } catch (err) {
                setConfigError(err.response?.data?.msg || 'Failed to update AI Brain');
            } finally {
                setConfigSaving(false);
            }
            return;
        }

        /* Generic */
        setConfigError('');
        setConfigSaving(true);
        const payload = {
            automationId: item.id,
            userAutomationId: userAutomation?._id,
            tone:        isYoutubeAutomation ? undefined : (tone || undefined),
            customNotes: isYoutubeAutomation ? undefined : (customNotes.trim() || undefined),
            contentType: isYoutubeAutomation ? contentType : undefined,
            voiceStyle:  isYoutubeAutomation ? (voiceStyle || undefined) : undefined,
            videoLength: isYoutubeAutomation ? (videoLength || undefined) : undefined,
        };
        Promise.resolve(onSaveConfig?.(item, payload)).finally(() => {
            setConfigSaving(false);
            setConfigOpen(false);
        });
    }, [
        item, userAutomation?._id, userAutomation?.type,
        tone, customNotes, contentType, voiceStyle, videoLength,
        botPersonality, botWelcomeMessage, pdfFile, manualText,
        isYoutubeAutomation, isLeadHunterAutomation, leadHunterConfig, onSaveConfig,
    ]);

    /* ── Config panel body ── */
    const renderConfigPanel = () => {
        if (isLeadHunterAutomation) {
            return <LeadHunterSetup userAutomation={userAutomation} onConfigChange={setLeadHunterConfig} />;
        }

        if (isYoutubeAutomation) {
            return (
                <div className="space-y-4">
                    <p className="text-xs font-medium text-secondary">Configure your YouTube automation settings below.</p>
                    <div>
                        <label className="block text-xs font-semibold text-main mb-1.5">
                            Content type <span className="text-red-400">*</span>
                        </label>
                        <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="input text-sm py-2.5 w-full" required>
                            <option value="">Select content type (required)</option>
                            {YOUTUBE_CONTENT_TYPES.map((opt) => (
                                <option key={opt.value} value={opt.value} disabled={!opt.available}>
                                    {opt.label}{!opt.available ? ' (Coming soon)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-secondary mb-1.5">Voice style (optional)</label>
                        <select value={voiceStyle} onChange={(e) => setVoiceStyle(e.target.value)} className="input text-sm py-2.5 w-full">
                            {VOICE_STYLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-secondary mb-1.5">Video length (optional)</label>
                        <select value={videoLength} onChange={(e) => setVideoLength(e.target.value)} className="input text-sm py-2.5 w-full">
                            {VIDEO_LENGTH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-secondary mb-1.5">Posting schedule (optional)</label>
                        <select className="input text-sm py-2.5 w-full opacity-50 cursor-not-allowed" disabled><option>Coming soon</option></select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-secondary mb-1.5">Custom hashtags (optional)</label>
                        <input type="text" placeholder="Coming soon" className="input text-sm py-2.5 w-full opacity-50 cursor-not-allowed" disabled />
                    </div>
                    {configError && (
                        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                            <AlertCircle size={13} className="shrink-0" />{configError}
                        </div>
                    )}
                </div>
            );
        }

        const isAiBot =
            ['dm-response-systems', 'customer-inquiry-management', 'ai-enterprise-support'].includes(item.id) ||
            userAutomation?.type === 'auto_reply';

        if (isAiBot) {
            return (
                <div className="space-y-4">
                    <div className="pb-3 border-b border-main">
                        <h4 className="text-sm font-bold text-main">AI Bot Brain</h4>
                        <p className="text-[11px] text-secondary mt-0.5">Train your bot with your business knowledge.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-main mb-1.5">Personality</label>
                        <select value={botPersonality} onChange={(e) => setBotPersonality(e.target.value)} className="input text-sm py-2.5 w-full">
                            <option value="Professional and helpful">Professional and helpful</option>
                            <option value="Friendly and warm">Friendly and warm</option>
                            <option value="Humorous and witty">Humorous and witty</option>
                            <option value="Direct and efficient">Direct and efficient</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-main mb-1.5">Welcome Message</label>
                        <input
                            type="text"
                            value={botWelcomeMessage}
                            onChange={(e) => setBotWelcomeMessage(e.target.value)}
                            placeholder="e.g. Hello! How can I help you?"
                            className="input text-sm py-2.5 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-main mb-2">Knowledge Base</label>
                        <div className="space-y-3 p-3.5 rounded-xl bg-body border border-main">
                            <div>
                                <span className="block text-[11px] font-semibold text-secondary mb-1.5">A — Upload Business Document (PDF)</span>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setPdfFile(e.target.files[0])}
                                    className="block w-full text-[11px] text-secondary
                                        file:mr-2 file:py-1.5 file:px-3
                                        file:rounded-lg file:border-0
                                        file:text-[11px] file:font-semibold
                                        file:bg-blue-500/10 file:text-blue-400
                                        hover:file:bg-blue-500/20 transition-colors"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-main" /></div>
                                <div className="relative flex justify-center">
                                    <span className="bg-body px-2 text-[10px] text-secondary">OR</span>
                                </div>
                            </div>
                            <div>
                                <span className="block text-[11px] font-semibold text-secondary mb-1.5">B — Paste product or FAQ text</span>
                                <textarea
                                    value={manualText}
                                    onChange={(e) => setManualText(e.target.value)}
                                    placeholder="Paste details about your products, services, or FAQs here..."
                                    rows={4}
                                    className="input text-[11px] py-2 resize-none w-full"
                                />
                            </div>
                        </div>
                    </div>
                    {userAutomation?.knowledgeBaseText && (
                        <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                            <CheckCircle2 size={13} className="shrink-0" />
                            Knowledge base has {userAutomation.knowledgeBaseText.length} characters saved.
                        </div>
                    )}
                    {activePlatform === 'gmail' && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div className="flex items-center gap-2 text-amber-400 mb-1">
                                <Info size={13} /><span className="text-xs font-semibold">Important</span>
                            </div>
                            <p className="text-[11px] text-amber-300 leading-relaxed">
                                This bot replies to <strong>ALL unread emails</strong>. Use a dedicated support inbox.
                            </p>
                        </div>
                    )}
                    {configError && (
                        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                            <AlertCircle size={13} className="shrink-0" />{configError}
                        </div>
                    )}
                    {configSuccess && (
                        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5">
                            <CheckCircle2 size={13} className="shrink-0" />{configSuccess}
                        </div>
                    )}
                </div>
            );
        }

        /* Generic config */
        return (
            <div className="space-y-4">
                <p className="text-xs text-secondary">Optional — customise how this automation runs for your business.</p>
                <div>
                    <label className="block text-xs font-semibold text-main mb-1.5">Tone</label>
                    <select value={tone} onChange={(e) => setTone(e.target.value)} className="input text-sm py-2.5 w-full">
                        {TONE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-main mb-1.5">Preferences / Notes</label>
                    <textarea
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        placeholder="e.g. keywords, brand voice, avoid topics..."
                        rows={3}
                        className="input text-sm py-2.5 resize-none w-full"
                    />
                </div>
                {item.configSummary && (
                    <p className="text-xs text-secondary pt-3 border-t border-main">{item.configSummary}</p>
                )}
            </div>
        );
    };

    /* ── Details panel body ── */
    const renderDetailsContent = () => {
        const isYoutube = item.type === 'youtube_video_automation';
        return (
            <div className="space-y-5 text-sm">
                <div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">How it works</span>
                    <p className="text-secondary leading-relaxed mt-1.5">{howItWorks}</p>
                </div>
                {isYoutube && (
                    <>
                        <div>
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">How to use</span>
                            <p className="text-secondary leading-relaxed mt-1.5">{howToUse || item.configSummary}</p>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Permissions</span>
                            <p className="text-secondary leading-relaxed mt-1.5">{permissionsRequired || 'YouTube channel with upload permission.'}</p>
                        </div>
                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <Clock size={16} className="shrink-0 text-amber-400 mt-0.5" />
                            <p className="text-secondary text-xs leading-relaxed">
                                Each run completes in <strong className="text-main">30–60 minutes</strong>. Your video is generated and auto-uploaded to YouTube.
                            </p>
                        </div>
                    </>
                )}
                <div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Pricing</span>
                    <p className="text-main font-semibold mt-1.5">{pricing}</p>
                </div>
                {item.configSummary && !isYoutube && (
                    <div>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Setup</span>
                        <p className="text-secondary mt-1.5">{item.configSummary}</p>
                    </div>
                )}
            </div>
        );
    };

    /* ── Status badge ── */
    const statusLabel = isTelegramAutomation
        ? (isActive ? 'Bot Active' : isPaused ? 'Bot Paused' : isInactive ? 'Inactive' : 'Available')
        : (isActive ? 'Active' : isPaused ? 'Paused' : isInactive ? 'Inactive' : 'Available');

    const statusClass = isActive
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : isPaused
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            : 'bg-body text-secondary border-main';

    /* ─────────────────────────────────── RENDER ── */
    return (
        <>
            {/* ══ Card ══ */}
            <article className="
                group relative
                bg-card rounded-2xl border border-main
                p-4 sm:p-5
                flex flex-col gap-3
                hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5
                transition-all duration-300
                overflow-hidden
                cursor-default
            ">
                {/* Animated gradient top-edge on hover */}
                <div
                    className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl
                        bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-500"
                />

                {/* ── Header: icon + name + description ── */}
                <div className="flex items-start gap-3">
                    <div className={`
                        p-2.5 rounded-xl shrink-0 border ${colorClass}
                        transition-all duration-300
                        group-hover:scale-110 group-hover:shadow-lg ${glowClass}
                    `}>
                        {IconComponent ? <IconComponent size={20} /> : <Zap size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-[15px] font-bold text-main leading-snug line-clamp-2 break-words">
                            {item.name}
                        </h3>
                        {item.description && (
                            <p className="text-[12px] text-secondary mt-1 leading-relaxed line-clamp-2 break-words">
                                {item.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Status badges ── */}
                <div className="flex flex-wrap gap-1.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusClass}`}>
                        {statusLabel}
                    </span>
                    {userAutomation?.type === 'auto_reply' && (
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            userAutomation.emailAutomationStatus === 'active'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : 'bg-body text-secondary border-main'
                        }`}>
                            {userAutomation.emailAutomationStatus === 'active' ? 'Gmail Active' : 'Gmail Inactive'}
                        </span>
                    )}
                </div>

                {/* ── Platform switcher (Telegram / Gmail) ── */}
                {userAutomation?.type === 'auto_reply' && (
                    <div className="flex items-center gap-1 p-1 bg-body rounded-xl border border-main w-fit">
                        <button
                            onClick={() => setActivePlatform('telegram')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                ${activePlatform === 'telegram'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'text-secondary hover:text-main hover:bg-surface'}`}
                        >
                            <Send size={13} /> Telegram
                        </button>
                        <button
                            onClick={() => setActivePlatform('gmail')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                ${activePlatform === 'gmail'
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                    : 'text-secondary hover:text-main hover:bg-surface'}`}
                        >
                            <Mail size={13} /> Gmail
                        </button>
                    </div>
                )}

                {/* ── Run success ── */}
                {(isYoutubeAutomation || isLeadHunterAutomation) && runSuccessMessage && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Clock size={14} className="shrink-0 text-emerald-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-emerald-400">{runSuccessMessage}</p>
                            <button type="button" onClick={onDismissRunMessage}
                                className="text-[11px] text-emerald-500 hover:text-emerald-300 mt-1 transition-colors">
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Run error ── */}
                {(isYoutubeAutomation || isLeadHunterAutomation) && runError && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle size={14} className="shrink-0 text-red-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-red-400">{runError}</p>
                            <button type="button" onClick={onDismissRunError}
                                className="text-[11px] text-red-500 hover:text-red-300 mt-1 transition-colors">
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Action buttons ── */}
                <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-main mt-auto">
                    {/* Configure */}
                    <button
                        type="button"
                        id={`configure-${item.id}`}
                        onClick={() => setConfigOpen(true)}
                        className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-main
                            py-2 px-3 rounded-xl hover:bg-surface
                            transition-all duration-200 hover:scale-[1.02]"
                    >
                        <Settings size={15} className="transition-transform duration-300 group-hover:rotate-45" />
                        Configure
                    </button>

                    {/* Details */}
                    <button
                        type="button"
                        id={`details-${item.id}`}
                        onClick={() => setDetailsOpen(true)}
                        className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-main
                            py-2 px-3 rounded-xl hover:bg-surface
                            transition-all duration-200 hover:scale-[1.02]"
                    >
                        <Info size={15} /> Details
                    </button>

                    {/* Run / Retry */}
                    {(isYoutubeAutomation || isLeadHunterAutomation) && userAutomation && (
                        <>
                            {showRetryButton && (
                                <button
                                    type="button"
                                    onClick={() => onRetry?.(userAutomation)}
                                    disabled={runLoading || !youtubeConnected}
                                    className="btn btn-outline text-sm py-2 px-4 gap-1.5
                                        text-amber-400 border-amber-500/30 hover:bg-amber-500/10
                                        disabled:opacity-50 transition-all duration-200"
                                >
                                    <RefreshCw size={14} className={runLoading ? 'animate-spin' : ''} />
                                    {runLoading ? 'Retrying…' : 'Retry'}
                                </button>
                            )}
                            <button
                                type="button"
                                id={`run-${item.id}`}
                                onClick={() => onRun?.(userAutomation, isLeadHunterAutomation ? leadHunterConfig : undefined)}
                                disabled={
                                    runLoading ||
                                    (isYoutubeAutomation && !canRunYoutube) ||
                                    (isLeadHunterAutomation && !userAutomation?.config?.targetNiche)
                                }
                                title={
                                    isYoutubeAutomation
                                        ? (!contentType ? 'Select a content type in Configure' :
                                            !canRunYoutube ? 'This content type is coming soon' :
                                            !youtubeConnected ? 'Connect YouTube first' : '')
                                        : (!userAutomation?.config?.targetNiche ? 'Save Lead Hunter config first' : '')
                                }
                                className="btn btn-primary text-sm py-2 px-4 gap-1.5
                                    transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                {runLoading ? 'Running…' : <><Play size={15} /> Run now</>}
                            </button>
                        </>
                    )}

                    {/* Toggle / Get started */}
                    {canToggle ? (
                        activePlatform === 'telegram' ? (
                            isActive ? (
                                <button
                                    id={`pause-${item.id}`}
                                    onClick={() => onToggle?.(userAutomation._id, userAutomation.status, userAutomation.type)}
                                    disabled={toggleLoading}
                                    className="btn btn-secondary text-sm py-2 px-4 gap-1.5
                                        hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30
                                        transition-all duration-200 disabled:opacity-60"
                                >
                                    {toggleLoading ? '…' : <><Pause size={15} /> Pause</>}
                                </button>
                            ) : (
                                <button
                                    id={`activate-${item.id}`}
                                    onClick={() => onToggle?.(userAutomation._id, userAutomation.status, userAutomation.type)}
                                    disabled={toggleLoading}
                                    className="btn btn-secondary text-sm py-2 px-4 gap-1.5
                                        transition-all duration-200 disabled:opacity-60"
                                >
                                    {toggleLoading ? '…' : <><Play size={15} /> Activate Telegram</>}
                                </button>
                            )
                        ) : (
                            userAutomation.emailAutomationStatus === 'active' ? (
                                <button
                                    id={`pause-gmail-${item.id}`}
                                    onClick={() => onToggleEmail?.(userAutomation._id, userAutomation.emailAutomationStatus)}
                                    disabled={toggleLoading}
                                    className="btn btn-secondary text-sm py-2 px-4 gap-1.5
                                        hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30
                                        transition-all duration-200 disabled:opacity-60"
                                >
                                    {toggleLoading ? '…' : <><Pause size={15} /> Pause Gmail</>}
                                </button>
                            ) : (
                                <button
                                    id={`activate-gmail-${item.id}`}
                                    onClick={() => onToggleEmail?.(userAutomation._id, userAutomation.emailAutomationStatus)}
                                    disabled={toggleLoading}
                                    className="btn btn-secondary text-sm py-2 px-4 gap-1.5
                                        transition-all duration-200 disabled:opacity-60"
                                >
                                    {toggleLoading ? '…' : <><Play size={15} /> Activate Gmail</>}
                                </button>
                            )
                        )
                    ) : (
                        <button
                            id={`get-started-${item.id}`}
                            onClick={() => onConfigure?.(item)}
                            className="ml-auto btn btn-primary text-sm py-2 px-4 gap-1.5
                                transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                        >
                            <ChevronRight size={15} /> Get started
                        </button>
                    )}
                </div>
            </article>

            {/* ══ Details Modal ══ */}
            <ModalDrawer
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                title={item.name}
                subtitle="Automation details"
                icon={IconComponent || Zap}
                colorClass={colorClass}
                footer={
                    tutorialUrl ? (
                        <a
                            href={tutorialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary w-full gap-2 text-sm py-3 flex items-center justify-center
                                transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                        >
                            <ExternalLink size={16} /> Watch Tutorial
                        </a>
                    ) : null
                }
            >
                {renderDetailsContent()}
            </ModalDrawer>

            {/* ══ Configure Modal ══ */}
            <ModalDrawer
                open={configOpen}
                onClose={() => setConfigOpen(false)}
                title="Configure"
                subtitle={item.name}
                icon={Settings}
                colorClass={colorClass}
                footer={
                    <button
                        id={`save-config-${item.id}`}
                        onClick={handleSaveConfig}
                        disabled={configSaving}
                        className="btn btn-primary w-full text-sm py-3 gap-2
                            transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]
                            disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {configSaving ? 'Saving…' : 'Save Settings'}
                    </button>
                }
            >
                {renderConfigPanel()}
            </ModalDrawer>
        </>
    );
}

export default React.memo(AutomationCard);
