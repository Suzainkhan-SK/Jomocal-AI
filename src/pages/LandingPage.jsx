import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
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

// --- Custom Brand SVG Icons ---
const WhatsAppIcon = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const TelegramIcon = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const YoutubeIcon = ({ className, size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = ({ className, size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.975-9.658a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88z" />
  </svg>
);

const FacebookIcon = ({ className, size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const GmailIcon = ({ className, size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
);

const NotionIcon = ({ className, size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.373-2.053-.28L3.013 2.434c-.28.047-.326.28-.28.42zm.513 2.333l.047 15.394c0 .327.233.513.56.513l4.385-.28c.28-.046.466-.233.42-.513V7.754l7.138 10.916c.186.28.42.42.746.42l4.105-.327c.326-.046.466-.28.466-.606V2.62c0-.326-.233-.513-.56-.513l-4.105.28c-.28.046-.466.233-.42.513v13.528L10.383 5.421c-.186-.28-.42-.42-.746-.42l-4.198.326c-.326.047-.466.28-.466.607.094.466.513.606.513.606z"/>
  </svg>
);

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

// --- Hero Typewriter Content ---
const heroContent = [
    {
        head1: "Skip the building.",
        head2: "Just click activate.",
        sub: "Don’t waste hours trying to learn complicated software or hiring expensive agencies. Just select a ready-made AI solution for your business, connect your accounts, and let it work for you."
    },
    {
        head1: "Jomocal AI.",
        head2: "Your 1-Click Automation.",
        sub: "Designed exclusively for small shop owners and creators in India. Stop worrying about complex workflows. Simply pick a pre-built automation, connect, and watch your business grow automatically."
    },
    {
        head1: "No technical skills?",
        head2: "We've got you covered.",
        sub: "You don't need to build AI agents from scratch anymore. We provide a one-tap solution for all your daily tasks so non-technical users can automate effortlessly without any coding knowledge."
    },
    {
        head1: "Built for India.",
        head2: "Automate in seconds.",
        sub: "Focus on growing your business while we handle the repetitive work. Access a store full of ready-to-use AI workflows crafted specifically for the unique needs of Indian MSMEs."
    }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const HeroTypography = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayState, setDisplayState] = useState({ head1: "", head2: "", sub: "" });

    useEffect(() => {
        let active = true;

        const animateSequence = async () => {
            while (active) {
                const target = heroContent[currentIndex];
                const maxSteps = 45; // 45 frames to type everything smoothly and concurrently
                
                // Typing mechanism
                for (let i = 0; i <= maxSteps; i++) {
                    if (!active) return;
                    setDisplayState({
                        head1: target.head1.slice(0, Math.floor((i / maxSteps) * target.head1.length) + 1),
                        head2: target.head2.slice(0, Math.floor((i / maxSteps) * target.head2.length) + 1),
                        sub: target.sub.slice(0, Math.floor((i / maxSteps) * target.sub.length) + 1),
                    });
                    await sleep(35); // Approx 1.5 seconds typing duration
                }
                
                setDisplayState({ head1: target.head1, head2: target.head2, sub: target.sub });

                // Multi-second reading pause 
                await sleep(7000);

                if (!active) return;

                // Fast deletion mechanism
                for (let i = maxSteps; i >= 0; i--) {
                    if (!active) return;
                    setDisplayState({
                        head1: target.head1.slice(0, Math.floor((i / maxSteps) * target.head1.length)),
                        head2: target.head2.slice(0, Math.floor((i / maxSteps) * target.head2.length)),
                        sub: target.sub.slice(0, Math.floor((i / maxSteps) * target.sub.length)),
                    });
                    await sleep(15); 
                }

                if (!active) return;
                
                await sleep(400); // Tiny pause between words

                if (!active) return;
                setCurrentIndex((prev) => (prev + 1) % heroContent.length);
            }
        };

        animateSequence();

        return () => { active = false; };
    }, [currentIndex]);

    return (
        <div className="flex flex-col items-center justify-start w-full min-h-[260px] sm:min-h-[290px] md:min-h-[380px] lg:min-h-[420px]">
            <motion.h1
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[36px] sm:text-[40px] leading-[1.1] md:text-8xl lg:text-[6.5rem] font-display font-extrabold tracking-tight text-main mb-6 px-2 min-h-[90px] sm:min-h-[100px] md:min-h-[230px] lg:min-h-[250px] flex flex-col items-center w-full"
            >
                <div className="w-full text-center">{displayState.head1 || '\u00A0'} <br className="hidden md:block"/></div>
                <div className="w-full text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 md:animate-gradient-x">{displayState.head2 || '\u00A0'}</div>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base sm:text-lg md:text-2xl text-secondary mb-10 max-w-3xl mx-auto font-light leading-relaxed px-4 text-center min-h-[120px] sm:min-h-[100px] flex items-start justify-center"
            >
                {displayState.sub || '\u00A0'}
            </motion.p>
        </div>
    );
};

const LandingPage = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    
    // Add physics-based smoothing to completely eliminate scroll jank
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    
    // Parallax logic
    const heroY = useTransform(smoothProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);
    
    // Dashboard mockup 3D rotation logic
    const dashRotateX = useTransform(smoothProgress, [0, 0.5], [20, 0]);
    const dashScale = useTransform(smoothProgress, [0, 0.5], [0.92, 1]);
    const dashY = useTransform(smoothProgress, [0, 0.5], [60, 0]);

    return (
        <div className="min-h-screen bg-body flex flex-col relative overflow-hidden selection:bg-blue-500/30">
            <Navbar />

            {/* ═══════════════════════ ABSOLUTE STUNNING HERO ═══════════════════════ */}
            <header ref={heroRef} className="relative pt-12 md:pt-28 pb-32 overflow-visible md:overflow-hidden min-h-[95vh] flex flex-col justify-start">
                
                {/* Immersive Background System */}
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                    {/* Perspective Grid with deep vanishing point */}
                    <div className="absolute inset-x-0 bottom-0 h-[80vh] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+Cgk8cGF0aCBkPSJNMCAwbDQwIDBMMDAgNDBsLTQwIDBMMCAwaHoiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjODg4IiBzdHJva2Utd2lkdGg9IjAuMiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] [mask-image:linear-gradient(to_top,white_10%,transparent_90%)] mix-blend-normal md:mix-blend-overlay dark:opacity-[0.15] opacity-30 transform-gpu perspective-1000 rotateX-60 scale-150 translate-y-[20%] will-change-transform"></div>
                    
                    {/* Massive Glowing Orbs */}
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 right-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-[60px] md:blur-[150px] mix-blend-normal md:mix-blend-screen pointer-events-none transform-gpu will-change-transform opacity-60"
                        style={{ translateZ: 0 }}
                    ></motion.div>
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[20%] left-[5%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[60px] md:blur-[130px] mix-blend-normal md:mix-blend-screen pointer-events-none transform-gpu will-change-transform opacity-50"
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
                        <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute left-0 w-10 h-10 rounded-xl bg-white dark:bg-[#111] shadow-xl border border-main flex items-center justify-center text-pink-500 z-10 transform-gpu will-change-transform"><InstagramIcon className="w-5 h-5"/></motion.div>
                        <motion.div animate={{ y: [3, -3, 3] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute left-1/4 w-10 h-10 rounded-xl bg-white dark:bg-[#111] shadow-xl border border-main flex items-center justify-center text-red-500 z-10 transform-gpu will-change-transform"><YoutubeIcon className="w-5 h-5"/></motion.div>
                        <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute right-1/4 w-10 h-10 rounded-xl bg-white dark:bg-[#111] shadow-xl border border-main flex items-center justify-center text-green-500 z-10 transform-gpu will-change-transform"><WhatsAppIcon className="w-5 h-5"/></motion.div>  {/* Replaced MessageSquare with WhatsApp locally */}
                        <motion.div animate={{ y: [2, -2, 2] }} transition={{ duration: 3.8, repeat: Infinity }} className="absolute right-0 w-10 h-10 rounded-xl bg-white dark:bg-[#111] shadow-xl border border-main flex items-center justify-center text-blue-500 z-10 transform-gpu will-change-transform"><FacebookIcon className="w-5 h-5"/></motion.div>
                        
                        {/* Connecting Line */}
                        <div className="absolute inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 z-0"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] z-0"></div>
                    </motion.div>

                    {/* Smooth Multi-State Interactive Typography Box */}
                    <HeroTypography />

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
                <div className="relative z-20 w-full px-2 sm:px-4 md:px-8 mt-12 md:mt-24 perspective-[1000px] md:perspective-[2000px] overflow-visible pb-10">
                    <motion.div 
                        style={{ rotateX: dashRotateX, scale: dashScale, y: dashY }}
                        className="w-full md:w-full ml-0 md:ml-0 max-w-[95%] md:max-w-[70rem] mx-auto xl:ml-auto relative transform-gpu origin-top will-change-transform"
                    >
                        {/* Dramatic Glow under the dashboard */}
                        <div className="absolute -inset-10 bg-gradient-to-b from-blue-600/30 to-purple-600/0 blur-[40px] md:blur-[100px] -z-10 rounded-[3rem] pointer-events-none transform-gpu"></div>
                        
                        {/* Dashboard Frame */}
                        <div className="rounded-[1.5rem] md:rounded-[2.5rem] p-1.5 md:p-2 bg-white/90 dark:bg-[#111]/90 md:bg-gradient-to-b md:from-white/60 md:to-white/10 dark:md:from-white/10 dark:md:to-white/5 border border-white/40 dark:border-white/10 shadow-2xl backdrop-blur-none md:backdrop-blur-lg ring-1 ring-black/5 transform-gpu">
                            <div className="relative rounded-xl md:rounded-[2rem] overflow-hidden bg-white dark:bg-[#0a0a0c] shadow-inner h-auto md:h-auto md:aspect-[16/9] border border-gray-200/50 dark:border-[#222]">
                                
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
                                <div className="pt-14 flex md:absolute md:inset-0 bg-slate-50/50 dark:bg-[#08080A]">
                                    
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
                                    <div className="flex-1 p-3 sm:p-4 md:p-10 relative overflow-hidden md:overflow-y-auto">
                                        <div className="max-w-4xl mx-auto">
                                            <h2 className="text-2xl font-display font-bold text-main mb-2">Available Solutions</h2>
                                            <p className="text-secondary text-sm mb-8">Turn on the switches to let the computer do your daily work.</p>
                                            
                                            <div className="grid grid-cols-1 gap-4">
                                                
                                                {/* Pre-built Automation 1 */}
                                                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 group relative overflow-hidden">
                                                    <div className="absolute inset-y-0 left-0 w-1 bg-green-500"></div>
                                                    <div className="flex items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">
                                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 shrink-0 mt-1 sm:mt-0">
                                                            <YoutubeIcon size={24} className="sm:w-7 sm:h-7" />
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
                                                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 group">
                                                    <div className="flex items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">
                                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-purple-50 dark:bg-purple-500/10 text-purple-500 shrink-0 mt-1 sm:mt-0">
                                                            <InstagramIcon size={24} className="sm:w-7 sm:h-7" />
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
                                                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 group">
                                                    <div className="flex items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">
                                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-green-50 dark:bg-green-500/10 text-green-500 shrink-0 mt-1 sm:mt-0">
                                                            <WhatsAppIcon size={24} className="sm:w-7 sm:h-7" /> {/* Represents WhatsApp */}
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
                                className="absolute top-1/2 right-[20%] z-40 drop-shadow-none md:drop-shadow-2xl transform-gpu will-change-transform"
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
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><YoutubeIcon className="w-6 h-6 md:w-8 md:h-8 text-red-500"/> YouTube</div>
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><InstagramIcon className="w-6 h-6 md:w-8 md:h-8 text-pink-500"/> Instagram</div>
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><WhatsAppIcon className="w-6 h-6 md:w-8 md:h-8 text-green-500"/> WhatsApp</div>
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><GmailIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-500"/> Gmail</div>
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><NotionIcon className="w-6 h-6 md:w-8 md:h-8 text-indigo-500"/> Notion</div>
                                <div className="flex items-center gap-2 md:gap-3 text-base md:text-xl font-display font-extrabold text-main cursor-pointer"><TelegramIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-400"/> Telegram</div>
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
                                    <div className="flex items-center gap-2 text-sm font-semibold bg-white dark:bg-black border border-main rounded-xl px-4 py-2.5 text-main shadow-sm"><YoutubeIcon size={16} className="text-red-500"/> Perfect for Reels</div>
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
