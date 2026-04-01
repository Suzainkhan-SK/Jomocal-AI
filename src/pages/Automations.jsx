import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Play, Loader2, Zap, Share2, Youtube, MessageSquare, Calendar,
  BarChart3, Mailbox, Filter, ShoppingCart, CreditCard, UserPlus,
  Users, Workflow, LayoutDashboard, ClipboardCheck, UserCheck,
  Sparkles, Plus, BrainCircuit, ExternalLink, AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AutomationCard from '../components/AutomationCard';
import { INDUSTRY_CATEGORIES, getCatalogByIndustry } from '../data/automationCatalog';

/* ─── Icon map ─── */
const ICON_MAP = {
  Share2, Youtube, MessageSquare, Calendar, BarChart3,
  Mailbox, Filter, ShoppingCart, CreditCard, UserPlus,
  Users, Workflow, LayoutDashboard, ClipboardCheck, UserCheck,
  Zap,
};

/* ─── Mapping: user automation type → catalog item ─── */
const USER_AUTOMATION_MAPPING = [
  { type: 'auto_reply',              industryId: 'creators',   catalogId: 'dm-response-systems' },
  { type: 'auto_reply',              industryId: 'msme',       catalogId: 'customer-inquiry-management' },
  { type: 'auto_reply',              industryId: 'businesses', catalogId: 'ai-enterprise-support' },
  { type: 'lead_save',               industryId: 'msme',       catalogId: 'lead-qualification' },
  { type: 'lead_hunter',             industryId: 'msme',       catalogId: 'lead-hunter' },
  { type: 'youtube_video_automation',industryId: 'creators',   catalogId: 'youtube-video-automation' },
];

function getLinkedUserAutomation(industryId, catalogItem, userAutomations) {
  const mapping = USER_AUTOMATION_MAPPING.find(
    (m) => m.industryId === industryId && m.catalogId === catalogItem.id
  );
  if (mapping) return userAutomations.find((a) => a.type === mapping.type) || null;
  return userAutomations.find(
    (a) => a.name && catalogItem.name && a.name.toLowerCase() === catalogItem.name.toLowerCase()
  ) || null;
}

/* ─── Industry tab accent colours ─── */
const TAB_ACCENT = {
  creators:   'from-blue-600 to-violet-600',
  msme:       'from-emerald-600 to-teal-600',
  businesses: 'from-amber-600 to-orange-600',
};

/* ──────────────────────────────────────────────────────────
   Shimmer skeleton card (shown while loading)
────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-main p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex gap-3 items-start">
        <div className="w-10 h-10 rounded-xl bg-main/10 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-main/10 rounded-lg w-3/4" />
          <div className="h-3 bg-main/10 rounded-lg w-full" />
          <div className="h-3 bg-main/10 rounded-lg w-2/3" />
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <div className="h-5 w-16 bg-main/10 rounded-full" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-main">
        <div className="h-8 w-24 bg-main/10 rounded-xl" />
        <div className="h-8 w-20 bg-main/10 rounded-xl" />
        <div className="h-8 w-28 bg-main/10 rounded-xl ml-auto" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Automations page
══════════════════════════════════════════════════════════ */
const Automations = () => {
  const [automations,         setAutomations]         = useState([]);
  const [integrations,        setIntegrations]        = useState([]);
  const [loading,             setLoading]             = useState(true);
  const [activeIndustry,      setActiveIndustry]      = useState('creators');
  const [showSetupPrompt,     setShowSetupPrompt]     = useState(false);
  const [pendingAuto,         setPendingAuto]         = useState(null);
  const [toggleLoadingId,     setToggleLoadingId]     = useState(null);
  const [runLoadingId,        setRunLoadingId]        = useState(null);
  const [lastYoutubeRunStatus,setLastYoutubeRunStatus]= useState(null);
  const [runSuccessMessage,   setRunSuccessMessage]   = useState(null);
  const [runError,            setRunError]            = useState(null);

  /* ── Page title ── */
  useEffect(() => {
    document.title = 'AI Automation Studio | Jomocal AI';
    return () => { document.title = 'Jomocal AI'; };
  }, []);

  /* ── Data fetching ── */
  const fetchData = useCallback(async () => {
    try {
      const [autoRes, intRes] = await Promise.all([
        api.get('/automations'),
        api.get('/integrations'),
      ]);
      setAutomations(autoRes.data || []);
      setIntegrations(intRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLastYoutubeRun = useCallback(async () => {
    try {
      const res = await api.get('/automations/youtube/last-run');
      setLastYoutubeRunStatus(res.data?.status ?? null);
    } catch {
      setLastYoutubeRunStatus(null);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* Refetch on window focus (user returns from Connected Apps) */
  useEffect(() => {
    const onFocus = () => fetchData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchData]);

  useEffect(() => {
    if (integrations.some((i) => i.platform === 'youtube')) fetchLastYoutubeRun();
  }, [integrations, fetchLastYoutubeRun]);

  /* Poll last-run status after a run starts */
  useEffect(() => {
    if (!runSuccessMessage) return;
    const interval = setInterval(fetchLastYoutubeRun, 3 * 60 * 1000);
    const timeout  = setTimeout(() => clearInterval(interval), 65 * 60 * 1000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [runSuccessMessage, fetchLastYoutubeRun]);

  /* ── Toggle handlers ── */
  const toggleStatus = useCallback(async (id, currentStatus, type) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    if (newStatus === 'active') {
      const needed =
        type === 'auto_reply'    ? 'telegram' :
        type === 'lead_hunter'   ? 'google'   :
        type?.startsWith('youtube_') ? 'youtube' : 'google_sheets';

      const hasNeededIntegration =
        needed === 'youtube'
          ? integrations.some((i) => i.platform === 'youtube' && i.isConnected) ||
            integrations.some((i) => {
              if (i.platform !== 'google' || !i.isConnected) return false;
              const s = i.connected_services;
              return !Array.isArray(s) || s.length === 0 || s.includes('youtube');
            })
          : needed === 'google'
            ? integrations.some((i) => {
                if (i.platform !== 'google' || !i.isConnected) return false;
                const s = i.connected_services || [];
                if (!Array.isArray(s) || s.length === 0) return true;
                return s.includes('gmail') && s.includes('sheets');
              })
            : !!integrations.find((i) => i.platform === needed && i.isConnected);

      if (!hasNeededIntegration) {
        setPendingAuto({ id, currentStatus, type });
        setShowSetupPrompt(true);
        return;
      }
    }
    setToggleLoadingId(id);
    try {
      if (newStatus === 'active' && type === 'lead_hunter') {
        const launchRes = await api.post('/automations/lead-hunter/start');
        setRunSuccessMessage(launchRes.data?.message || 'Lead Hunter campaign started.');
      }
      await api.post('/automations/toggle', { automationId: id, status: newStatus });
      setAutomations((prev) => prev.map((a) => a._id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Error toggling status:', err);
      if (type === 'lead_hunter') {
        setRunError(err.response?.data?.msg || 'Lead Hunter failed to start on activation.');
      }
    } finally {
      setToggleLoadingId(null);
    }
  }, [integrations]);

  const toggleEmailStatus = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    if (newStatus === 'active') {
      const hasGmail = integrations.some(
        (i) => i.platform === 'google' && i.isConnected && (i.connected_services || []).includes('gmail')
      );
      if (!hasGmail) {
        setPendingAuto({ id, currentStatus, type: 'email_automation' });
        setShowSetupPrompt(true);
        return;
      }
    }
    setToggleLoadingId(`${id}_email`);
    try {
      await api.patch(`/automations/${id}`, { emailAutomationStatus: newStatus });
      setAutomations((prev) => prev.map((a) => a._id === id ? { ...a, emailAutomationStatus: newStatus } : a));
    } catch (err) {
      console.error('Error toggling email status:', err);
    } finally {
      setToggleLoadingId(null);
    }
  }, [integrations]);

  const handleConfigure = useCallback((item) => { console.log('Configure', item?.id); }, []);

  const handleSaveConfig = useCallback(async (item, payload) => {
    const id = payload?.userAutomationId;
    if (!id) return Promise.resolve();

    if (payload.type === 'auto_reply' && (payload.botPersonality || payload.knowledgeBaseText || payload.emailAutomationStatus)) {
      setAutomations((prev) => prev.map((a) => a._id === id ? { ...a, ...payload } : a));
      return Promise.resolve();
    }

    try {
      const config = {
        ...(payload.tone            !== undefined && { tone:            payload.tone }),
        ...(payload.customNotes     !== undefined && { customNotes:     payload.customNotes }),
        ...(payload.contentType     !== undefined && { contentType:     payload.contentType }),
        ...(payload.voiceStyle      !== undefined && { voiceStyle:      payload.voiceStyle }),
        ...(payload.videoLength     !== undefined && { videoLength:     payload.videoLength }),
        ...(payload.targetNiche     !== undefined && { targetNiche:     payload.targetNiche }),
        ...(payload.targetLocation  !== undefined && { targetLocation:  payload.targetLocation }),
        ...(payload.campaignSize    !== undefined && { campaignSize:    payload.campaignSize }),
        ...(payload.offer           !== undefined && { offer:           payload.offer }),
        ...(payload.benefit         !== undefined && { benefit:         payload.benefit }),
        ...(payload.businessContext !== undefined && { businessContext: payload.businessContext }),
        ...(payload.sendingSpeed    !== undefined && { sendingSpeed:    payload.sendingSpeed }),
        ...(payload.mode            !== undefined && { mode:            payload.mode }),
      };
      const res = await api.patch(`/automations/${id}`, { config });
      setAutomations((prev) =>
        prev.map((a) => a._id === id ? { ...a, config: res.data?.config ?? a.config } : a)
      );
    } catch (err) {
      console.error('Error saving config:', err);
    }
  }, []);

  /* ── Derived data ── */
  const catalogItems    = useMemo(() => getCatalogByIndustry(activeIndustry), [activeIndustry]);
  const currentCategory = useMemo(() => INDUSTRY_CATEGORIES.find((c) => c.id === activeIndustry), [activeIndustry]);

  const youtubeConnected = useMemo(() =>
    integrations.some((i) => i.platform === 'youtube' && i.isConnected) ||
    integrations.some((i) => i.platform === 'google' && i.isConnected && (i.connected_services || []).includes('youtube')),
    [integrations]
  );

  const handleRunNow = useCallback(async (userAutomation, leadHunterConfig) => {
    if (!userAutomation) return;
    const isYoutubeAutomation    = userAutomation.type?.startsWith('youtube_');
    const isLeadHunterAutomation = userAutomation.type === 'lead_hunter';
    if (isYoutubeAutomation && !youtubeConnected) return;

    setRunLoadingId(userAutomation._id);
    setRunSuccessMessage(null);
    setRunError(null);

    try {
      if (isYoutubeAutomation) {
        await api.post('/automations/run/youtube');
        setRunSuccessMessage('Video generation started! Your video will be uploaded within 30–60 minutes.');
        fetchLastYoutubeRun();
      } else if (isLeadHunterAutomation) {
        const mergedConfig = { ...(userAutomation.config || {}), ...(leadHunterConfig || {}) };
        const formData = new FormData();
        ['targetNiche','targetLocation','campaignSize','offer','benefit','businessContext','sendingSpeed','mode'].forEach((field) => {
          const value = mergedConfig[field];
          if (value !== undefined && value !== null && value !== '') formData.append(field, String(value));
        });
        if (mergedConfig.businessPdfFile instanceof File) formData.append('businessPdf', mergedConfig.businessPdfFile);
        const res = await api.post('/automations/lead-hunter/start', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setRunSuccessMessage(res.data?.message || 'Lead Hunter campaign started.');
        fetchData();
      }
    } catch (err) {
      console.error('Error running automation:', err);
      setRunError(err.response?.data?.msg || 'Failed to start. Please try again.');
    } finally {
      setRunLoadingId(null);
    }
  }, [youtubeConnected, fetchLastYoutubeRun, fetchData]);

  const handleRetry            = useCallback((ua) => handleRunNow(ua), [handleRunNow]);
  const handleDismissRunMessage = useCallback(() => setRunSuccessMessage(null), []);

  /* ─────────────────────────────────── RENDER ── */
  const activeAccent = TAB_ACCENT[activeIndustry] || TAB_ACCENT.creators;

  return (
    <div className="animate-fade-in">
      {/* ══ Page header ══ */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Title block */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <BrainCircuit size={14} className="text-blue-400" />
              </div>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                Jomocal AI
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              <span className="text-main">AI </span>
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                Automation Studio
              </span>
            </h1>

            {/* Sub-heading changes with category */}
            <p className="text-secondary text-sm mt-1.5 max-w-md leading-relaxed">
              {currentCategory?.description ?? 'One click. Your business on autopilot.'}
            </p>
          </div>

          {/* Create new button */}
          <button
            type="button"
            className="
              btn btn-primary text-sm py-2.5 px-5
              shrink-0 w-full sm:w-auto
              gap-2 transition-all duration-200
              hover:scale-[1.03] active:scale-[0.98]
            "
          >
            <Plus size={16} /> Create New
          </button>
        </div>

        {/* ── Industry tabs ── */}
        <div className="mt-5 flex gap-1.5 p-1.5 bg-body border border-main rounded-2xl w-fit max-w-full overflow-x-auto scrollbar-none">
          {INDUSTRY_CATEGORIES.map((cat) => {
            const isActive = activeIndustry === cat.id;
            const accent   = TAB_ACCENT[cat.id] || 'from-blue-600 to-blue-500';
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveIndustry(cat.id)}
                className={`
                  relative px-4 py-2 rounded-xl text-sm font-semibold
                  whitespace-nowrap transition-all duration-200
                  ${isActive
                    ? `bg-gradient-to-r ${accent} text-white shadow-lg`
                    : 'text-secondary hover:text-main hover:bg-surface'
                  }
                `}
              >
                {cat.label}
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white/60" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Thin gradient bar below tabs matching active tab ── */}
        <div className={`mt-3 h-[3px] w-full rounded-full bg-gradient-to-r ${activeAccent} opacity-20`} />
      </header>

      {/* ══ Card grid ══ */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : catalogItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface rounded-2xl border border-main text-center px-4">
          <Sparkles className="w-10 h-10 text-blue-400 mb-3 opacity-60" />
          <p className="text-main font-semibold">No automations yet</p>
          <p className="text-secondary text-sm mt-1">More automations coming soon for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {catalogItems.map((item) => {
            const userAutomation = getLinkedUserAutomation(activeIndustry, item, automations);
            return (
              <AutomationCard
                key={item.id}
                item={item}
                IconComponent={ICON_MAP[item.icon] || Zap}
                userAutomation={userAutomation}
                onToggle={toggleStatus}
                onToggleEmail={toggleEmailStatus}
                onConfigure={handleConfigure}
                onSaveConfig={handleSaveConfig}
                toggleLoading={
                  toggleLoadingId === userAutomation?._id ||
                  toggleLoadingId === `${userAutomation?._id}_email`
                }
                onRun={handleRunNow}
                onRetry={handleRetry}
                runLoading={runLoadingId === userAutomation?._id}
                youtubeConnected={youtubeConnected}
                lastRunStatus={lastYoutubeRunStatus}
                runSuccessMessage={runSuccessMessage}
                runError={runError}
                onDismissRunMessage={handleDismissRunMessage}
                onDismissRunError={() => setRunError(null)}
              />
            );
          })}
        </div>
      )}

      {/* ══ Setup required prompt ══ */}
      {showSetupPrompt && pendingAuto && (
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="
            bg-surface rounded-t-3xl sm:rounded-2xl
            shadow-2xl border border-main
            w-full sm:max-w-sm
            p-6 sm:p-7
            animate-fade-in
          ">
            {/* Icon */}
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
              <AlertTriangle size={20} className="text-amber-400" />
            </div>

            <h3 className="font-bold text-main text-lg leading-tight">Connection Required</h3>
            <p className="text-sm text-secondary mt-2 leading-relaxed">
              {pendingAuto.type === 'auto_reply'
                ? 'Connect your Telegram account to activate this automation.'
                : pendingAuto.type === 'lead_hunter'
                  ? 'Connect your Google account (Gmail + Sheets) to activate the Lead Hunter.'
                  : pendingAuto.type === 'email_automation'
                    ? 'Connect Gmail to enable the email automation bot.'
                    : pendingAuto.type?.startsWith('youtube_')
                      ? 'Connect your YouTube channel to activate this automation.'
                      : 'Connect the required app to activate this automation.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setShowSetupPrompt(false); setPendingAuto(null); }}
                className="btn btn-secondary flex-1 text-sm py-2.5 order-2 sm:order-1"
              >
                Cancel
              </button>
              <Link
                to="/dashboard/apps"
                className="btn btn-primary flex-1 text-sm py-2.5 gap-1.5 justify-center order-1 sm:order-2
                  hover:scale-[1.02] transition-transform duration-200"
              >
                <ExternalLink size={15} /> Connect App
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;
