import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    MessageSquare,
    Users,
    FileText,
    Zap,
    CheckCircle,
    Bot,
    Play,
    TrendingUp,
    Globe,
    ShoppingBag,
    Sparkles,
    Video,
    Mic,
    UploadCloud,
    ShieldCheck,
    Layers,
    DollarSign
} from 'lucide-react';
import Navbar from '../components/Navbar';

// --- ANIMATION VARIANTS ---
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
        opacity: 1,
        y: 0,
        transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" }
    })
};

const LandingPage = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const [badgeText, setBadgeText] = useState("v2.0 Now Live: AI Video Automation");

    // Badge Rotation Effect
    useEffect(() => {
        const texts = [
            "v2.0 Now Live: AI Video Automation",
            "Now available for MSME's & Creators",
            "Save 20+ Hours Every Week",
            "New: WhatsApp & Instagram Bots"
        ];
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % texts.length;
            setBadgeText(texts[index]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-blue-100 selection:text-blue-700">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <header ref={heroRef} className="relative pt-24 pb-12 md:pt-48 md:pb-40 overflow-hidden">
                <div className="container relative z-10 px-4 text-center max-w-5xl">

                    {/* Rotating Badge */}
                    <div className="h-10 mb-4 md:mb-6 flex justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={badgeText}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[10px] md:text-sm font-semibold shadow-sm cursor-default"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <span>{badgeText}</span>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-slate-900 mb-4 md:mb-6 leading-tight md:leading-[1.1]"
                    >
                        Automate your <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 animate-gradient-x">
                            entire growth.
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-sm sm:text-lg md:text-2xl text-slate-600 mb-6 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed px-4 md:px-0"
                    >
                        <span className="md:hidden">From DMs to YouTube videos—AI handles the busy work.</span>
                        <span className="hidden md:inline">From replying to DMs to creating full YouTube videos—AI Auto Studio handles the busy work so you can focus on building.</span>
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4"
                    >
                        <Link to="/signup" className="btn btn-primary text-sm md:text-lg px-6 md:px-8 py-3 w-full sm:w-auto shadow-xl shadow-blue-500/20 group hover:scale-105 transition-transform duration-200">
                            Start for Free
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="btn btn-secondary text-sm md:text-lg px-6 md:px-8 py-3 w-full sm:w-auto group flex items-center gap-2 hover:bg-slate-50">
                            <Play size={18} className="fill-slate-700 group-hover:fill-blue-600 group-hover:text-blue-600 transition-colors" />
                            See How It Works
                        </button>
                    </motion.div>
                </div>
            </header>

            {/* --- DASHBOARD PREVIEW TRANSLATION --- */}
            <div className="relative -mt-8 md:-mt-32 z-20 px-2 sm:px-4 pb-12 md:pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="relative rounded-xl md:rounded-3xl bg-slate-900/5 p-1 md:p-3 ring-1 ring-inset ring-slate-900/10 backdrop-blur-sm">
                        <div className="rounded-lg md:rounded-2xl overflow-hidden bg-white shadow-2xl border border-slate-200/60 aspect-[16/12] md:aspect-[21/9] relative group">

                            {/* Dashboard Header */}
                            <div className="absolute top-0 left-0 right-0 h-8 md:h-12 bg-white border-b border-slate-100 flex items-center px-3 md:px-4 justify-between z-10">
                                <div className="flex gap-1.5 md:gap-2">
                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-slate-200 group-hover:bg-red-400 transition-colors duration-300"></div>
                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-slate-200 group-hover:bg-amber-400 transition-colors duration-300"></div>
                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-slate-200 group-hover:bg-green-400 transition-colors duration-300"></div>
                                </div>
                            </div>

                            {/* Dashboard Body */}
                            <div className="absolute inset-0 pt-8 md:pt-12 bg-slate-50/50 flex">
                                {/* Sidebar */}
                                <div className="hidden md:flex w-16 lg:w-48 border-r border-slate-100 bg-white flex-col p-3 gap-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`h-8 w-full rounded-lg ${i === 1 ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'}`}></div>
                                    ))}
                                </div>

                                {/* Main Area */}
                                <div className="flex-1 p-3 md:p-6 overflow-hidden relative">
                                    {/* Stats Row */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="bg-white p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-slate-100">
                                                <div className="h-1.5 md:h-2 w-8 md:w-12 bg-slate-100 rounded mb-2"></div>
                                                <div className="h-4 md:h-6 w-16 md:w-20 bg-slate-200 rounded"></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Charts Area */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full">
                                        <div className="md:col-span-2 bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-100 p-4 relative overflow-hidden">
                                            <div className="absolute inset-x-0 bottom-0 top-10 bg-gradient-to-t from-blue-50/50 to-transparent"></div>
                                            {/* Fake Graph Lines */}
                                            <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 flex items-end justify-between px-4 md:px-6 pb-4 md:pb-6 gap-2">
                                                {[40, 60, 45, 70, 50, 80, 65, 85, 90, 70].map((h, i) => (
                                                    <div key={i} className="w-full bg-blue-500 rounded-t-sm opacity-20" style={{ height: `${h}%` }}></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hidden md:block">
                                            <div className="space-y-3">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-100"></div>
                                                        <div className="flex-1 h-2 bg-slate-200 rounded-full w-12"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card: AI Video Generation */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="absolute bottom-3 right-3 md:bottom-6 md:right-10 bg-white p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-slate-100 z-20 w-40 md:w-64"
                            >
                                <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-3">
                                    <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                        <Video size={12} className="md:hidden" />
                                        <Video size={18} className="hidden md:block" />
                                    </div>
                                    <div>
                                        <div className="text-[8px] md:text-xs font-semibold text-slate-500">AI Video Studio</div>
                                        <div className="text-[10px] md:text-sm font-bold text-slate-900">Render Complete</div>
                                    </div>
                                </div>
                                <div className="h-1 md:h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-full animate-pulse"></div>
                                </div>
                            </motion.div>

                            {/* Floating Card: New Lead */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                                className="absolute top-10 left-3 md:top-20 md:left-24 bg-white p-1.5 md:p-3 rounded-lg md:rounded-xl shadow-lg border border-slate-100 z-20 flex items-center gap-2 md:gap-3"
                            >
                                <div className="relative">
                                    <div className="annotated-avatar w-6 h-6 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[10px] md:text-sm">JD</div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div>
                                    <div className="text-[10px] md:text-xs font-bold text-slate-900">New Lead</div>
                                    <div className="text-[8px] md:text-[10px] text-slate-500">From Instagram</div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- TRUSTED BY --- */}
            <section className="py-6 md:py-10 border-y border-slate-200 bg-white shadow-sm overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

                <div className="container mb-6 md:mb-8 text-center">
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Powering 2,500+ Businesses</p>
                </div>

                <div className="flex overflow-hidden relative w-full">
                    {/* Inner container with double width to allow seamless loop */}
                    <div className="animate-marquee flex gap-8 md:gap-24 items-center whitespace-nowrap min-w-full">
                        {/* Logo Set 1 */}
                        {[...Array(6)].map((_, setIndex) => (
                            <React.Fragment key={setIndex}>
                                <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                                    <Globe className="w-5 h-5 md:w-6 md:h-6 text-blue-600" /> <span className="text-lg md:text-xl font-bold text-slate-700 font-display">GlobalScale</span>
                                </div>
                                <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                                    <Layers className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" /> <span className="text-lg md:text-xl font-bold text-slate-700 font-display">StackFlow</span>
                                </div>
                                <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-amber-500" /> <span className="text-lg md:text-xl font-bold text-slate-700 font-display">FastTrack</span>
                                </div>
                                <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" /> <span className="text-lg md:text-xl font-bold text-slate-700 font-display">SecureAI</span>
                                </div>
                                <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-600" /> <span className="text-lg md:text-xl font-bold text-slate-700 font-display">GrowthLab</span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SOLUTIONS FOR WHO? --- */}
            <section className="py-12 md:py-32 bg-slate-50">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
                        <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 text-slate-900 font-display">Tailored for your success</h2>
                        <p className="text-sm md:text-lg text-slate-600 font-light">Whether you run a business or create content, AI Auto Studio adapts your needs.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                        {/* MSME Card */}
                        <motion.div
                            whileHover={{ y: -6 }}
                            className="group p-6 md:p-10 rounded-3xl bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <ShoppingBag size={150} className="md:w-[200px] md:h-[200px]" />
                            </div>
                            <div className="relative z-10">
                                <div className="mb-4 md:mb-6 flex items-center justify-between">
                                    <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] md:text-xs font-bold rounded-full border border-blue-200">FOR MSMEs</span>
                                    <ShoppingBag className="text-blue-200 w-6 h-6 md:hidden" />
                                </div>

                                <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 text-slate-900 font-display">Small Business</h3>
                                <p className="text-xs md:text-base text-slate-600 mb-6 md:mb-8 leading-relaxed">
                                    Automate your customer service and invoices. Focus on strategy, not paperwork.
                                </p>
                                <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                                    <li className="flex items-start gap-2.5 md:gap-3 text-slate-700 font-medium text-xs md:text-base">
                                        <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                        <span>Auto-reply to leads 24/7</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 md:gap-3 text-slate-700 font-medium text-xs md:text-base">
                                        <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                        <span>Automated invoice reminders</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 md:gap-3 text-slate-700 font-medium text-xs md:text-base">
                                        <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                        <span>Capture leads from Maps</span>
                                    </li>
                                </ul>
                                <Link to="/signup?type=business" className="btn btn-outline w-full justify-between group-hover:border-blue-500 group-hover:text-blue-700 text-xs md:text-base py-3">
                                    Automate Business <ArrowRight size={16} />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Creator Card */}
                        <motion.div
                            whileHover={{ y: -6 }}
                            className="group p-6 md:p-10 rounded-3xl bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50 hover:border-purple-500/20 hover:shadow-2xl hover:shadow-purple-900/5 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <Sparkles size={150} className="md:w-[200px] md:h-[200px]" />
                            </div>
                            <div className="relative z-10">
                                <div className="mb-4 md:mb-6 flex items-center justify-between">
                                    <span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-700 text-[10px] md:text-xs font-bold rounded-full border border-purple-200">FOR CREATORS</span>
                                    <Sparkles className="text-purple-200 w-6 h-6 md:hidden" />
                                </div>
                                <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 text-slate-900 font-display">Digital Creators</h3>
                                <p className="text-xs md:text-base text-slate-600 mb-6 md:mb-8 leading-relaxed">
                                    Scale your content production with AI and manage your community without burnout.
                                </p>
                                <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                                    <li className="flex items-start gap-2.5 md:gap-3 text-slate-700 font-medium text-xs md:text-base">
                                        <CheckCircle size={16} className="text-purple-500 shrink-0 mt-0.5" />
                                        <span>AI Video Creation & Upload</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 md:gap-3 text-slate-700 font-medium text-xs md:text-base">
                                        <CheckCircle size={16} className="text-purple-500 shrink-0 mt-0.5" />
                                        <span>Auto-DM product links</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 md:gap-3 text-slate-700 font-medium text-xs md:text-base">
                                        <CheckCircle size={16} className="text-purple-500 shrink-0 mt-0.5" />
                                        <span>Personalized fan engagement</span>
                                    </li>
                                </ul>
                                <Link to="/signup?type=creator" className="btn btn-outline w-full justify-between group-hover:border-purple-500 group-hover:text-purple-700 text-xs md:text-base py-3">
                                    Automate Content <ArrowRight size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES BENTO GRID --- */}
            <section id="features" className="py-12 md:py-24 bg-white relative">
                {/* Decorative Gradient Blob */}
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
                        <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 text-slate-900 font-display">Power-Packed Automation</h2>
                        <p className="text-sm md:text-lg text-slate-600 font-light">
                            Only the most essential tools designed to save you hours every day.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">

                        {/* YouTube AI (Hero Feature) */}
                        <div className="md:col-span-6 lg:col-span-4 card group relative overflow-hidden bg-slate-900 text-white border-slate-800 p-6 md:p-8">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/20 to-transparent"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] md:text-xs font-bold mb-4 md:mb-6 border border-red-500/20">
                                        <Sparkles size={12} /> NEW • V2.0
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 font-display">YouTube AI Automation</h3>
                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-lg">
                                        Auto-create high-quality videos from simple text prompts. Our AI handles scriptwriting, voiceovers, video editing, subtitles, and SEO-optimized uploading.
                                    </p>
                                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                                        <span className="px-2 md:px-3 py-1 bg-slate-800 rounded-lg text-[10px] md:text-xs font-medium text-slate-300 border border-slate-700 flex items-center gap-1"><Mic size={12} /> AI Voiceover</span>
                                        <span className="px-2 md:px-3 py-1 bg-slate-800 rounded-lg text-[10px] md:text-xs font-medium text-slate-300 border border-slate-700 flex items-center gap-1"><Video size={12} /> Auto-Edit</span>
                                        <span className="px-2 md:px-3 py-1 bg-slate-800 rounded-lg text-[10px] md:text-xs font-medium text-slate-300 border border-slate-700 flex items-center gap-1"><UploadCloud size={12} /> Auto-Upload</span>
                                    </div>
                                </div>
                                <div className="flex-1 relative w-full h-48 md:h-64 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shadow-2xl">
                                    {/* Mock Video UI */}
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-red-600 z-20"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                                            <Play size={20} className="fill-white text-white ml-1 md:w-6 md:h-6" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 z-10">
                                        <div className="h-1.5 md:h-2 w-2/3 bg-slate-700 rounded-lg mb-2"></div>
                                        <div className="h-1.5 md:h-2 w-1/2 bg-slate-700 rounded-lg"></div>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] md:text-xs font-bold font-mono">
                                        AI GENERATED
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Features Only */}
                        <BentoCard
                            title="Smart Auto-Replies"
                            desc="Instant, human-like responses for WhatsApp & Instagram."
                            icon={<MessageSquare size={20} />}
                            color="blue"
                            className="md:col-span-3 lg:col-span-2 min-h-[220px]"
                        />

                        <BentoCard
                            title="Lead Capture"
                            desc="Automatically save every potential customer to your CRM."
                            icon={<Users size={20} />}
                            color="green"
                            className="md:col-span-3 lg:col-span-2 min-h-[220px]"
                        />

                        <BentoCard
                            title="Auto-Invoicing"
                            desc="Send invoices and payment reminders on autopilot."
                            icon={<DollarSign size={20} />}
                            color="orange"
                            className="md:col-span-6 lg:col-span-4 min-h-[180px] flex-row items-center"
                        />
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-16 md:py-24 relative overflow-hidden bg-slate-900">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 rounded-full blur-[80px] md:blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="container text-center px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 md:mb-8 tracking-tight font-display">
                            Ready to automate your future?
                        </h2>
                        <p className="text-base md:text-xl text-slate-300 mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                            Join over 2,500 smart businesses and creators who are saving 20+ hours every week.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                            <Link to="/signup" className="btn bg-white text-slate-900 hover:bg-blue-50 text-base md:text-lg px-8 md:px-10 py-3 md:py-5 shadow-2xl shadow-blue-900/20 border-none font-bold">
                                Get Started Free
                            </Link>
                            <Link to="/contact" className="btn bg-transparent text-white border border-slate-700 hover:bg-slate-800 text-base md:text-lg px-8 md:px-10 py-3 md:py-5">
                                Talk to Sales
                            </Link>
                        </div>
                        <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-xs md:text-sm text-slate-400">
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> No credit card required</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Free 14-day trial</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Cancel anytime</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-950 text-slate-400 py-12 md:py-16 border-t border-slate-900 font-sans">
                <div className="container px-4">
                    <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <Link to="/" className="flex items-center gap-2 font-bold text-xl md:text-2xl text-white mb-4 md:mb-6">
                                <Bot size={24} className="text-blue-500 md:w-7 md:h-7" />
                                <span>AI Auto Studio</span>
                            </Link>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6">
                                Empowering businesses and creators with next-gen automation tools.
                            </p>
                            <div className="flex gap-4">
                                <SocialIcon icon={<Globe size={18} />} />
                                <SocialIcon icon={<MessageSquare size={18} />} />
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <h4 className="font-bold text-white mb-6">Platform</h4>
                            <FooterLinks links={['Features', 'Pricing', 'Integrations', 'Changelog']} />
                        </div>

                        <div className="hidden md:block">
                            <h4 className="font-bold text-white mb-6">Resources</h4>
                            <FooterLinks links={['Community', 'Help Center', 'API Docs', 'Status']} />
                        </div>

                        <div className="hidden md:block">
                            <h4 className="font-bold text-white mb-6">Company</h4>
                            <FooterLinks links={['About Us', 'Contact', 'Privacy Policy', 'Terms of Service']} />
                        </div>

                        {/* Mobile Footer Links (Simplified) */}
                        <div className="md:hidden grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-white mb-4">Platform</h4>
                                <FooterLinks links={['Features', 'Pricing', 'Login']} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4">Company</h4>
                                <FooterLinks links={['About', 'Contact', 'Legal']} />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600 text-xs md:text-sm">
                        <p>&copy; {new Date().getFullYear()} AI Auto Studio.</p>
                        <p>Made with ❤️ in India.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- SUBCOMPONENTS ---

const BentoCard = ({ title, desc, icon, color, className = "" }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-green-50 text-green-600 border-green-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`card group relative overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300 p-6 ${className}`}
        >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 md:mb-6 transition-transform group-hover:scale-110 border ${colorClasses[color]} bg-opacity-50`}>
                {/* Clone icon with distinct props if needed, but easier to just Wrap */}
                <div className="scale-90 md:scale-100">{icon}</div>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-xs md:text-sm">{desc}</p>
        </motion.div>
    );
};

const FooterLinks = ({ links }) => (
    <ul className="space-y-2 md:space-y-3">
        {links.map((link) => (
            <li key={link}>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-xs md:text-sm">{link}</a>
            </li>
        ))}
    </ul>
);

const SocialIcon = ({ icon }) => (
    <a href="#" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 transition-colors text-slate-400 hover:text-white">
        {icon}
    </a>
)

export default LandingPage;
