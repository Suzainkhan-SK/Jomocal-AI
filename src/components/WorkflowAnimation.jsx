import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Brain,
    Globe,
    Database,
    MessageSquare,
    Search,
    Video,
    Share2,
    Settings,
    Layers,
    Sparkles
} from 'lucide-react';

const WorkflowAnimation = () => {
    const [animationStep, setAnimationStep] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile for responsive layout
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);



    // Layout: Triangle/Surround to avoid center text
    // Nodes: 0 (Left), 1 (Right), 2 (Bottom)
    const phases = useMemo(() => [
        {
            name: "Content Creation",
            nodes: [
                { id: 'idea', desktop: { x: 15, y: 25 }, mobile: { x: 15, y: 15 }, icon: <Brain />, label: 'AI Concept', color: '#38bdf8' },
                { id: 'video', desktop: { x: 85, y: 25 }, mobile: { x: 85, y: 15 }, icon: <Video />, label: 'Production', color: '#818cf8' },
                { id: 'publish', desktop: { x: 50, y: 85 }, mobile: { x: 50, y: 90 }, icon: <Share2 />, label: 'Distribution', color: '#c084fc' },
            ],
            connections: [
                { from: 'idea', to: 'video', curve: 'up' },
                { from: 'video', to: 'publish', curve: 'right-down' },
                { from: 'publish', to: 'idea', curve: 'left-up', dashed: true } // Return loop
            ]
        },
        {
            name: "Smart Support",
            nodes: [
                { id: 'inquiry', desktop: { x: 15, y: 30 }, mobile: { x: 15, y: 20 }, icon: <MessageSquare />, label: 'Inbound', color: '#38bdf8' },
                { id: 'processing', desktop: { x: 85, y: 30 }, mobile: { x: 85, y: 20 }, icon: <Settings />, label: 'Processing', color: '#818cf8' },
                { id: 'reply', desktop: { x: 50, y: 80 }, mobile: { x: 50, y: 85 }, icon: <Zap />, label: 'Resolution', color: '#34d399' },
            ],
            connections: [
                { from: 'inquiry', to: 'processing', curve: 'up' },
                { from: 'processing', to: 'reply', curve: 'right-down' },
                { from: 'reply', to: 'inquiry', curve: 'left-up', dashed: true }
            ]
        },
        {
            name: "Business Logic",
            nodes: [
                { id: 'data', desktop: { x: 15, y: 35 }, mobile: { x: 15, y: 25 }, icon: <Database />, label: 'Sources', color: '#38bdf8' },
                { id: 'filter', desktop: { x: 85, y: 35 }, mobile: { x: 85, y: 25 }, icon: <Layers />, label: 'Analysis', color: '#818cf8' },
                { id: 'action', desktop: { x: 50, y: 75 }, mobile: { x: 50, y: 80 }, icon: <Globe />, label: 'Action', color: '#f472b6' },
            ],
            connections: [
                { from: 'data', to: 'filter', curve: 'up' },
                { from: 'filter', to: 'action', curve: 'right-down' },
                { from: 'action', to: 'data', curve: 'left-up', dashed: true }
            ]
        }
    ], []);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationStep(prev => (prev + 1) % phases.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [phases.length]);

    const activePhase = phases[animationStep];

    // Helper to calculate bezier path
    const getPath = (start, end, curveType) => {
        const sx = start.x;
        const sy = start.y;
        const ex = end.x;
        const ey = end.y;

        // Control points
        let cx1, cy1, cx2, cy2;

        if (curveType === 'up') {
            // Curve upwards between horizontal points
            cx1 = sx + (ex - sx) * 0.25;
            cy1 = Math.min(sy, ey) - 20;
            cx2 = sx + (ex - sx) * 0.75;
            cy2 = Math.min(sy, ey) - 20;
        } else if (curveType === 'right-down') {
            // Curve from right to bottom center
            cx1 = sx;
            cy1 = ey;
            cx2 = ex + 20;
            cy2 = sy;
        } else {
            // General curve
            cx1 = sx + (ex - sx) / 2;
            cy1 = sy - 20;
            cx2 = ex - (ex - sx) / 2;
            cy2 = ey + 20;
        }

        // Simple Quad or Cubic Bezier
        // Using straight cubic for smoother frame:
        // M start C c1 c2 end
        // Adjusting for percentage based coordinates
        return `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${ex} ${ey}`;
    };

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {/* Subtle Gradient Back */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent dark:from-transparent" />

            <svg className="absolute inset-0 w-full h-full opacity-20 blur-[0.5px]">
                <defs>
                    <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                        <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <AnimatePresence mode="wait">
                    <motion.g
                        key={animationStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {activePhase.connections.map((conn, i) => {
                            if (conn.dashed) return null; // Skip return loop visuals for cleaner look

                            const start = activePhase.nodes.find(n => n.id === conn.from);
                            const end = activePhase.nodes.find(n => n.id === conn.to);
                            if (!start || !end) return null;

                            const sPos = isMobile ? start.mobile : start.desktop;
                            const ePos = isMobile ? end.mobile : end.desktop;

                            // Calculate Path D
                            // This logic works with percentages directly in SVG if viewBox was used, 
                            // but here we are using % in x1/y1 which doesn't work for path d.
                            // We need to use vector-effect or just use simple lines if path is too complex.
                            // OR: render SVG with viewBox="0 0 100 100" and preserveAspectRatio="none"
                            // This allows 0-100 coordinates to work perfectly.
                        })}
                    </motion.g>
                </AnimatePresence>
            </svg>

            {/* SVG with 0-100 Coordinate System for Paths */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="line-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
                        <stop offset="0" stopColor="#0ea5e9" stopOpacity="0" />
                        <stop offset="0.5" stopColor="#6366f1" stopOpacity="0.5" />
                        <stop offset="1" stopColor="#ec4899" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <AnimatePresence mode="wait">
                    <motion.g
                        key={animationStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {activePhase.connections.map((conn, i) => {
                            if (conn.dashed) return null;
                            const start = activePhase.nodes.find(n => n.id === conn.from);
                            const end = activePhase.nodes.find(n => n.id === conn.to);
                            if (!start || !end) return null;

                            const sPos = isMobile ? start.mobile : start.desktop;
                            const ePos = isMobile ? end.mobile : end.desktop;

                            // Custom Curve Logic for 0-100 space
                            // Top Horizontal
                            let d = "";
                            if (Math.abs(sPos.y - ePos.y) < 10) {
                                // Horizontal-ish (Top)
                                d = `M ${sPos.x} ${sPos.y} Q 50 -10 ${ePos.x} ${ePos.y}`;
                            } else {
                                // Vertical / Diagonal
                                d = `M ${sPos.x} ${sPos.y} Q ${sPos.x} ${ePos.y} ${ePos.x} ${ePos.y}`;
                            }

                            return (
                                <g key={i}>
                                    {/* Base Line */}
                                    <motion.path
                                        d={d}
                                        fill="none"
                                        stroke="url(#line-gradient)"
                                        strokeWidth="0.2" // thinner
                                        initial={{ pathLength: 0, opacity: 0.3 }}
                                        animate={{ pathLength: 1, opacity: 0.6 }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                    />
                                    {/* Moving Particle */}
                                    <motion.circle r="0.6" fill="#4ade80" filter="drop-shadow(0 0 2px #4ade80)">
                                        <animateMotion dur="2s" repeatCount="indefinite" path={d}>
                                            <mpath />
                                        </animateMotion>
                                    </motion.circle>
                                </g>
                            );
                        })}
                    </motion.g>
                </AnimatePresence>
            </svg>

            {/* Nodes */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={animationStep}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    {activePhase.nodes.map((node) => {
                        const pos = isMobile ? node.mobile : node.desktop;
                        return (
                            <div
                                key={node.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                            >
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="relative flex flex-col items-center group cursor-default pointer-events-auto"
                                >
                                    <div className={`
                                        relative w-8 h-8 md:w-14 md:h-14 rounded-2xl flex items-center justify-center
                                        bg-white/80 dark:bg-blue-950/40 backdrop-blur-sm 
                                        border border-slate-200 dark:border-blue-500/20
                                        shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(59,130,246,0.1)]
                                        group-hover:scale-105 group-hover:border-blue-500/30 dark:group-hover:border-blue-400/30
                                        group-hover:shadow-[0_10px_25px_rgba(56,189,248,0.15)] dark:group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]
                                        transition-all duration-300
                                    `}>
                                        <div className="text-slate-600 dark:text-blue-200 opacity-90 group-hover:opacity-100 transition-opacity">
                                            {React.cloneElement(node.icon, {
                                                size: isMobile ? 16 : 24,
                                                color: node.color
                                            })}
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                        <span className="text-[10px] md:text-xs font-medium text-slate-600 dark:text-blue-200 bg-white/90 dark:bg-blue-950/80 px-2 py-1 rounded-md border border-slate-200 dark:border-blue-500/20 shadow-md">
                                            {node.label}
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>


        </div >
    );
};

export default WorkflowAnimation;
