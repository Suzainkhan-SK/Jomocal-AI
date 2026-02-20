import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Play, Loader2, Zap, Share2, Youtube, MessageSquare, Calendar, BarChart3, Mailbox, Filter, ShoppingCart, CreditCard, UserPlus, Users, Workflow, LayoutDashboard, ClipboardCheck, UserCheck, Sparkles, Plus } from 'lucide-react';
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

const USER_AUTOMATION_MAPPING = [
  { type: 'auto_reply', industryId: 'creators', catalogId: 'dm-response-systems' },
  { type: 'auto_reply', industryId: 'msme', catalogId: 'customer-inquiry-management' },
  { type: 'auto_reply', industryId: 'businesses', catalogId: 'ai-enterprise-support' },
  { type: 'lead_save', industryId: 'msme', catalogId: 'lead-qualification' },
  { type: 'youtube_video_automation', industryId: 'creators', catalogId: 'youtube-video-automation' },
];

function getLinkedUserAutomation(industryId, catalogItem, userAutomations) {
  const mapping = USER_AUTOMATION_MAPPING.find(
    (m) => m.industryId === industryId && m.catalogId === catalogItem.id
  );
  if (mapping) return userAutomations.find((a) => a.type === mapping.type) || null;
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

  const toggleEmailStatus = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    if (newStatus === 'active') {
      const hasGmail = integrations.some(i => i.platform === 'google' && i.isConnected && (i.connected_services || []).includes('gmail'));
      if (!hasGmail) {
        setPendingAuto({ id, currentStatus, type: 'email_automation' });
        setShowSetupPrompt(true);
        return;
      }
    }
    setToggleLoadingId(`${id}_email`);
    try {
      const res = await api.patch(`/automations/${id}`, { emailAutomationStatus: newStatus });
      setAutomations((prev) => prev.map((a) => (a._id === id ? { ...a, emailAutomationStatus: newStatus } : a)));
    } catch (err) {
      console.error('Error toggling email status:', err);
    } finally {
      setToggleLoadingId(null);
    }
  }, [integrations]);

  const handleConfigure = useCallback((item) => { console.log('Configure', item?.id); }, []);

  const handleSaveConfig = useCallback(
    async (item, payload) => {
      const id = payload?.userAutomationId;
      if (!id) return Promise.resolve();

      // If payload is already the full automation object (e.g. from Bot Brain config), 
      // just update the state and skip the extra API call.
      if (payload.type === 'auto_reply' && (payload.botPersonality || payload.knowledgeBaseText || payload.emailAutomationStatus)) {
        if (!id) {
          // New automation seeded by the backend during config save
          setAutomations((prev) => [...prev, payload]);
        } else {
          setAutomations((prev) =>
            prev.map((a) => (a._id === id ? { ...a, ...payload } : a))
          );
        }
        return Promise.resolve();
      }

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
            <h1 className="text-xl sm:text-2xl font-bold text-main tracking-tight">Automations</h1>
            <p className="text-secondary text-sm mt-0.5">{currentCategory?.description ?? 'Turn on what you need.'}</p>
          </div>
          <button type="button" className="btn btn-primary text-sm py-2.5 px-4 shrink-0 w-full sm:w-auto">
            <Plus size={16} /> Create new
          </button>
        </div>

        <div className="flex gap-1 p-1 bg-surface backdrop-blur-sm border border-main rounded-lg mt-4 w-fit max-w-full overflow-x-auto">
          {INDUSTRY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveIndustry(cat.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeIndustry === cat.id ? 'bg-blue-600 text-white shadow-lg' : 'text-secondary hover:text-main hover:bg-body'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-surface rounded-xl border border-main">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
          <p className="text-secondary text-sm">Loading…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-visible">
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
                toggleLoading={toggleLoadingId === userAutomation?._id || toggleLoadingId === `${userAutomation?._id}_email`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-2xl border border-main max-w-sm w-full p-6 animate-fade-in transition-colors">
            <h3 className="font-bold text-main text-lg">Setup Required</h3>
            <p className="text-sm text-secondary mt-2 leading-relaxed">
              {pendingAuto.type === 'auto_reply'
                ? 'Connect Telegram to activate this automation.'
                : pendingAuto.type === 'email_automation'
                  ? 'Connect Gmail to activate this automation.'
                  : pendingAuto.type?.startsWith('youtube_')
                    ? 'Connect YouTube to activate this automation.'
                    : 'Connect the required app to activate this automation.'}
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setShowSetupPrompt(false); setPendingAuto(null); }}
                className="btn btn-secondary flex-1 text-sm py-2.5"
              >
                Cancel
              </button>
              <Link to="/dashboard/apps" className="btn btn-primary flex-1 text-sm py-2.5">
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
