import React, { useState, useRef, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import { DEFAULT_AUTOMATION_META, YOUTUBE_CONTENT_TYPES } from '../data/automationCatalog';

const COLOR_CLASSES = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  violet: 'bg-violet-50 text-violet-600 border-violet-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  teal: 'bg-teal-50 text-teal-600 border-teal-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  red: 'bg-red-50 text-red-600 border-red-100',
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
}) {
  const [configOpen, setConfigOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [tone, setTone] = useState(userAutomation?.config?.tone ?? '');
  const [customNotes, setCustomNotes] = useState(userAutomation?.config?.customNotes ?? '');
  const [contentType, setContentType] = useState(userAutomation?.config?.contentType ?? '');
  const [voiceStyle, setVoiceStyle] = useState(userAutomation?.config?.voiceStyle ?? '');
  const [videoLength, setVideoLength] = useState(userAutomation?.config?.videoLength ?? '');
  const [configSaving, setConfigSaving] = useState(false);
  const [configError, setConfigError] = useState('');
  const configRef = useRef(null);

  const isYoutubeAutomation = userAutomation?.type?.startsWith('youtube_');

  useEffect(() => {
    setTone(userAutomation?.config?.tone ?? '');
    setCustomNotes(userAutomation?.config?.customNotes ?? '');
    setContentType(userAutomation?.config?.contentType ?? '');
    setVoiceStyle(userAutomation?.config?.voiceStyle ?? '');
    setVideoLength(userAutomation?.config?.videoLength ?? '');
  }, [
    userAutomation?._id,
    userAutomation?.config?.tone,
    userAutomation?.config?.customNotes,
    userAutomation?.config?.contentType,
    userAutomation?.config?.voiceStyle,
    userAutomation?.config?.videoLength,
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

  const canRunYoutube = youtubeConnected && (contentType === 'islamic_stories_hindi' || contentType === 'scifi_future_worlds_hindi' || contentType === 'scifi_future_worlds_english');
  const showRetryButton = isYoutubeAutomation && lastRunStatus === 'failed';

  const handleSaveConfig = useCallback(() => {
    if (isYoutubeAutomation && !contentType) {
      setConfigError('Please select a content type.');
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
  }, [item, userAutomation?._id, tone, customNotes, contentType, voiceStyle, videoLength, isYoutubeAutomation, onSaveConfig]);

  useEffect(() => {
    if (!configOpen) return;
    const handleClickOutside = (e) => {
      if (configRef.current && !configRef.current.contains(e.target)) setConfigOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [configOpen]);

  const renderConfigPanel = () => {
    if (isYoutubeAutomation) {
      return (
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-500">Configure your YouTube automation</p>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Content type <span className="text-red-500">*</span>
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="input text-sm py-2 w-full border-slate-200"
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
            <label className="block text-xs font-medium text-slate-500 mb-1">Voice style (optional)</label>
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
            <label className="block text-xs font-medium text-slate-500 mb-1">Video length (optional)</label>
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
            <label className="block text-xs font-medium text-slate-500 mb-1">Posting schedule (optional)</label>
            <select className="input text-sm py-2 w-full opacity-60 cursor-not-allowed" disabled>
              <option>Coming soon</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Custom hashtags (optional)</label>
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
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">How it works</h4>
          <p className="text-slate-700 leading-relaxed">{howItWorks}</p>
        </div>
        {isYoutube && (
          <>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">How to use</h4>
              <p className="text-slate-600 leading-relaxed">{howToUse || item.configSummary}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Permissions required</h4>
              <p className="text-slate-600 leading-relaxed">{permissionsRequired || 'YouTube channel with upload permission.'}</p>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <Clock size={18} className="shrink-0 text-amber-600 mt-0.5" />
              <p className="text-slate-700 text-xs leading-relaxed">
                Each run typically completes within <strong>30–60 minutes</strong>. Your video will be generated and uploaded to your YouTube channel automatically.
              </p>
            </div>
          </>
        )}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Pricing</h4>
          <p className="text-slate-900 font-medium">{pricing}</p>
        </div>
        {item.configSummary && !isYoutube && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Setup</h4>
            <p className="text-slate-600">{item.configSummary}</p>
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
      <article className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col gap-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
          <div className={`p-2 rounded-lg shrink-0 border ${colorClass}`}>
            {IconComponent ? <IconComponent size={20} /> : <Zap size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 truncate text-[15px]">{item.name}</h3>
          </div>
          <span
            className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-50 text-emerald-700' : isPaused ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
              }`}
          >
            {isActive ? 'Automation Active' : isPaused ? 'Automation Paused' : isInactive ? 'Automation Inactive' : 'Available'}
          </span>

        </div>

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

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="relative" ref={configRef}>
            <button
              type="button"
              onClick={() => setConfigOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Settings size={16} /> Configure <ChevronDown size={14} className={`transition-transform ${configOpen ? 'rotate-180' : ''}`} />
            </button>
            {configOpen && (
              <div className="absolute left-0 right-0 sm:right-auto sm:min-w-[320px] top-full mt-1 z-20 bg-white rounded-xl border border-slate-200 shadow-xl p-4 max-h-[85vh] overflow-y-auto">
                {renderConfigPanel()}
                <button
                  onClick={handleSaveConfig}
                  disabled={configSaving}
                  className="btn btn-primary w-full mt-4 text-sm py-2"
                >
                  {configSaving ? 'Saving…' : 'Save'}
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
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
                title={!contentType ? 'Select a content type in Configure' : (contentType !== 'islamic_stories_hindi' && contentType !== 'scifi_future_worlds_hindi' && contentType !== 'scifi_future_worlds_english') ? 'This content type is coming soon' : !youtubeConnected ? 'Connect YouTube first' : ''}
                className="btn btn-primary text-sm py-2 px-4"
              >
                {runLoading ? 'Running…' : (<><Play size={16} /> Run now</>)}
              </button>
            </>
          )}
          {canToggle ? (
            isActive ? (
              <button
                onClick={() => onToggle?.(userAutomation._id, userAutomation.status, userAutomation.type)}
                disabled={toggleLoading}
                className="btn btn-secondary text-sm py-2 px-4 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
              >
                {toggleLoading ? '…' : <><Pause size={16} /> Pause</>}
              </button>
            ) : (
              <button
                onClick={() => onToggle?.(userAutomation._id, userAutomation.status, userAutomation.type)}
                disabled={toggleLoading}
                className="btn btn-secondary text-sm py-2 px-4"
              >
                {toggleLoading ? '…' : <><Play size={16} /> Activate</>}
              </button>
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40"
          onClick={() => setDetailsOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && setDetailsOpen(false)}
          aria-label="Close modal"
        >
          <div
            className="bg-white w-full max-h-[88vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-2xl shadow-xl border-t sm:border border-slate-200 max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
                  {IconComponent ? <IconComponent size={18} /> : <Zap size={18} />}
                </div>
                <h3 className="font-semibold text-slate-900 truncate text-base">{item.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            {renderDetailsModal()}
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(AutomationCard);
