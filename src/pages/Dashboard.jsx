import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import {
  Rocket, PhoneForwarded, Mailbox, Handshake, HeartHandshake, Bot, 
  ChevronDown, CheckCircle2, Star, TrendingUp, Play
} from 'lucide-react';

/* ═══ ANIMATIONS ═══ */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const riseUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ═══ INFINITE TICKER (400+ ITEMS) ═══ */
const names = ["Ramesh", "Priya", "Ankit", "Sanjay", "Manoj", "Arun", "Vikram", "Sneha", "Kiran", "Amit", "Rahul", "Neha", "Pooja", "Rajesh", "Sunil", "Kamal", "Raj", "Anita", "Vivek", "Meenakshi"];
const cities = ["Delhi", "Mumbai", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Patna", "Vadodara", "Ghaziabad", "Ludhiana"];
const businessTypes = ["Electronics", "Boutique", "Traders", "Associates", "Consultants", "Motors", "Enterprises", "Jewellers", "Logistics", "Studios", "Agencies"];
const actions = [
  "activated WhatsApp Auto-Replies — Saving 14 hours/week!", 
  "found 23 new B2B leads using Lead Hunter today.", 
  "sent Google Review requests to 15 recent customers.", 
  "upgraded to the Yearly Business Pro plan!", 
  "closed a high-ticket customer deal automatically!", 
  "generated a professional YouTube Short in seconds.",
  "connected their Shopify store to Jomocal AI successfully.", 
  "saved 5 hours of manual email follow-ups this week!", 
  "set up a 24/7 AI Telegram Bot for customer support.",
  "secured a highly qualified lead using AI outbound.", 
  "linked Razorpay to their automation flow.",
  "auto-replied to 45 Instagram DMs instantly.", 
  "auto-generated a custom Business Proposal email."
];
const emojis = ["🚀", "📈", "⭐", "💼", "💬", "🎥", "🔗", "📧", "⚡", "🔥", "🤝", "💰", "🤖"];

const MOCK_TICKER_DATA = Array.from({ length: 450 }).map(() => {
  const isCompany = Math.random() > 0.6;
  const subject = isCompany 
      ? `${names[Math.floor(Math.random() * names.length)]} ${businessTypes[Math.floor(Math.random() * businessTypes.length)]}` 
      : `${names[Math.floor(Math.random() * names.length)]} from ${cities[Math.floor(Math.random() * cities.length)]}`;
  const action = actions[Math.floor(Math.random() * actions.length)];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  return `${subject} just ${action} ${emoji}`;
});

const LiveSocialProof = () => {
    return (
        <div className="w-full bg-blue-600 text-white overflow-hidden py-2.5 relative flex items-center border-b border-blue-700">
            <div className="absolute left-0 w-8 lg:w-16 h-full bg-gradient-to-r from-blue-600 to-transparent z-10" />
            <div className="absolute right-0 w-8 lg:w-16 h-full bg-gradient-to-l from-blue-600 to-transparent z-10" />
            <div className="flex items-center gap-2 px-4 shadow-sm z-20 bg-blue-700/80 rounded-r-xl border border-blue-500 py-1 mr-4 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Live Activity</span>
            </div>
            
            <motion.div 
                className="flex whitespace-nowrap gap-12 text-[12px] sm:text-[13px] font-medium"
                animate={{ x: [0, -60000] }}
                transition={{ repeat: Infinity, duration: 800, ease: "linear" }}
            >
                {MOCK_TICKER_DATA.map((msg, i) => (
                    <span key={i} className="opacity-90">{msg}</span>
                ))}
            </motion.div>
        </div>
    );
};

/* ═══ ACCORDION CARD ═══ */
const FeatureAccordion = ({ icon: Icon, title, desc, color, active, onClick }) => {
    return (
        <div 
            className={`border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${active ? 'bg-white dark:bg-[#151518] shadow-md border-gray-200 dark:border-gray-700' : 'bg-transparent border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
            onClick={onClick}
        >
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors`}
                         style={{ background: active ? `${color}15` : 'var(--color-surface)', color: active ? color : 'var(--color-text-secondary)' }}>
                        <Icon size={24} strokeWidth={2} />
                    </div>
                    <h3 className={`font-bold text-base sm:text-lg transition-colors ${active ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {title}
                    </h3>
                </div>
                <ChevronDown size={20} className={`transition-transform duration-300 text-gray-400 ${active ? 'rotate-180 text-gray-900 dark:text-white' : ''}`} />
            </div>
            <AnimatePresence>
                {active && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-gray-600 dark:text-gray-300 border-t border-gray-50 dark:border-gray-800 mt-2 pt-4">
                            {desc}
                            
                            <div className="mt-4 flex items-center gap-2">
                                <Link to="/dashboard/how-it-works" className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                                      style={{ background: `${color}15`, color }}>
                                    Learn how it works →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ═══════════════════ DASHBOARD ═══════════════════ */
const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/auth/user');
        setUserData(res.data);
      } catch (err) { }
    })();
  }, []);

  const userName = userData?.name?.split(' ')[0] || 'Business Owner';

  const features = [
      {
          id: 1, icon: PhoneForwarded, color: '#25D366', 
          title: 'Never Miss a Customer (Auto-Replies)',
          desc: 'When a customer messages your business on WhatsApp, Instagram, or Facebook, our AI instantly replies 24/7. It understands their intent, answers pricing questions, and closes deals while you sleep. You never lose a lead to slow response times again.'
      },
      {
          id: 2, icon: Handshake, color: '#3b82f6', 
          title: 'Find New High-Quality Leads',
          desc: 'Our Lead Hunter AI constantly scans the internet for businesses and individuals who need your specific services. It gathers their contact details and can even send them a highly personalized introduction email automatically.'
      },
      {
          id: 3, icon: HeartHandshake, color: '#f59e0b', 
          title: 'Boost Your Google Ratings Automatically',
          desc: 'Having 5-star reviews is crucial for your business. Our AI automatically identifies happy customers after a transaction and friendly requests a Google Review. It handles follow-ups, increasing your positive ratings and local search ranking effortlessly.'
      },
      {
          id: 4, icon: Mailbox, color: '#8b5cf6', 
          title: 'Create Marketing Content Instantly',
          desc: 'Struggling to make social media posts? Tell the AI what your business does, and it will generate full YouTube Shorts, TikToks, and Instagram content and upload it automatically on schedule. You do zero manual recording.'
      }
  ];

  return (
    <div className="w-full pb-16 animate-fade-in">
      <LiveSocialProof />

      <div className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto mt-8">
          
          {/* ═══ HERO SECTION ═══ */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="mb-10 sm:mb-12">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                <motion.div variants={riseUp} className="order-2 lg:order-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 mb-3 sm:mb-4">
                        <Star size={12} className="fill-current" /> India's Best AI for MSMEs
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-3 sm:mb-4 font-display">
                        Grow your business <br className="hidden sm:block"/>while you sleep.
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6 sm:mb-8 max-w-xl font-medium">
                        Welcome to Jomocal AI, {userName}. Consider this your digital 24/7 employee. We automate your customer replies, find you new leads, and grow your sales so you can focus on what really matters.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                        <Link to="/dashboard/how-it-works" className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all sm:hover:-translate-y-0.5">
                            <Play size={16} className="fill-current" /> See How it Works
                        </Link>
                        <Link to="/dashboard/automations" className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-white dark:bg-[#1a1a1f] hover:bg-gray-50 dark:hover:bg-[#202025] text-gray-900 dark:text-white text-sm font-bold rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all sm:hover:-translate-y-0.5">
                            Start Automating
                        </Link>
                    </div>
                </motion.div>

                <motion.div variants={riseUp} className="order-1 lg:order-2 w-full h-[220px] sm:h-[350px] lg:h-[480px] rounded-[24px] lg:rounded-3xl overflow-hidden shadow-2xl relative border border-gray-200 dark:border-gray-800 bg-gray-900">
                    <img src="/dashboard_hero.png" alt="Platform capabilities" className="w-full h-full object-cover opacity-90 scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
                </motion.div>
            </div>
          </motion.div>

          {/* ═══ TWO COLUMN LAYOUT: Accordion & Subscription ═══ */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
              
              {/* Left Column: What can you do? */}
              <div className="lg:col-span-2">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-display mb-2">What you can achieve today</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Expand the cards below to see how Jomocal AI acts as your full-time assistant.</p>
                  </motion.div>
                  
                  <div className="space-y-3">
                      {features.map((feat) => (
                          <FeatureAccordion 
                              key={feat.id}
                              {...feat}
                              active={activeAccordion === feat.id}
                              onClick={() => setActiveAccordion(activeAccordion === feat.id ? null : feat.id)}
                          />
                      ))}
                  </div>
              </div>

              {/* Right Column: Status & Subscription */}
              <div className="lg:col-span-1 space-y-6">
                  
                  {/* Dedicated Plan Card */}
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                      className="bg-white dark:bg-[#111113] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative">
                      <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                      
                      <div className="p-6">
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Current Membership</p>
                          <div className="flex items-center gap-3 mb-6">
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Business Pro</h3>
                              <span className="px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500">
                                  <CheckCircle2 size={10} /> Active
                              </span>
                          </div>

                          <div className="space-y-4 mb-6">
                              <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Monthly Actions</span>
                                  <span className="font-bold text-gray-900 dark:text-white">1,204 / 3,000</span>
                              </div>
                              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '40%' }} />
                              </div>
                              <p className="text-[11px] text-gray-500 text-center">Your plan resets in 18 days.</p>
                          </div>

                          <Link to="/dashboard/billing" className="w-full block text-center py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white rounded-xl transition-colors border border-gray-200 dark:border-gray-700">
                              Manage Subscription
                          </Link>
                      </div>
                  </motion.div>

                  {/* Pro Tip Callout */}
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-3xl p-6 relative overflow-hidden shadow-xl border border-indigo-500/20">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-30" />
                      
                      <div className="relative z-10">
                          <Bot size={28} className="text-indigo-300 mb-4" />
                          <h4 className="text-white font-bold text-lg mb-2">Need a hand to set up?</h4>
                          <p className="text-indigo-200 text-sm leading-relaxed mb-5">
                              Our dedicated platform experts can instantly connect your apps and build your first automation for you completely free.
                          </p>
                          <Link to="/dashboard/support" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
                              Talk to an Expert →
                          </Link>
                      </div>
                  </motion.div>

              </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
