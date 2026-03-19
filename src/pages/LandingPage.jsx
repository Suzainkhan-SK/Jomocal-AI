import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Play, Zap, Users, MessageSquare, Video, Bot,
    Sparkles, ShieldCheck, CheckCircle, Globe, Layers, TrendingUp,
    ChevronRight, Activity, Youtube, Instagram, Facebook, Mail, Link as LinkIcon, Smartphone,
    Check, MousePointerClick, Mic, Rocket, Phone
} from 'lucide-react';
import Navbar from '../components/Navbar';

// --- Reusable Spotlight Wrapper ---
const SpotlightCard = ({ children, className = "", ...props }) => {
    return (
        <div className={`spotlight-card relative overflow-hidden transition-all duration-500 rounded-3xl border border-main bg-surface/60 backdrop-blur-xl hover:border-blue-500/40 group ${className}`} {...props}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="spotlight-bg z-0 pointer-events-none"></div>
            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
};

// --- Animated Counter ---
const AnimatedCounter = ({ target, suffix = "", duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const startTime = Date.now();
                const tick = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.round(eased * target));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref} className="font-display font-bold tracking-tight">{count.toLocaleString()}{suffix}</span>;
};

const LandingPage = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    
    // Parallax logic
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    
    // Dashboard mockup 3D rotation logic
    const dashRotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
    const dashScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
    const dashY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

    return (
        <div className="min-h-screen bg-body flex flex-col relative overflow-hidden selection:bg-blue-500/30">
            <Navbar />

            {/* ═══════════════════════ ABSOLUTE STUNNING HERO ═══════════════════════ */}
            <header ref={heroRef} className="relative pt-12 md:pt-28 pb-32 overflow-hidden min-h-[95vh] flex flex-col justify-start">
                
                {/* Immersive Background System */}
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                    {/* Perspective Grid with deep vanishing point */}
                    <div className="absolute inset-x-0 bottom-0 h-[80vh] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+Cgk8cGF0aCBkPSJNMCAwbDQwIDBMMDAgNDBsLTQwIDBMMCAwaHoiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjODg4IiBzdHJva2Utd2lkdGg9IjAuMiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] [mask-image:linear-gradient(to_top,white_10%,transparent_90%)] mix-blend-overlay dark:opacity-[0.15] opacity-30 transform-gpu perspective-1000 rotateX-60 scale-150 translate-y-[20%] will-change-transform"></div>
                    
                    {/* Massive Glowing Orbs */}
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 right-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-[150px] mix-blend-screen pointer-events-none transform-gpu will-change-transform opacity-60"
                        style={{ translateZ: 0 }}
                    ></motion.div>
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[20%] left-[5%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[130px] mix-blend-screen pointer-events-none transform-gpu will-change-transform opacity-50"
                        style={{ translateZ: 0 }}
                    ></motion.div>
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-body/50 to-body"></div>
                </div>

                <motion.div 
                    style={{ y: heroY, opacity: heroOpacity }} 
                    className="container relative z-10 px-4 text-center max-w-5xl mx-auto flex flex-col items-center"
                >
                    {/* Interactive Connected Apps Graphic */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative mb-8 w-full max-w-[300px] h-16 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute left-0 w-10 h-10 rounded-xl bg-white dark:bg-[#111] shadow-xl border border-main flex items-center justify-center text-pink-500 z-10"><Instagram className="w-5 h-5"/></motion.div>
                        <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute left-1/4 w-10 h-10 rounded-xl bg-white dark:bg-[#111] shadow-xl border border-main flex items-center justify-center text-red-500 z-10"><Youtube className="w-5 h-5"/></motion.div>
                        <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute right-1/4 w-10 h-10 rounded-xl bg-white dark:bg-[#111] shadow-xl border border-main flex items-center justify-center text-green-500 z-10"><Phone className="w-5 h-5"/></motion.div>  {/* Replaced MessageSquare with Phone to signify WhatsApp locally */}
                        <motion.div animate={{ y: [2, -2, 2] }} transition={{ duration: 3.8, repeat: Infinity }} className="absolute right-0 w-10 h-10 rounded-xl bg-white dark:bg-[#111] shadow-xl border border-main flex items-center justify-center text-blue-500 z-10"><Facebook className="w-5 h-5"/></motion.div>
                        
                        {/* Connecting Line */}
                        <div className="absolute inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 z-0"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] z-0"></div>
                    </motion.div>

                    {/* Sensational Linear-Style TypographyHeadline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[36px] sm:text-[40px] leading-[1.1] md:text-8xl lg:text-[6.5rem] font-display font-extrabold tracking-tight text-main mb-6 px-2"
                    >
                        Skip the building. <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-gradient-x">Just click activate.</span>
                    </motion.h1>

                    {/* Crisp Subheadline focusing on UVP. Removed Zapier mention for simplicity */}
                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-base sm:text-lg md:text-2xl text-secondary mb-10 max-w-3xl mx-auto font-light leading-relaxed px-4"
                    >
                        Don’t waste hours trying to learn complicated software or hiring expensive agencies. Just select a ready-made AI solution for your business, connect your accounts, and let it work for you.
                    </motion.p>

                    {/* Conversion CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 z-20"
                    >
                        <Link to="/signup" className="group relative inline-flex items-center justify-center px-6 py-3.5 md:px-8 md:py-4 text-sm sm:text-base md:text-lg font-bold text-white bg-blue-600 rounded-full shadow-[0_0_40px_-5px_rgba(37,99,235,0.4)] overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.6)] w-full sm:w-auto">
                            <span className="relative z-10 flex items-center gap-2">
                                Start Free Trial <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                        </Link>
                        
                        <button className="group relative inline-flex items-center justify-center gap-3 px-6 py-3.5 md:px-8 md:py-4 text-sm sm:text-base md:text-lg font-bold text-main bg-surface/50 backdrop-blur-md border border-main rounded-full hover:bg-black/5 dark:hover:bg-white/5 shadow-xl transition-all w-full sm:w-auto">
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-main text-body">
                                    <Play size={10} className="ml-0.5 fill-current" />
                                </span>
                                See The 1-Click Magic
                            </span>
                        </button>
                    </motion.div>
                </motion.div>

                {/* The Floating App Interface UI - HIGHLIGHTING THE "1-CLICK" NATURE */}
                <div className="relative z-20 w-full px-2 sm:px-4 md:px-8 mt-12 md:mt-24 perspective-[1000px] md:perspective-[2000px] overflow-hidden md:overflow-visible pb-10">
                    <motion.div 
                        style={{ rotateX: dashRotateX, scale: dashScale, y: dashY }}
                        className="w-[125%] md:w-full ml-[-12.5%] md:ml-0 max-w-none md:max-w-[70rem] mx-auto xl:ml-auto relative transform-gpu origin-top will-change-transform"
                    >
                        {/* Dramatic Glow under the dashboard */}
                        <div className="absolute -inset-10 bg-gradient-to-b from-blue-600/30 to-purple-600/0 blur-[100px] -z-10 rounded-[3rem] pointer-events-none transform-gpu"></div>
                        
                        {/* Dashboard Frame */}
                        <div className="rounded-[1.5rem] md:rounded-[2.5rem] p-2 bg-gradient-to-b from-white/60 to-white/10 dark:from-white/10 dark:to-white/5 border border-white/40 dark:border-white/10 shadow-2xl backdrop-blur-lg ring-1 ring-black/5 transform-gpu">
                            <div className="relative rounded-xl md:rounded-[2rem] overflow-hidden bg-white dark:bg-[#0a0a0c] shadow-inner h-[600px] sm:h-[650px] md:h-auto md:aspect-[16/9] border border-gray-200/50 dark:border-[#222]">
                                
                                {/* macOS Header */}
                                <div className="absolute top-0 left-0 right-0 h-14 bg-gray-50/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-[#222] flex items-center px-6 justify-between z-30">
                                    <div className="flex gap-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]"></div>
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]"></div>
                                    </div>
                                    <div className="hidden md:flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-lg px-32 py-2 text-xs font-medium text-secondary shadow-sm">
                                        jomocal.ai/automations
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white dark:border-[#222]"></div>
                                    </div>
                                </div>
                                
                                {/* App Content Mockup - "Store of Automations" Layout */}
                                <div className="absolute inset-0 pt-14 flex bg-slate-50/50 dark:bg-[#08080A]">
                                    
                                    {/* Sidebar */}
                                    <div className="hidden md:flex w-64 border-r border-gray-200/60 dark:border-[#222] bg-white/50 dark:bg-[#0c0c0e]/50 p-6 flex-col justify-between z-20">
                                        <div className="space-y-3">
                                            <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Library</div>
                                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-sm border border-blue-100 dark:border-blue-500/20 shadow-sm">
                                                <Zap size={18} /> Active Solutions
                                            </div>
                                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-secondary hover:bg-white dark:hover:bg-[#111] font-medium text-sm transition-colors cursor-pointer border border-transparent">
                                                <Globe size={18} /> Social Connections
                                            </div>
                                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-secondary hover:bg-white dark:hover:bg-[#111] font-medium text-sm transition-colors cursor-pointer border border-transparent">
                                                <Users size={18} /> Customer Details
                                            </div>
                                        </div>
                                    </div>

                                    {/* Canvas Area - Showing Toggles, NOT Nodes */}
                                    <div className="flex-1 p-4 md:p-10 relative overflow-y-auto">
                                        <div className="max-w-4xl mx-auto">
                                            <h2 className="text-2xl font-display font-bold text-main mb-2">Available Solutions</h2>
                                            <p className="text-secondary text-sm mb-8">Turn on the switches to let the computer do your daily work.</p>
                                            
                                            <div className="grid grid-cols-1 gap-4">
                                                
                                                {/* Pre-built Automation 1 */}
                                                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 group relative overflow-hidden">
                                                    <div className="absolute inset-y-0 left-0 w-1 bg-green-500"></div>
                                                    <div className="flex items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">
                                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 shrink-0 mt-1 sm:mt-0">
                                                            <Youtube size={24} className="sm:w-7 sm:h-7" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="font-bold text-main text-base sm:text-lg leading-tight">Daily YouTube Shorts Maker</h3>
                                                                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-bold shrink-0">ON</span>
                                                            </div>
                                                            <p className="text-secondary text-xs sm:text-sm mt-1">Automatically creates and uploads marketing videos for you.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row-reverse sm:flex-row items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                                                        <div className="hidden lg:flex items-center -space-x-2">
                                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111] bg-gray-100 dark:bg-[#222] flex items-center justify-center"><Check size={14} className="text-green-500"/></div>
                                                        </div>
                                                        {/* Animated Toggle Switch */}
                                                        <div className="relative">
                                                            <div className="w-14 h-8 bg-green-500 rounded-full shadow-inner flex items-center px-1 cursor-pointer">
                                                                <motion.div animate={{ x: 24 }} className="w-6 h-6 bg-white rounded-full shadow-md transform-gpu"></motion.div>
                                                            </div>
                                                            <div className="absolute -inset-4 bg-green-500/20 blur-xl rounded-full z-0 opacity-50 block transform-gpu pointer-events-none"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pre-built Automation 2 */}
                                                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 group">
                                                    <div className="flex items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">
                                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-purple-50 dark:bg-purple-500/10 text-purple-500 shrink-0 mt-1 sm:mt-0">
                                                            <Instagram size={24} className="sm:w-7 sm:h-7" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="font-bold text-main text-base sm:text-lg leading-tight">Instagram Auto-Reply</h3>
                                                            </div>
                                                            <p className="text-secondary text-xs sm:text-sm mt-1">Chats with customers who message you and saves their numbers.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row-reverse sm:flex-row items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                                                        <div className="w-14 h-8 bg-gray-200 dark:bg-[#333] rounded-full shadow-inner flex items-center px-1 cursor-pointer transition-colors group-hover:bg-gray-300 dark:group-hover:bg-[#444]">
                                                            <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pre-built Automation 3 */}
                                                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 group">
                                                    <div className="flex items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">
                                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-green-50 dark:bg-green-500/10 text-green-500 shrink-0 mt-1 sm:mt-0">
                                                            <Phone size={24} className="sm:w-7 sm:h-7" /> {/* Represents WhatsApp */}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="font-bold text-main text-base sm:text-lg leading-tight">WhatsApp Appointment Booking</h3>
                                                            </div>
                                                            <p className="text-secondary text-xs sm:text-sm mt-1">Automatically books meetings right inside WhatsApp chat.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row-reverse sm:flex-row items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                                                        <div className="w-14 h-8 bg-gray-200 dark:bg-[#333] rounded-full shadow-inner flex items-center px-1 cursor-pointer">
                                                            <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Cursor proving it's easy */}
                            <motion.div 
                                animate={{ x: [0, 80, 0], y: [0, -30, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/2 right-[20%] z-40 drop-shadow-2xl transform-gpu will-change-transform"
                            >
                                <MousePointerClick className="w-10 h-10 text-main fill-body" />
                                <div className="absolute top-8 left-6 bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-xl border border-white/20">Just 1 Click</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* ═══════════════════════ LOGO STRIP ═══════════════════════ */}
            <section className="py-10 border-y border-main bg-surface/30 backdrop-blur-md relative overflow-hidden z-20">
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-body to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-body to-transparent z-10 pointer-events-none"></div>
                
                <div className="container px-4 text-center mb-6">
                    <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase">Integrates instantly with platforms you already use</p>
                </div>
                
                {/* INFINITE MARQUEE FIX */}
                <div className="flex overflow-hidden relative w-full group pt-2 pb-4 md:py-0">
                    <div className="flex animate-marquee min-w-max items-center">
                        {[...Array(2)].map((_, idx) => (
                            <div key={idx} className="flex gap-8 md:gap-24 px-4 md:px-8 items-center justify-around opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><Youtube className="w-6 h-6 md:w-8 md:h-8 text-red-500"/> YouTube</div>
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><Instagram className="w-6 h-6 md:w-8 md:h-8 text-pink-500"/> Instagram</div>
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><Phone className="w-6 h-6 md:w-8 md:h-8 text-green-500"/> WhatsApp</div>
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><Mail className="w-6 h-6 md:w-8 md:h-8 text-blue-500"/> Gmail</div>
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><Layers className="w-6 h-6 md:w-8 md:h-8 text-indigo-500"/> Notion</div>
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><Users className="w-6 h-6 md:w-8 md:h-8 text-blue-400"/> Telegram</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ HOW IT WORKS (3 STEPS) ═══════════════════════ */}
            <section className="py-24 md:py-36 relative bg-body z-10">
                <div className="container px-4 max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-main mb-6 leading-tight tracking-tight">
                            Build an automation empire.<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Without writing a single rule.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-secondary font-light max-w-2xl mx-auto">
                            Other software is too complicated and hard to learn. Jomocal AI does all the heavy lifting for you. Just 3 simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20 z-0 rounded-full"></div>
                        <div className="hidden md:block absolute top-[60px] left-[15%] w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-10 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] motion-safe:animate-[expand_2s_ease-out_forwards]" style={{ animationTimeline: 'view()', animationRange: 'cover 0% cover 50%' }}></div>

                        {/* Step 1 */}
                        <div className="relative z-20 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-3xl bg-surface border border-main shadow-xl flex items-center justify-center mb-8 relative group-hover:-translate-y-2 transition-transform duration-300">
                                <LinkIcon size={32} className="text-blue-500" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center shadow-lg border-2 border-body text-sm">1</div>
                            </div>
                            <h3 className="text-2xl font-bold text-main mb-3">Login Safely</h3>
                            <p className="text-secondary leading-relaxed px-4">Securely connect your store, YouTube, Instagram, or WhatsApp account with a simple click.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-20 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-3xl bg-surface border border-main shadow-xl flex items-center justify-center mb-8 relative group-hover:-translate-y-2 transition-transform duration-300">
                                <Layers size={32} className="text-purple-500" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center shadow-lg border-2 border-body text-sm">2</div>
                            </div>
                            <h3 className="text-2xl font-bold text-main mb-3">Choose Solution</h3>
                            <p className="text-secondary leading-relaxed px-4">Browse our massive library of ready-made business apps designed specially for Indian business owners.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-20 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-3xl bg-surface border border-main shadow-xl flex items-center justify-center mb-8 relative group-hover:-translate-y-2 transition-transform duration-300">
                                <div className="absolute inset-0 bg-green-500/20 rounded-3xl blur-md group-hover:blur-xl transition-all"></div>
                                <Zap size={32} className="text-green-500 relative z-10" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow-lg border-2 border-body text-sm z-20">3</div>
                            </div>
                            <h3 className="text-2xl font-bold text-main mb-3">Turn Switch ON</h3>
                            <p className="text-secondary leading-relaxed px-4">Click the switch. The computer starts doing your daily marketing, replies, and lead collection automatically.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ BENTO GRID FEATURES (SIMPLIFIED FOR MSMES) ═══════════════════════ */}
            <section id="features" className="py-24 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[20%] right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20 relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-6 border border-blue-500/20 uppercase tracking-widest">
                            Ready-To-Use Solutions
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-main mb-6 leading-tight tracking-tight">
                            Run your entire business.<br/>
                            <span className="text-secondary">From one simple dashboard.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(300px,auto)] gap-6 max-w-7xl mx-auto">
                        
                        {/* FEATURE 1: VIDEO AI (LARGE) */}
                        <SpotlightCard className="md:col-span-8 p-6 sm:p-8 md:p-12 flex flex-col justify-between overflow-visible">
                            <div className="relative z-20 max-w-lg mb-8">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 md:mb-8 shadow-lg shadow-red-500/20">
                                    <Video size={24} className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-display font-bold text-main mb-4">Make Marketing Videos Without Face</h3>
                                <p className="text-secondary text-sm sm:text-base md:text-lg mb-8 leading-relaxed">
                                    Type a simple sentence about your product, and our smart AI creates a complete, professional video. It writes the script, speaks in a clear local voice, and adds images—ready for you to upload on YouTube or Instagram Reels instantly!
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold bg-white dark:bg-black border border-main rounded-xl px-4 py-2.5 text-main shadow-sm"><Mic size={16} className="text-blue-500"/> Beautiful Voices</div>
                                    <div className="flex items-center gap-2 text-sm font-semibold bg-white dark:bg-black border border-main rounded-xl px-4 py-2.5 text-main shadow-sm"><Youtube size={16} className="text-red-500"/> Perfect for Reels</div>
                                </div>
                            </div>
                            
                            {/* Visual Asset floating right */}
                            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 md:opacity-100 pointer-events-none hidden md:block">
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-surface/60 to-surface z-10"></div>
                                <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-12 -right-16 w-80 h-64 bg-black rounded-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rotate-[-5deg] p-1">
                                    {/* Mock Video UI */}
                                    <div className="w-full h-full bg-[#111] rounded-xl relative overflow-hidden flex flex-col">
                                        <div className="h-40 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center relative">
                                            <div className="absolute inset-0 bg-black/40"></div>
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative z-10"><Play className="text-white fill-white" size={24}/></div>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-lg border border-white/20 text-white font-bold text-sm backdrop-blur">"Grow Your Views"</div>
                                        </div>
                                        <div className="p-4 flex-1">
                                            <div className="h-2 w-full bg-[#333] rounded-full overflow-hidden"><div className="w-1/3 h-full bg-red-500"></div></div>
                                            <div className="flex justify-between mt-2 text-[#777] text-xs font-mono"><span>Processing...</span><span>Done</span></div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </SpotlightCard>

                        {/* FEATURE 2: AUTO DMs */}
                        <SpotlightCard className="md:col-span-4 p-6 sm:p-8 bg-gradient-to-b from-surface to-indigo-500/5">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-6 md:mb-8 shadow-lg shadow-indigo-500/20">
                                <Bot size={24} className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-display font-bold text-main mb-3 md:mb-4">Automatic WhatsApp Replies</h3>
                            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
                                Never miss a customer again. When someone asks for price or details on WhatsApp or Instagram, our auto-reply bot replies immediately, day or night, just like a human assistant.
                            </p>
                            <Link to="/features" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-3 transition-all mt-auto">
                                View Chat Features <ArrowRight size={16} />
                            </Link>
                        </SpotlightCard>

                        {/* FEATURE 3: CRM */}
                        <SpotlightCard className="md:col-span-4 p-8 bg-gradient-to-b from-surface to-green-500/5">
                            <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mb-8 shadow-lg shadow-green-500/20">
                                <Users size={24} />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-main mb-4">Auto-Save Customer Details</h3>
                            <p className="text-secondary text-base leading-relaxed mb-6">
                                Stop writing down phone numbers manually! Jomocal silently saves the phone numbers and names from your chats directly into a neat list so you can call them later.
                            </p>
                        </SpotlightCard>

                        {/* FEATURE 4: PRE-BUILT LIBRARY */}
                        <SpotlightCard className="md:col-span-8 p-8 md:p-12">
                            <div className="relative z-20 flex flex-col md:flex-row gap-8 items-center h-full">
                                <div className="flex-1">
                                    <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-8 shadow-lg shadow-amber-500/20">
                                        <Layers size={24} />
                                    </div>
                                    <h3 className="text-3xl font-display font-bold text-main mb-4">A Store Full of Ready Solutions</h3>
                                    <p className="text-secondary text-lg leading-relaxed mb-8">
                                        Need more stuff done? We have ready-made apps for managing Facebook posts, sending automatic invoices, and booking appointments. Browse our store, flip the switch, and relax.
                                    </p>
                                </div>
                                <div className="flex-1 w-full relative h-[250px] flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent blur-2xl"></div>
                                    <div className="grid grid-cols-2 gap-4 w-full px-4">
                                        {[1,2,3,4].map((i) => (
                                            <div key={i} className="bg-surface border border-main rounded-xl p-3 shadow-sm flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shadow-lg"><CheckCircle size={14} className="text-white"/></div>
                                                <div className="flex flex-col gap-1 w-full">
                                                    <div className="h-2 w-16 bg-main/20 rounded-full"></div>
                                                    <div className="h-1.5 w-10 bg-main/10 rounded-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>

                    </div>
                </div>
            </section>

            {/* ═══════════════════════ STATS & PROOF (SIMPLIFIED) ═══════════════════════ */}
            <section className="py-24 border-y border-main bg-surface/30 backdrop-blur-sm relative overflow-hidden">
                <div className="container relative z-10 px-4">
                    <div className="text-center mb-12">
                        <p className="text-secondary font-medium tracking-widest uppercase">Trusted By Smart Business Owners Across India</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center divide-x-0 md:divide-x divide-main">
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-4xl md:text-6xl text-main font-semibold mb-2"><AnimatedCounter target={2.5} suffix="M+" /></h3>
                            <p className="text-[10px] sm:text-[11px] md:text-sm font-medium text-secondary uppercase tracking-widest mt-1">Customer Messages</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-4xl md:text-6xl text-main font-semibold mb-2"><AnimatedCounter target={99} suffix=".9%" /></h3>
                            <p className="text-[10px] sm:text-[11px] md:text-sm font-medium text-secondary uppercase tracking-widest mt-1">Platform Reliability</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-4xl md:text-6xl text-main font-semibold mb-2"><AnimatedCounter target={150} suffix="+" /></h3>
                            <p className="text-[10px] sm:text-[11px] md:text-sm font-medium text-secondary uppercase tracking-widest mt-1">App Connections</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-4xl md:text-6xl text-main font-semibold mb-2"><AnimatedCounter target={40} suffix="k+" /></h3>
                            <p className="text-[10px] sm:text-[11px] md:text-sm font-medium text-secondary uppercase tracking-widest mt-1">Happy Businesses</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ FINAL MASSIVE CTA (NON-TECH FRIENDLY) ═══════════════════════ */}
            <section className="py-24 md:py-40 relative overflow-hidden flex items-center justify-center">
                
                {/* Stunning Glowing Background */}
                <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900/40 opacity-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[800px] md:h-[500px] bg-blue-600/30 dark:bg-blue-600/60 blur-[150px] rounded-[100%] pointer-events-none z-0"></div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="container relative z-10 px-4 max-w-5xl"
                >
                    <div className="bg-surface/80 dark:bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-6 sm:p-10 md:p-24 text-center shadow-2xl relative overflow-hidden ring-1 ring-black/5">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
                        
                        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-blue-500/10 rounded-full mb-6 sm:mb-8">
                            <Rocket size={32} className="text-blue-500 sm:w-10 sm:h-10" />
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-7xl font-display font-extrabold text-main mb-6 sm:mb-8 tracking-tighter leading-tight">
                            Start growing your <br className="hidden md:block"/>
                            business today.
                        </h2>
                        <p className="text-base sm:text-lg md:text-2xl text-secondary mb-8 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-2">
                            Stop doing manual typing all day. Just select what you need, turn it on, and let Jomocal handle your daily tasks.
                        </p>
                        
                        <div className="flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6">
                            <Link to="/signup" className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-xl font-bold text-white bg-blue-600 rounded-full shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] overflow-hidden transition-all hover:scale-[1.03] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] w-full sm:w-auto">
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started For Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </div>
                        <p className="mt-8 text-sm text-secondary font-medium">No Card Required • Simple Setup • Cancel Anytime</p>
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════════ FOOTER ═══════════════════════ */}
            <footer className="bg-surface/50 border-t border-main py-16 relative z-10 backdrop-blur-md">
                <div className="container px-4">
                    <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-16">
                        <div className="col-span-2 md:col-span-12 lg:col-span-4">
                            <Link to="/" className="inline-block mb-6">
                                <img src="/jomocal ai logo.png" alt="Jomocal AI" className="h-8 md:h-10 w-auto scale-[1.5] origin-left object-contain" />
                            </Link>
                            <p className="text-secondary max-w-sm mb-8 text-sm leading-relaxed font-medium">
                                Jomocal AI provides the easiest software solutions for Indian business owners to increase their sales online without any technical skills.
                            </p>
                            <div className="flex gap-3">
                                <a href="#" className="w-10 h-10 rounded-full bg-body border border-main flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 text-secondary hover:text-blue-500 transition-colors shadow-sm"><Globe size={18} /></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-body border border-main flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 text-secondary hover:text-blue-500 transition-colors shadow-sm"><MessageSquare size={18} /></a>
                            </div>
                        </div>

                        <div className="md:col-span-4 lg:col-span-2 lg:col-start-6">
                            <h4 className="font-bold text-main mb-6 font-display text-base tracking-widest uppercase">Solutions</h4>
                            <ul className="space-y-4 text-sm font-medium text-secondary">
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Video Maker</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">WhatsApp Bot</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Customer List</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Pricing Plans</a></li>
                            </ul>
                        </div>

                        <div className="md:col-span-4 lg:col-span-2">
                            <h4 className="font-bold text-main mb-6 font-display text-base tracking-widest uppercase">Useful Links</h4>
                            <ul className="space-y-4 text-sm font-medium text-secondary">
                                <li><a href="#" className="hover:text-blue-500 transition-colors">How to Use</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Video Guides</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Support Team</a></li>
                            </ul>
                        </div>

                        <div className="col-span-2 md:col-span-4 lg:col-span-2">
                            <h4 className="font-bold text-main mb-6 font-display text-base tracking-widest uppercase">Company</h4>
                            <ul className="space-y-4 text-sm font-medium text-secondary">
                                <li><a href="#" className="hover:text-blue-500 transition-colors">About Jomocal</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Rules</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Use</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-main flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-semibold text-secondary">
                        <p>© {new Date().getFullYear()} Jomocal Technologies Pvt. Ltd. All rights reserved.</p>
                        <p className="flex items-center gap-1">Crafted with <span className="text-blue-500">♥</span> in India</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
