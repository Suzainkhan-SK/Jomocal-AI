import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Play, Loader2, Zap, Share2, Youtube, MessageSquare, Calendar, BarChart3, Mailbox, Filter, ShoppingCart, CreditCard, UserPlus, Users, Workflow, LayoutDashboard, ClipboardCheck, UserCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AutomationCard from '../components/AutomationCard';
import { INDUSTRY_CATEGORIES, getCatalogByIndustry } from '../data/automationCatalog';

const ICON_MAP = {
  Share2, Youtube, MessageSquare, Calendar, BarChart3,
  Mailbox, Filter, ShoppingCart, CreditCard, UserPlus,
  Users, Workflow, LayoutDashboard, ClipboardCheck, UserCheck,
  Zap,
};

const USER_AUTOMATION_TO_CATALOG = {
  auto_reply: { industryId: 'creators', catalogId: 'dm-response-systems' },
  lead_save: { industryId: 'msme', catalogId: 'lead-qualification' },
  youtube_video_automation: { industryId: 'creators', catalogId: 'youtube-video-automation' },
};

function getLinkedUserAutomation(industryId, catalogItem, userAutomations) {
  const entry = Object.entries(USER_AUTOMATION_TO_CATALOG).find(
    ([_, v]) => v.industryId === industryId && v.catalogId === catalogItem.id
  );
  if (entry) return userAutomations.find((a) => a.type === entry[0]) || null;
  return userAutomations.find((a) => a.name && catalogItem.name && a.name.toLowerCase() === catalogItem.name.toLowerCase()) || null;
}

const Automations = () => {
  const [automations, setAutomations] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndustry, setActiveIndustry] = useState('creators');
  const [showSetupPrompt, setShowSetupPrompt] = useState(false);
  const [pendingAuto, setPendingAuto] = useState(null);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const [runLoadingId, setRunLoadingId] = useState(null);
  const [lastYoutubeRunStatus, setLastYoutubeRunStatus] = useState(null);
  const [runSuccessMessage, setRunSuccessMessage] = useState(null);
  const [runError, setRunError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [autoRes, intRes] = await Promise.all([api.get('/automations'), api.get('/integrations')]);
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch integrations when page is shown (e.g. after returning from Connected Apps)
  useEffect(() => {
    const onFocus = () => fetchData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchData]);

  useEffect(() => {
    if (integrations.some((i) => i.platform === 'youtube')) {
      fetchLastYoutubeRun();
    }
  }, [integrations, fetchLastYoutubeRun]);

  // Poll last run status when a run was started (to pick up completion after 30–60 min)
  useEffect(() => {
    if (!runSuccessMessage) return;
    const interval = setInterval(fetchLastYoutubeRun, 3 * 60 * 1000);
    const timeout = setTimeout(() => clearInterval(interval), 65 * 60 * 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [runSuccessMessage, fetchLastYoutubeRun]);

  const toggleStatus = useCallback(async (id, currentStatus, type) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    if (newStatus === 'active') {
      const needed =
        type === 'auto_reply'
          ? 'telegram'
          : type?.startsWith('youtube_')
            ? 'youtube'
            : 'google_sheets';

      // YouTube: connected via legacy (platform youtube) OR unified Google (platform google with youtube in scopes).
      // If connected_services is missing (e.g. stale response), treat any connected Google account as YouTube-ready.
      const hasNeededIntegration =
        needed === 'youtube'
          ? integrations.some((i) => i.platform === 'youtube' && i.isConnected) ||
            integrations.some((i) => {
              if (i.platform !== 'google' || !i.isConnected) return false;
              const services = i.connected_services;
              return !Array.isArray(services) || services.length === 0 || services.includes('youtube');
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
      await api.post('/automations/toggle', { automationId: id, status: newStatus });
      setAutomations((prev) => prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)));
    } catch (err) {
      console.error('Error toggling status:', err);
    } finally {
      setToggleLoadingId(null);
    }
  }, [integrations]);

  const handleConfigure = useCallback((item) => { console.log('Configure', item?.id); }, []);

  const handleSaveConfig = useCallback(
    async (item, payload) => {
      const id = payload?.userAutomationId;
      if (!id) return Promise.resolve();
      try {
        const config = {
          ...(payload.tone !== undefined && { tone: payload.tone }),
          ...(payload.customNotes !== undefined && { customNotes: payload.customNotes }),
          ...(payload.contentType !== undefined && { contentType: payload.contentType }),
          ...(payload.voiceStyle !== undefined && { voiceStyle: payload.voiceStyle }),
          ...(payload.videoLength !== undefined && { videoLength: payload.videoLength }),
        };
        const res = await api.patch(`/automations/${id}`, { config });
        setAutomations((prev) =>
          prev.map((a) => (a._id === id ? { ...a, config: res.data?.config ?? a.config } : a))
        );
      } catch (err) {
        console.error('Error saving config:', err);
      }
    },
    []
  );

  const catalogItems = useMemo(() => getCatalogByIndustry(activeIndustry), [activeIndustry]);
  const currentCategory = useMemo(() => INDUSTRY_CATEGORIES.find((c) => c.id === activeIndustry), [activeIndustry]);

  const youtubeConnected = useMemo(
    () =>
      integrations.some((i) => i.platform === 'youtube' && i.isConnected) ||
      integrations.some((i) => i.platform === 'google' && i.isConnected && (i.connected_services || []).includes('youtube')),
    [integrations]
  );

  const handleRunNow = useCallback(
    async (userAutomation) => {
      if (!userAutomation || !userAutomation.type?.startsWith('youtube_')) return;
      if (!youtubeConnected) return;
      setRunLoadingId(userAutomation._id);
      setRunSuccessMessage(null);
      setRunError(null);
      try {
        await api.post('/automations/run/youtube');
        setRunSuccessMessage('Video generation started! Your video will be uploaded within 30–60 minutes.');
        fetchLastYoutubeRun();
      } catch (err) {
        console.error('Error running YouTube automation:', err);
        setRunError(err.response?.data?.msg || 'Failed to start. Please try again.');
      } finally {
        setRunLoadingId(null);
      }
    },
    [youtubeConnected, fetchLastYoutubeRun]
  );

  const handleRetry = useCallback(
    (userAutomation) => handleRunNow(userAutomation),
    [handleRunNow]
  );

  const handleDismissRunMessage = useCallback(() => setRunSuccessMessage(null), []);

  return (
    <div className="animate-fade-in">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Automations</h1>
            <p className="text-slate-500 text-sm mt-0.5">{currentCategory?.description ?? 'Turn on what you need.'}</p>
          </div>
          <button type="button" className="btn btn-primary text-sm py-2.5 px-4 shrink-0 w-full sm:w-auto">
            <Play size={16} /> Create new
          </button>
        </div>

        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mt-4 w-fit max-w-full overflow-x-auto">
          {INDUSTRY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveIndustry(cat.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeIndustry === cat.id ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-slate-100">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-slate-500 text-sm">Loading…</p>
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
                onConfigure={handleConfigure}
                onSaveConfig={handleSaveConfig}
                toggleLoading={toggleLoadingId === userAutomation?._id}
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

      {showSetupPrompt && pendingAuto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-5">
            <h3 className="font-semibold text-slate-900">Setup required</h3>
            <p className="text-sm text-slate-500 mt-1">
              {pendingAuto.type === 'auto_reply'
                ? 'Connect Telegram to activate this automation.'
                : pendingAuto.type?.startsWith('youtube_')
                  ? 'Connect YouTube to activate this automation.'
                  : 'Connect the required app to activate this automation.'}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => { setShowSetupPrompt(false); setPendingAuto(null); }}
                className="btn btn-secondary flex-1 text-sm py-2"
              >
                Cancel
              </button>
              <Link to="/dashboard/apps" className="btn btn-primary flex-1 text-sm py-2">
                <Sparkles size={16} /> Connect
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;
