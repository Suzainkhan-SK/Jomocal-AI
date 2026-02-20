import React, { useState, useEffect, useCallback } from 'react';
import {
    Settings,
    Play,
    Pause,
    Zap,
    Info,
    ChevronDown,
    X,
    ExternalLink,
    RefreshCw,
    Clock,
    Mail,
    Send,
} from 'lucide-react';
import { DEFAULT_AUTOMATION_META, YOUTUBE_CONTENT_TYPES } from '../data/automationCatalog';
import api from '../utils/api';

const COLOR_CLASSES = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    slate: 'bg-surface text-secondary border-main',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const TONE_OPTIONS = [
    { value: '', label: 'Select tone (optional)' },
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
];

// Placeholder options for YouTube optional config
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
    const [configOpen, setConfigOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [tone, setTone] = useState(userAutomation?.config?.tone ?? '');
    const [customNotes, setCustomNotes] = useState(userAutomation?.config?.customNotes ?? '');
    const [contentType, setContentType] = useState(userAutomation?.config?.contentType ?? '');
    const [voiceStyle, setVoiceStyle] = useState(userAutomation?.config?.voiceStyle ?? '');
    const [videoLength, setVideoLength] = useState(userAutomation?.config?.videoLength ?? '');
    const [botPersonality, setBotPersonality] = useState(userAutomation?.botPersonality ?? 'Professional and helpful');
    const [botWelcomeMessage, setBotWelcomeMessage] = useState(userAutomation?.botWelcomeMessage ?? 'Hello! How can I help you?');
    const [manualText, setManualText] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [configSaving, setConfigSaving] = useState(false);
    const [configError, setConfigError] = useState('');
    const [configSuccess, setConfigSuccess] = useState('');
    const [activePlatform, setActivePlatform] = useState('telegram'); // 'telegram' or 'gmail'


    const isYoutubeAutomation = userAutomation?.type?.startsWith('youtube_');

    useEffect(() => {
        setTone(userAutomation?.config?.tone ?? '');
        setCustomNotes(userAutomation?.config?.customNotes ?? '');
        setContentType(userAutomation?.config?.contentType ?? '');
        setVoiceStyle(userAutomation?.config?.voiceStyle ?? '');
        setVideoLength(userAutomation?.config?.videoLength ?? '');
        setBotPersonality(userAutomation?.botPersonality ?? 'Professional and helpful');
        setBotWelcomeMessage(userAutomation?.botWelcomeMessage ?? 'Hello! How can I help you?');
    }, [
        userAutomation?._id,
        userAutomation?.config?.tone,
        userAutomation?.config?.customNotes,
        userAutomation?.config?.contentType,
        userAutomation?.config?.voiceStyle,
        userAutomation?.config?.videoLength,
        userAutomation?.botPersonality,
        userAutomation?.botWelcomeMessage,
    ]);

    const isActive = userAutomation?.status === 'active';
    const isPaused = userAutomation?.status === 'paused';
    const isInactive = userAutomation && userAutomation.status !== 'active' && userAutomation.status !== 'paused';
    const canToggle = !!userAutomation;
    const colorClass = COLOR_CLASSES[item.color] || COLOR_CLASSES.blue;

    const pricing = item.pricing ?? DEFAULT_AUTOMATION_META.pricing;
    const howItWorks = item.howItWorks ?? item.useCase ?? '';
    const tutorialUrl = item.tutorialUrl ?? DEFAULT_AUTOMATION_META.tutorialUrl;
    const permissionsRequired = item.permissionsRequired;
    const howToUse = item.howToUse;

    const canRunYoutube = youtubeConnected && (contentType === 'islamic_stories_hindi' || contentType === 'scifi_future_worlds_hindi' || contentType === 'scifi_future_worlds_english' || contentType === 'mythical_creatures');
    const showRetryButton = isYoutubeAutomation && lastRunStatus === 'failed';

    const handleSaveConfig = useCallback(async () => {
        if (isYoutubeAutomation && !contentType) {
            setConfigError('Please select a content type.');
            return;
        }

        const isAiBot = item.id === 'dm-response-systems' ||
            item.id === 'customer-inquiry-management' ||
            item.id === 'ai-enterprise-support' ||
            userAutomation?.type === 'auto_reply';

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
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // Trigger parent update if needed, but we can also just show success 
                // and let the parent re-fetch or manual update.
                // For now, let's assume we want to update the local state of userAutomation in parent.
                if (onSaveConfig) {
                    // We just notify success and let fetchData handle it or pass back the new data
                    onSaveConfig(item, { ...res.data.automation, userAutomationId: userAutomation?._id });
                }

                setConfigSuccess('AI Brain Updated');
                setManualText('');
                setPdfFile(null);
                setTimeout(() => setConfigOpen(false), 1500);
            } catch (err) {
                console.error('Save error:', err);
                setConfigError(err.response?.data?.msg || 'Failed to update AI Brain');
            } finally {
                setConfigSaving(false);
            }
            return;
        }

        setConfigError('');
        setConfigSaving(true);
        const payload = {
            automationId: item.id,
            userAutomationId: userAutomation?._id,
            tone: isYoutubeAutomation ? undefined : (tone || undefined),
            customNotes: isYoutubeAutomation ? undefined : (customNotes.trim() || undefined),
            contentType: isYoutubeAutomation ? contentType : undefined,
            voiceStyle: isYoutubeAutomation ? (voiceStyle || undefined) : undefined,
            videoLength: isYoutubeAutomation ? (videoLength || undefined) : undefined,
        };
        Promise.resolve(onSaveConfig?.(item, payload)).finally(() => {
            setConfigSaving(false);
            setConfigOpen(false);
        });
    }, [item, userAutomation?._id, userAutomation?.type, tone, customNotes, contentType, voiceStyle, videoLength, botPersonality, botWelcomeMessage, pdfFile, manualText, isYoutubeAutomation, onSaveConfig]);

    // Click outside listener removed as we are moving to modal

    const renderConfigPanel = () => {
        if (isYoutubeAutomation) {
            return (
                <div className="space-y-3">
                    <p className="text-xs font-medium text-secondary">Configure your YouTube automation</p>
                    <div>
                        <label className="block text-xs font-medium text-main mb-1">
                            Content type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value)}
                            className="input text-sm py-2 w-full"
                            required
                        >
                            <option value="">Select content type (required)</option>
                            {YOUTUBE_CONTENT_TYPES.map((opt) => (
                                <option key={opt.value} value={opt.value} disabled={!opt.available}>
                                    {opt.label}{!opt.available ? ' (Coming soon)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-secondary mb-1">Voice style (optional)</label>
                        <select
                            value={voiceStyle}
                            onChange={(e) => setVoiceStyle(e.target.value)}
                            className="input text-sm py-2 w-full"
                        >
                            {VOICE_STYLE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-secondary mb-1">Video length (optional)</label>
                        <select
                            value={videoLength}
                            onChange={(e) => setVideoLength(e.target.value)}
                            className="input text-sm py-2 w-full"
                        >
                            {VIDEO_LENGTH_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-secondary mb-1">Posting schedule (optional)</label>
                        <select className="input text-sm py-2 w-full opacity-60 cursor-not-allowed" disabled>
                            <option>Coming soon</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-secondary mb-1">Custom hashtags (optional)</label>
                        <input
                            type="text"
                            placeholder="Coming soon"
                            className="input text-sm py-2 w-full opacity-60 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    {configError && (
                        <p className="text-xs text-red-600">{configError}</p>
                    )}
                </div>
            );
        }

        const isAiBot = item.id === 'dm-response-systems' ||
            item.id === 'customer-inquiry-management' ||
            item.id === 'ai-enterprise-support' ||
            userAutomation?.type === 'auto_reply';

        if (isAiBot) {
            return (
                <div className="space-y-4">
                    <div className="pb-2 border-b border-main mb-2">
                        <h4 className="text-sm font-semibold text-main">AI Bot Brain Configuration</h4>
                        <p className="text-[11px] text-secondary">Train your bot with your business knowledge.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-main mb-1.5">Personality</label>
                        <select
                            value={botPersonality}
                            onChange={(e) => setBotPersonality(e.target.value)}
                            className="input text-sm py-2 w-full"
                        >
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
                            className="input text-sm py-2 w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-main mb-1.5">Knowledge Base</label>
                        <div className="space-y-3 p-3 rounded-lg bg-body border border-main transition-colors">
                            <div>
                                <span className="block text-[11px] font-medium text-secondary mb-1">Option A: Upload Business Document (PDF)</span>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setPdfFile(e.target.files[0])}
                                    className="block w-full text-[11px] text-secondary
                    file:mr-2 file:py-1 file:px-2
                    file:rounded-md file:border-0
                    file:text-[11px] file:font-semibold
                    file:bg-blue-500/10 file:text-blue-500
                    hover:file:bg-blue-500/20"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-main"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-surface px-2 text-[10px] text-secondary">OR</span>
                                </div>
                            </div>
                            <div>
                                <span className="block text-[11px] font-medium text-secondary mb-1">Option B: Paste website text or notes</span>
                                <textarea
                                    value={manualText}
                                    onChange={(e) => setManualText(e.target.value)}
                                    placeholder="Paste details about your products, services, or FAQs here..."
                                    rows={3}
                                    className="input text-[11px] py-2 resize-none w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {userAutomation?.knowledgeBaseText && (
                        <div className="p-2 rounded bg-emerald-50 border border-emerald-100">
                            <p className="text-[10px] text-emerald-700">
                                ✓ Knowledge base contains {userAutomation.knowledgeBaseText.length} characters.
                            </p>
                        </div>
                    )}

                    {activePlatform === 'gmail' && (
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 space-y-2">
                            <div className="flex items-center gap-2 text-amber-800">
                                <Info size={14} />
                                <span className="text-xs font-semibold">Important Notice</span>
                            </div>
                            <p className="text-[10px] text-amber-700 leading-relaxed">
                                This bot replies to <strong>ALL unread emails</strong> in your inbox. We strongly recommend using a dedicated support email address to avoid accidental replies to personal mail.
                            </p>
                        </div>
                    )}

                    {configError && <p className="text-xs text-red-600">{configError}</p>}
                    {configSuccess && <p className="text-xs text-emerald-600 font-medium">{configSuccess}</p>}
                </div>
            );
        }

        return (
            <>
                <p className="text-xs font-medium text-slate-500 mb-3">Optional—set your preferences</p>
                <label className="block text-xs text-slate-500 mb-1">Tone</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="input text-sm py-2 mb-3 w-full">
                    {TONE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
                <label className="block text-xs text-slate-500 mb-1">Content or other preferences</label>
                <textarea
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. keywords, brand voice..."
                    rows={2}
                    className="input text-sm py-2 resize-none w-full"
                />
                {item.configSummary && (
                    <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">{item.configSummary}</p>
                )}
            </>
        );
    };

    const renderDetailsModal = () => {
        const isYoutube = item.type === 'youtube_video_automation';
        return (
            <div className="p-4 sm:p-5 space-y-4 text-sm overflow-y-auto max-h-[70vh]">
                <div>
                    <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">How it works</h4>
                    <p className="text-secondary leading-relaxed">{howItWorks}</p>
                </div>
                {isYoutube && (
                    <>
                        <div>
                            <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">How to use</h4>
                            <p className="text-secondary leading-relaxed">{howToUse || item.configSummary}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">Permissions required</h4>
                            <p className="text-secondary leading-relaxed">{permissionsRequired || 'YouTube channel with upload permission.'}</p>
                        </div>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <Clock size={18} className="shrink-0 text-amber-400 mt-0.5" />
                            <p className="text-slate-300 text-xs leading-relaxed">
                                Each run typically completes within <strong>30–60 minutes</strong>. Your video will be generated and uploaded to your YouTube channel automatically.
                            </p>
                        </div>
                    </>
                )}
                <div>
                    <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">Pricing</h4>
                    <p className="text-main font-medium">{pricing}</p>
                </div>
                {item.configSummary && !isYoutube && (
                    <div>
                        <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">Setup</h4>
                        <p className="text-secondary">{item.configSummary}</p>
                    </div>
                )}
                {tutorialUrl && (
                    <a
                        href={tutorialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-full gap-2 text-sm py-2.5 flex items-center justify-center"
                    >
                        <ExternalLink size={16} /> Watch tutorial
                    </a>
                )}
            </div>
        );
    };

    return (
        <>
            <article className="relative bg-card backdrop-blur-sm rounded-xl border border-main p-4 sm:p-5 flex flex-col gap-4 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 border ${colorClass}`}>
                        {IconComponent ? <IconComponent size={20} /> : <Zap size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-main truncate text-[15px]">{item.name}</h3>
                    </div>
                    <span
                        className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/10 text-emerald-400' : isPaused ? 'bg-amber-500/10 text-amber-400' : 'bg-body text-secondary border border-main'
                            }`}
                    >
                        {isActive ? 'Telegram Bot Active' : isPaused ? 'Telegram Bot Paused' : isInactive ? 'Telegram Bot Inactive' : 'Available'}
                    </span>

                    {userAutomation?.type === 'auto_reply' && (
                        <span
                            className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${userAutomation.emailAutomationStatus === 'active' ? 'bg-blue-500/10 text-blue-400' : 'bg-body text-secondary border border-main'}`}
                        >
                            {userAutomation.emailAutomationStatus === 'active' ? 'Gmail Bot Active' : 'Gmail Bot Inactive'}
                        </span>
                    )}
                </div>

                {userAutomation?.type === 'auto_reply' && (
                    <div className="flex items-center gap-2 p-1 bg-body rounded-lg border border-main w-fit">
                        <button
                            onClick={() => setActivePlatform('telegram')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activePlatform === 'telegram' ? 'bg-blue-600 text-white shadow-lg' : 'text-secondary hover:text-main'}`}
                        >
                            <Send size={14} /> Telegram
                        </button>
                        <button
                            onClick={() => setActivePlatform('gmail')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activePlatform === 'gmail' ? 'bg-emerald-600 text-white shadow-lg' : 'text-secondary hover:text-main'}`}
                        >
                            <Mail size={14} /> Gmail
                        </button>
                    </div>
                )}

                {isYoutubeAutomation && runSuccessMessage && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                        <Clock size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-emerald-800">{runSuccessMessage}</p>
                            <button
                                type="button"
                                onClick={onDismissRunMessage}
                                className="text-xs text-emerald-600 hover:text-emerald-800 mt-1"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {isYoutubeAutomation && runError && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-red-800">{runError}</p>
                            <button
                                type="button"
                                onClick={onDismissRunError}
                                className="text-xs text-red-600 hover:text-red-800 mt-1"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-main">
                    <button
                        type="button"
                        onClick={() => setConfigOpen(true)}
                        className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-main py-2 px-3 rounded-lg hover:bg-surface transition-colors"
                    >
                        <Settings size={16} /> Configure
                    </button>
                    <button
                        type="button"
                        onClick={() => setDetailsOpen(true)}
                        className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-main py-2 px-3 rounded-lg hover:bg-surface transition-colors"
                    >
                        <Info size={16} /> Details
                    </button>
                    {isYoutubeAutomation && userAutomation && (
                        <>
                            {showRetryButton && (
                                <button
                                    type="button"
                                    onClick={() => onRetry?.(userAutomation)}
                                    disabled={runLoading || !youtubeConnected}
                                    className="btn btn-outline text-sm py-2 px-4 gap-1.5 text-amber-700 border-amber-300 hover:bg-amber-50"
                                >
                                    <RefreshCw size={14} className={runLoading ? 'animate-spin' : ''} /> {runLoading ? 'Retrying…' : 'Retry'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => onRun?.(userAutomation)}
                                disabled={runLoading || !canRunYoutube}
                                title={!contentType ? 'Select a content type in Configure' : (contentType !== 'islamic_stories_hindi' && contentType !== 'scifi_future_worlds_hindi' && contentType !== 'scifi_future_worlds_english' && contentType !== 'mythical_creatures') ? 'This content type is coming soon' : !youtubeConnected ? 'Connect YouTube first' : ''}
                                className="btn btn-primary text-sm py-2 px-4"
                            >
                                {runLoading ? 'Running…' : (<><Play size={16} /> Run now</>)}
                            </button>
                        </>
                    )}
                    {canToggle ? (
                        activePlatform === 'telegram' ? (
                            isActive ? (
                                <button
                                    onClick={() => onToggle?.(userAutomation._id, userAutomation.status, userAutomation.type)}
                                    disabled={toggleLoading}
                                    className="btn btn-secondary text-sm py-2 px-4 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                                >
                                    {toggleLoading ? '…' : <><Pause size={16} /> Pause Telegram</>}
                                </button>
                            ) : (
                                <button
                                    onClick={() => onToggle?.(userAutomation._id, userAutomation.status, userAutomation.type)}
                                    disabled={toggleLoading}
                                    className="btn btn-secondary text-sm py-2 px-4"
                                >
                                    {toggleLoading ? '…' : <><Play size={16} /> Activate Telegram</>}
                                </button>
                            )
                        ) : (
                            userAutomation.emailAutomationStatus === 'active' ? (
                                <button
                                    onClick={() => onToggleEmail?.(userAutomation._id, userAutomation.emailAutomationStatus)}
                                    disabled={toggleLoading}
                                    className="btn btn-secondary text-sm py-2 px-4 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                                >
                                    {toggleLoading ? '…' : <><Pause size={16} /> Pause Gmail</>}
                                </button>
                            ) : (
                                <button
                                    onClick={() => onToggleEmail?.(userAutomation._id, userAutomation.emailAutomationStatus)}
                                    disabled={toggleLoading}
                                    className="btn btn-secondary text-sm py-2 px-4"
                                >
                                    {toggleLoading ? '…' : <><Play size={16} /> Activate Gmail</>}
                                </button>
                            )
                        )
                    ) : (
                        <button onClick={() => onConfigure?.(item)} className="ml-auto btn btn-primary text-sm py-2 px-4">
                            <Play size={16} /> Get started
                        </button>
                    )}
                </div>
            </article>

            {detailsOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setDetailsOpen(false)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Escape' && setDetailsOpen(false)}
                    aria-label="Close modal"
                >
                    <div
                        className="bg-surface w-full max-h-[88vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl border-t sm:border border-main max-w-md mx-auto animate-slide-up transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-surface border-b border-main px-4 py-4 flex items-center justify-between shrink-0 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
                                    {IconComponent ? <IconComponent size={18} /> : <Zap size={18} />}
                                </div>
                                <h3 className="font-bold text-main truncate text-lg">{item.name}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDetailsOpen(false)}
                                className="p-2 rounded-lg text-secondary hover:bg-body hover:text-main transition-colors shrink-0"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {renderDetailsModal()}
                    </div>
                </div>
            )}

            {configOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setConfigOpen(false)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Escape' && setConfigOpen(false)}
                    aria-label="Close configuration modal"
                >
                    <div
                        className="bg-surface w-full max-h-[88vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl border-t sm:border border-main max-w-md mx-auto animate-slide-up transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-surface border-b border-main px-4 py-4 flex items-center justify-between shrink-0 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
                                    {IconComponent ? <IconComponent size={18} /> : <Zap size={18} />}
                                </div>
                                <h3 className="font-bold text-main truncate text-lg">Configure {item.name}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setConfigOpen(false)}
                                className="p-2 rounded-lg text-secondary hover:bg-body hover:text-main transition-colors shrink-0"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 sm:p-5 overflow-y-auto">
                            {renderConfigPanel()}
                            <button
                                onClick={handleSaveConfig}
                                disabled={configSaving}
                                className="btn btn-primary w-full mt-5 text-sm py-2.5"
                            >
                                {configSaving ? 'Saving…' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default React.memo(AutomationCard);
