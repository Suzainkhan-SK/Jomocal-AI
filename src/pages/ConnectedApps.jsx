import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, RefreshCw, Loader2, Unplug } from 'lucide-react';
import api from '../utils/api';

const APP_ICONS = {
  google: 'https://www.google.com/favicon.ico',
  telegram: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
  whatsapp: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
  google_sheets: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg',
  instagram: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
  gmail: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
  youtube: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
  twitter: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/X_%28Twitter%29_logo_%282023%29.svg',
  tiktok: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg',
  linkedin: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
  facebook: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg',
  slack: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
  discord: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Discord_logo.svg',
  notion: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
  trello: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Trello_logo.svg',
  stripe: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
  mailchimp: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Mailchimp_Logo-Horizontal_Black.svg',
  calendly: 'https://logo.clearbit.com/calendly.com',
  shopify: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg',
};

const APP_CONFIG = {
  google: { name: 'Google Account', placeholder: null, credentialKey: null, oauthOnly: true },
  telegram: { name: 'Telegram', placeholder: 'Bot Token', credentialKey: 'token', hint: 'Get your token from @BotFather on Telegram.' },
  whatsapp: { name: 'WhatsApp', placeholder: 'API Key or Access Token', credentialKey: 'token' },
  google_sheets: { name: 'Google Sheets', placeholder: 'Spreadsheet ID or OAuth token', credentialKey: 'token' },
  instagram: { name: 'Instagram', placeholder: 'Access Token', credentialKey: 'token' },
  gmail: { name: 'Gmail', placeholder: 'App Password or OAuth token', credentialKey: 'token' },
  youtube: { name: 'YouTube', placeholder: 'API Key or OAuth token', credentialKey: 'token', hint: 'Use Google Account above for YouTube, Gmail & Sheets.' },
  twitter: { name: 'X (Twitter)', placeholder: 'API Key / Access Token', credentialKey: 'token' },
  tiktok: { name: 'TikTok', placeholder: 'Access Token', credentialKey: 'token' },
  linkedin: { name: 'LinkedIn', placeholder: 'Access Token', credentialKey: 'token' },
  facebook: { name: 'Facebook', placeholder: 'Page Access Token', credentialKey: 'token' },
  slack: { name: 'Slack', placeholder: 'Bot Token (xoxb-...)', credentialKey: 'token' },
  discord: { name: 'Discord', placeholder: 'Bot Token', credentialKey: 'token' },
  notion: { name: 'Notion', placeholder: 'Integration Token', credentialKey: 'token' },
  trello: { name: 'Trello', placeholder: 'API Key + Token', credentialKey: 'token' },
  stripe: { name: 'Stripe', placeholder: 'Secret Key (sk_...)', credentialKey: 'token' },
  mailchimp: { name: 'Mailchimp', placeholder: 'API Key', credentialKey: 'token' },
  calendly: { name: 'Calendly', placeholder: 'API Key', credentialKey: 'token' },
  shopify: { name: 'Shopify', placeholder: 'Store URL + Access Token', credentialKey: 'token' },
};

const APP_CATEGORIES = [
  { id: 'messaging', label: 'Messaging', apps: ['telegram', 'whatsapp', 'slack', 'discord'] },
  { id: 'social', label: 'Social & Video', apps: ['google', 'youtube', 'instagram', 'twitter', 'tiktok', 'linkedin', 'facebook'] },
  { id: 'productivity', label: 'Productivity', apps: ['google_sheets', 'gmail', 'notion', 'trello', 'calendly'] },
  { id: 'business', label: 'Business & Sales', apps: ['stripe', 'mailchimp', 'shopify'] },
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

  useEffect(() => {
    fetchIntegrations();
  }, []);

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
    } catch (err) {
      console.error('Error fetching integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const startYoutubeOAuth = async () => {
    setYoutubeRedirecting(true);
    try {
      const res = await api.get('/oauth/google/youtube/start');
      const { url } = res.data || {};
      if (!url) throw new Error('Missing OAuth URL');
      window.location.href = url;
    } catch (err) {
      console.error('Failed to start YouTube OAuth:', err);
      setYoutubeRedirecting(false);
    }
  };

  const startGoogleOAuth = async () => {
    setGoogleRedirecting(true);
    try {
      const res = await api.get('/oauth/google/start', { params: { services: 'youtube,gmail,sheets' } });
      const { url } = res.data || {};
      if (!url) throw new Error('Missing OAuth URL');
      window.location.href = url;
    } catch (err) {
      console.error('Failed to start Google OAuth:', err);
      setGoogleRedirecting(false);
    }
  };

  const handleConnectClick = (appId) => {
    if (appId === 'google') {
      startGoogleOAuth();
      return;
    }
    if (appId === 'youtube') {
      startYoutubeOAuth();
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
    } finally {
      setConnecting(false);
    }
  };

  const isConnected = (platform) => {
    if (platform === 'youtube') {
      return integrations.some((i) => i.platform === 'youtube' && i.isConnected) ||
        integrations.some((i) => i.platform === 'google' && i.isConnected && (i.connected_services || []).includes('youtube'));
    }
    if (platform === 'gmail') {
      return integrations.some((i) => i.platform === 'google' && i.isConnected && (i.connected_services || []).includes('gmail'));
    }
    if (platform === 'google_sheets' || platform === 'sheets') {
      return integrations.some((i) => i.platform === 'google' && i.isConnected && (i.connected_services || []).includes('sheets'));
    }
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
      if (platform === 'google') {
        const hasGoogle = getIntegration('google')?.isConnected;
        if (hasGoogle) await api.post('/oauth/google/disconnect');
        else await api.post('/oauth/google/youtube/disconnect');
      } else if (platform === 'youtube') {
        await api.post('/oauth/google/youtube/disconnect');
      } else {
        await api.post('/integrations/disconnect', { platform });
      }
      const res = await api.get('/integrations');
      setIntegrations(res.data || []);
    } catch (err) {
      console.error('Error disconnecting:', err);
      fetchIntegrations();
    } finally {
      setDisconnectingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {(showYoutubeConnectedToast || showGoogleConnectedToast) && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span className="font-medium">{showGoogleConnectedToast ? 'Google Account connected.' : 'YouTube Connected.'}</span>{' '}
          {showGoogleConnectedToast ? 'YouTube, Gmail & Sheets are now available for automations.' : 'Your channel is now available for automations.'}
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Connected Apps</h1>
        <p className="text-slate-500 text-sm mt-1">Connect the apps you use. Each integration powers your automations.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-100">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-slate-500 text-sm">Loading…</p>
        </div>
      ) : (
        <div className="space-y-8">
          {APP_CATEGORIES.map((cat) => (
            <section key={cat.id}>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">{cat.label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cat.apps.map((appId) => {
                  const config = APP_CONFIG[appId];
                  const icon = APP_ICONS[appId];
                  const isGoogleCard = appId === 'google';
                  const connected = isGoogleCard ? isGoogleConnected : isConnected(appId);
                  const integration = getIntegration(appId);
                  const googleInt = getIntegration('google');
                  const youtubeInt = getIntegration('youtube');
                  if (!config) return null;

                  if (isGoogleCard) {
                    return (
                      <div
                        key={appId}
                        className={`rounded-xl border p-5 flex flex-col items-center text-center transition-all ${
                          connected ? 'border-emerald-200 bg-emerald-50/40' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="w-14 h-14 mb-3 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                          {icon ? <img src={icon} alt="" className="w-8 h-8 object-contain" /> : <span className="text-slate-400 font-bold text-lg">G</span>}
                        </div>
                        <h3 className="font-semibold text-slate-900 text-[15px] mb-1">{config.name}</h3>
                        <p className="text-xs text-slate-500 mb-2">Connected services</p>
                        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                          {GOOGLE_SERVICES.map((s) => {
                            const enabled = googleConnectedServices.includes(s.id);
                            return (
                              <span
                                key={s.id}
                                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                  enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                                }`}
                              >
                                {s.label}
                              </span>
                            );
                          })}
                        </div>
                        {!connected && (
                          <p className="text-xs text-amber-600 mb-2">Enable to activate automations that use YouTube, Gmail or Sheets.</p>
                        )}
                        {connected ? (
                          <div className="w-full flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleConnectClick(appId)}
                              className="flex-1 btn btn-secondary text-sm py-2"
                              disabled={googleRedirecting}
                            >
                              <RefreshCw size={14} /> Reconnect
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDisconnect(appId)}
                              disabled={disconnectingId === appId}
                              className="flex-1 btn btn-secondary text-sm py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                              {disconnectingId === appId ? <Loader2 size={14} className="animate-spin mx-auto" /> : <><Unplug size={14} /> Disconnect</>}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleConnectClick(appId)}
                            className="w-full btn btn-primary text-sm py-2"
                            disabled={googleRedirecting}
                          >
                            <Plus size={14} /> Connect Google Account
                          </button>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={appId}
                      className={`rounded-xl border p-5 flex flex-col items-center text-center transition-all ${
                        connected ? 'border-emerald-200 bg-emerald-50/40' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="w-14 h-14 mb-3 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        {icon ? (
                          <img src={icon} alt="" className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-slate-400 font-bold text-lg">{config.name[0]}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 text-[15px] mb-1">{config.name}</h3>
                      <p className={`text-xs mb-4 ${connected ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                        {connected && appId === 'youtube' && (integration?.youtube_channel_title || googleInt?.youtube_channel_title)
                          ? `Connected: ${integration?.youtube_channel_title || googleInt?.youtube_channel_title}`
                          : connected
                            ? 'Connected'
                            : 'Not Connected'}
                      </p>
                      {connected ? (
                        <div className="w-full flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleConnectClick(appId)}
                            className="flex-1 btn btn-secondary text-sm py-2"
                            disabled={appId === 'youtube' && youtubeRedirecting}
                          >
                            <RefreshCw size={14} /> {appId === 'youtube' ? 'Reconnect YouTube' : 'Reconnect'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDisconnect(appId)}
                            disabled={disconnectingId === appId}
                            className="flex-1 btn btn-secondary text-sm py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          >
                            {disconnectingId === appId ? <Loader2 size={14} className="animate-spin mx-auto" /> : <><Unplug size={14} /> Disconnect</>}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConnectClick(appId)}
                          className="w-full btn btn-primary text-sm py-2"
                          disabled={appId === 'youtube' && youtubeRedirecting}
                        >
                          <Plus size={14} /> {appId === 'youtube' ? 'Connect YouTube Account' : 'Connect'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {showModal && selectedApp && (() => {
        const config = APP_CONFIG[selectedApp];
        const icon = APP_ICONS[selectedApp];
        return (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {icon ? <img src={icon} alt="" className="w-8 h-8 object-contain" /> : <span className="text-slate-500 font-bold text-xl">{config?.name[0]}</span>}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Connect {config?.name}</h2>
                    <p className="text-slate-500 text-sm">Enter your credentials to link your account.</p>
                  </div>
                </div>
                <form onSubmit={handleConnectSubmit} className="space-y-4">
                  <div>
                    <label className="label text-sm">{config?.placeholder}</label>
                    <input
                      type="text"
                      className="input"
                      placeholder={selectedApp === 'telegram' ? '8252223104:AAGHV...' : 'Paste your key or token'}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                    />
                    {config?.hint && (
                      <p className="text-xs text-slate-400 mt-2">{config.hint}</p>
                    )}
                    {selectedApp === 'telegram' && (
                      <p className="text-xs text-slate-400 mt-1">
                        Get your token from <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">@BotFather</a> on Telegram.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1 py-2.5" disabled={connecting}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary flex-1 py-2.5" disabled={connecting}>
                      {connecting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Connect'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ConnectedApps;
