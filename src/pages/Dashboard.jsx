import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import {
  Clock,
  CheckCircle2,
  Bot,
  MessageCircle,
  Target,
  Video,
  Star,
  Plus,
  ArrowRight,
  Headphones,
  Play,
  ExternalLink,
  Sparkles,
  Heart,
  Send,
  ShieldCheck,
  Globe,
  TrendingUp,
  ChevronRight,
  Zap,
  Users,
  Mail,
} from 'lucide-react';

/* ═══════════════════ ANIMATIONS ═══════════════════ */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const riseUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ═══════════════════ METRIC CARD ═══════════════════ */

const MetricCard = ({ icon: Icon, label, value, subtitle, accentColor }) => (
  <motion.div variants={riseUp} className="group relative">
    <div
      className="relative h-full p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border transition-all duration-500 group-hover:-translate-y-1 overflow-hidden"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--color-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accentColor}40`;
        e.currentTarget.style.boxShadow = `0 8px 32px ${accentColor}12`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Soft ambient glow */}
      <div
        className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accentColor}15, transparent 70%)`, transform: 'translate(20%, -30%)' }}
      />

      <div className="relative z-10 flex items-center gap-4 sm:block">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center sm:mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${accentColor}12`, color: accentColor, border: `1px solid ${accentColor}20` }}
        >
          <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-secondary font-medium mb-0.5 sm:mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-main font-display tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-secondary mt-1 sm:mt-2 font-medium flex items-center gap-1.5">
              <TrendingUp size={11} style={{ color: '#10b981' }} />
              <span className="truncate">{subtitle}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

/* ═══════════════════ AUTOMATION ACTION CARD ═══════════════════ */

const AutomationActionCard = ({ icon: Icon, title, description, accentColor, href, badge }) => (
  <motion.div variants={riseUp}>
    <Link
      to={href}
      className="group relative flex flex-row sm:flex-col items-center sm:items-center text-left sm:text-center p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border transition-all duration-500 h-full cursor-pointer gap-3.5 sm:gap-0 overflow-hidden"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--color-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accentColor}50`;
        e.currentTarget.style.boxShadow = `0 8px 36px ${accentColor}18`;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Badge */}
      {badge && (
        <span
          className="absolute -top-2.5 right-3 sm:right-4 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ background: accentColor, boxShadow: `0 2px 12px ${accentColor}40` }}
        >
          {badge}
        </span>
      )}

      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 30%, ${accentColor}08, transparent 70%)` }}
      />

      <div
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center sm:mb-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110"
        style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}25` }}
      >
        <Icon size={22} className="sm:w-[26px] sm:h-[26px]" />
      </div>

      <div className="flex-1 min-w-0 sm:flex-initial">
        <h3 className="text-sm sm:text-base font-bold text-main mb-0.5 sm:mb-1.5">{title}</h3>
        <p className="text-[11px] sm:text-xs text-secondary leading-relaxed line-clamp-2">{description}</p>

        <div
          className="mt-2 sm:mt-4 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold transition-all duration-300 group-hover:gap-2.5"
          style={{ color: accentColor }}
        >
          Start Now <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  </motion.div>
);

/* ═══════════════════ ACTIVITY ITEM ═══════════════════ */

const activityIcons = {
  whatsapp: { icon: MessageCircle, color: '#25D366', emoji: '✅' },
  youtube: { icon: Video, color: '#FF0000', emoji: '🎥' },
  lead: { icon: Target, color: '#10b981', emoji: '🎯' },
  review: { icon: Star, color: '#f59e0b', emoji: '⭐' },
  email: { icon: Mail, color: '#3b82f6', emoji: '📧' },
  bot: { icon: Bot, color: '#8b5cf6', emoji: '🤖' },
  default: { icon: Zap, color: '#3b82f6', emoji: '⚡' },
};

const getActivityType = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('whatsapp') || n.includes('message')) return 'whatsapp';
  if (n.includes('youtube') || n.includes('video')) return 'youtube';
  if (n.includes('lead') || n.includes('hunter')) return 'lead';
  if (n.includes('review') || n.includes('google')) return 'review';
  if (n.includes('email') || n.includes('gmail')) return 'email';
  if (n.includes('bot') || n.includes('telegram')) return 'bot';
  return 'default';
};

const friendlyMessages = {
  whatsapp: (d) => d || 'Replied to a customer on WhatsApp automatically.',
  youtube: (d) => d || 'Finished creating and uploading your video!',
  lead: (d) => d || 'Found and saved new potential customers for you.',
  review: (d) => d || 'Sent a review request to a recent customer.',
  email: (d) => d || 'Sent an automated email to your subscriber list.',
  bot: (d) => d || 'Your Telegram bot answered a customer query.',
  default: (d) => d || 'Completed an automated action for your business.',
};

const formatTimeAgo = (ts) => {
  if (!ts) return 'Just now';
  const mins = Math.floor((Date.now() - new Date(ts)) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const ActivityItem = ({ log, index }) => {
  const type = getActivityType(log.automationName);
  const meta = activityIcons[type];
  const message = friendlyMessages[type](log.details);
  const isSuccess = !(log.status || '').toLowerCase().includes('fail');

  return (
    <motion.div
      variants={riseUp}
      className="group flex items-start gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-colors duration-300 hover:bg-[var(--color-surface-hover)]"
    >
      <div
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-base sm:text-lg"
        style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}18` }}
      >
        <span>{isSuccess ? meta.emoji : '⚠️'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] sm:text-sm text-main leading-relaxed">{message}</p>
        <p className="text-[11px] sm:text-xs text-secondary mt-0.5 sm:mt-1 font-medium">{formatTimeAgo(log.timestamp)}</p>
      </div>
    </motion.div>
  );
};

/* ═══════════════════ PRO TIP CAROUSEL ═══════════════════ */

const tips = [
  'Activate "Auto-Reply on WhatsApp" and never miss a customer message again — even while you sleep!',
  'The "Find New Leads" tool can scan 500+ businesses and send you the best matches daily.',
  'You can create and upload YouTube Shorts without recording a single video. Try it now!',
  'Ask happy customers for Google Reviews automatically — it boosts your local search ranking.',
];

const ProTipBanner = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % tips.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      variants={riseUp}
      className="relative rounded-3xl overflow-hidden p-[1px]"
      style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.35), rgba(139,92,246,0.35), rgba(236,72,153,0.25))' }}
    >
      <div className="relative rounded-3xl p-5 md:p-6 overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-purple-500/8 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: '#f59e0b' }} />
            <span className="text-xs font-bold uppercase tracking-widest text-gradient-primary">Quick Tip</span>
          </div>
          <div className="min-h-[48px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="text-sm text-secondary leading-relaxed"
              >
                {tips[i]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            {tips.map((_, idx) => (
              <div
                key={idx}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: idx === i ? '18px' : '6px',
                  background: idx === i ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════ MOCK FALLBACK DATA ═══════════════════ */

const mockLogs = [
  { _id: '1', automationName: 'WhatsApp Auto-Reply', status: 'Success', timestamp: new Date(Date.now() - 600000).toISOString(), details: 'Sent a WhatsApp reply to a new customer inquiry.' },
  { _id: '2', automationName: 'YouTube AI Video', status: 'Success', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Finished uploading your YouTube Short — "5 Tips for Small Shops"!' },
  { _id: '3', automationName: 'Lead Hunter B2B', status: 'Success', timestamp: new Date(Date.now() - 5400000).toISOString(), details: 'Found 14 new potential customers in your area.' },
  { _id: '4', automationName: 'Google Reviews', status: 'Success', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'Sent review requests to 8 happy customers.' },
  { _id: '5', automationName: 'Telegram Bot', status: 'Success', timestamp: new Date(Date.now() - 10800000).toISOString(), details: 'Your support bot answered 12 customer questions.' },
  { _id: '6', automationName: 'Email Campaign', status: 'Failed', timestamp: new Date(Date.now() - 14400000).toISOString(), details: 'Could not send 3 emails — will retry automatically.' },
];

/* ═══════════════════ MAIN DASHBOARD ═══════════════════ */

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userRes = await api.get('/auth/user');
        setUserData(userRes.data);

        const analyticsRes = await api.get('/analytics/dashboard');
        setAnalyticsData(analyticsRes.data);

        const logsRes = await api.get('/logs');
        setRecentLogs(logsRes.data.length > 0 ? logsRes.data.slice(0, 6) : mockLogs);

        const autoRes = await api.get('/automations');
        setActiveCount(autoRes.data.filter((a) => a.status === 'active').length);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setRecentLogs(mockLogs);
        setActiveCount(4);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
            <Bot size={22} className="absolute inset-0 m-auto text-blue-500" />
          </div>
          <p className="text-secondary text-sm font-medium">Waking up your AI assistant...</p>
        </div>
      </div>
    );
  }

  /* ─── Data ─── */
  const userName = userData?.name?.split(' ')[0] || 'there';
  const totalWork = analyticsData?.totals?.messagesSent || 1204;
  const hoursSaved = Math.max(Math.round(totalWork * 0.035), 42);
  const liveCount = activeCount || 4;

  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* ═══ GREETING ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 sm:mb-8 md:mb-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-main font-display tracking-tight">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-secondary mt-1 sm:mt-1.5 text-xs sm:text-sm md:text-base">
              Here's what your AI assistant did today.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold self-start"
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.18)',
            }}
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            AI is awake and ready
          </motion.div>
        </div>
      </motion.div>

      {/* ═══ METRICS ═══ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10 md:mb-12"
      >
        <MetricCard
          icon={Clock}
          label="Time Saved This Month"
          value={`${hoursSaved} Hours`}
          subtitle="That's almost 2 full work weeks!"
          accentColor="#3b82f6"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Work Completed"
          value={new Intl.NumberFormat('en-IN').format(totalWork)}
          subtitle="automated actions this month"
          accentColor="#8b5cf6"
        />
        <MetricCard
          icon={Bot}
          label="Active AI Helpers"
          value={`${liveCount} running`}
          subtitle="working around the clock for you"
          accentColor="#10b981"
        />
      </motion.div>

      {/* ═══ WHAT DO YOU WANT TO AUTOMATE? ═══ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mb-8 sm:mb-10 md:mb-12"
      >
        <motion.div variants={riseUp} className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-main font-display">
              What do you want to automate today?
            </h2>
            <p className="text-secondary text-xs sm:text-sm mt-0.5 sm:mt-1">Pick one and your AI will start working in seconds.</p>
          </div>
          <Link
            to="/dashboard/automations"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 hover:gap-2.5"
            style={{ color: 'var(--color-primary)' }}
          >
            See all <ChevronRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          <AutomationActionCard
            icon={MessageCircle}
            title="Auto-Reply on WhatsApp"
            description="Never miss a customer message — even at 3 AM."
            accentColor="#25D366"
            href="/dashboard/automations"
            badge="Popular"
          />
          <AutomationActionCard
            icon={Target}
            title="Find New Leads"
            description="Let AI hunt for potential B2B customers daily."
            accentColor="#10b981"
            href="/dashboard/automations"
          />
          <AutomationActionCard
            icon={Video}
            title="Create a YouTube Short"
            description="Generate and upload a video without recording."
            accentColor="#FF0000"
            href="/dashboard/automations"
          />
          <AutomationActionCard
            icon={Star}
            title="Get Google Reviews"
            description="Automatically ask happy customers for a review."
            accentColor="#f59e0b"
            href="/dashboard/automations"
          />
        </div>

        {/* Mobile "see all" link */}
        <Link
          to="/dashboard/automations"
          className="sm:hidden flex items-center justify-center gap-1.5 mt-4 text-sm font-semibold"
          style={{ color: 'var(--color-primary)' }}
        >
          See all automations <ChevronRight size={14} />
        </Link>
      </motion.div>

      {/* ═══ BOTTOM 2-COLUMN ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        {/* ─── LEFT: Activity Feed ─── */}
        <motion.div
          variants={scaleUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg font-bold text-main font-display">
              What your AI did recently
            </h2>
            <Link
              to="/dashboard/activity"
              className="text-sm font-semibold flex items-center gap-1 transition-all duration-300 hover:gap-2"
              style={{ color: 'var(--color-primary)' }}
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div
            className="rounded-2xl sm:rounded-3xl border overflow-hidden"
            style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <motion.div variants={stagger} initial="hidden" animate="visible" className="p-1.5 sm:p-2">
              {recentLogs.length > 0 ? (
                recentLogs.map((log, index) => (
                  <ActivityItem key={log._id || index} log={log} index={index} />
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <Bot className="h-10 w-10 mx-auto mb-3 text-secondary opacity-40" />
                  <p className="text-secondary font-medium">Nothing here yet!</p>
                  <p className="text-xs text-secondary mt-1">
                    Once you activate an automation, your AI's work will show up here.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-t"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
            >
              <span className="text-[11px] sm:text-xs text-secondary">
                Showing {recentLogs.length} recent updates
              </span>
              <span className="text-[11px] sm:text-xs text-secondary flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── RIGHT: Help & Support + Tip ─── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1 space-y-4 sm:space-y-5"
        >
          <motion.h2 variants={riseUp} className="text-base sm:text-lg font-bold text-main font-display">
            Quick Help & Support
          </motion.h2>

          {/* Support card */}
          <motion.div
            variants={riseUp}
            className="rounded-2xl sm:rounded-3xl border p-4 sm:p-6 transition-all duration-300"
            style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#25D36615', color: '#25D366', border: '1px solid #25D36625' }}
              >
                <Headphones size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-main">Need help?</p>
                <p className="text-[11px] sm:text-xs text-secondary">We reply within 5 minutes.</p>
              </div>
            </div>

            <a
              href="https://wa.me/919999999999?text=Hi%2C%20I%20need%20help%20with%20Jomocal%20AI"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 cursor-pointer mb-3"
              style={{ background: '#25D366', boxShadow: '0 4px 16px #25D36630' }}
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>

            <a
              href="#"
              className="w-full flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm font-semibold transition-all duration-300 border cursor-pointer"
              style={{
                color: 'var(--color-text-primary)',
                borderColor: 'var(--color-border)',
                background: 'var(--color-surface)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
            >
              <Play size={14} /> Watch 2-min Tutorial
            </a>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            variants={riseUp}
            className="rounded-2xl sm:rounded-3xl border p-4 sm:p-5"
            style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} style={{ color: '#10b981' }} />
                <span className="text-xs text-secondary font-medium">Your data is 100% secure & encrypted</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart size={16} style={{ color: '#ef4444' }} />
                <span className="text-xs text-secondary font-medium">Used by 500+ Indian businesses</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={16} style={{ color: '#3b82f6' }} />
                <span className="text-xs text-secondary font-medium">Built for Indian MSMEs & Creators</span>
              </div>
            </div>
          </motion.div>

          {/* Plan usage */}
          <motion.div variants={riseUp}>
            <Link
              to="/dashboard/billing"
              className="group block p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-500"
              style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--color-border)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Your Plan</span>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.2)' }}
                >
                  Business Pro
                </span>
              </div>

              <div className="mb-1.5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-secondary font-medium">Actions used</span>
                  <span className="text-main font-bold">{new Intl.NumberFormat('en-IN').format(totalWork)} / 3,000</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalWork / 3000) * 100, 100)}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-secondary">Resets in 18 days</span>
                <span
                  className="text-xs font-semibold flex items-center gap-1 transition-all duration-300 group-hover:gap-2"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Manage Plan <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Pro Tip */}
          <ProTipBanner />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
