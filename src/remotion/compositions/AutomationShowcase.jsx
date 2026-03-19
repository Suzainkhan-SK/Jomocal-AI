import React from 'react';
import {
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from 'remotion';

/**
 * AutomationShowcase - Vertical format (9:16) for Reels/Shorts
 * Demonstrates a Jomocal automation activating visually
 * Duration: 10 seconds at 30fps (300 frames)
 */

const platformColors = {
    youtube: { primary: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: '▶' },
    instagram: { primary: '#e879f9', bg: 'rgba(232,121,249,0.15)', icon: '◎' },
    whatsapp: { primary: '#22c55e', bg: 'rgba(34,197,94,0.15)', icon: '✆' },
};

export const AutomationShowcase = ({
    automationName = 'Daily YouTube Shorts Maker',
    description = 'Automatically creates and uploads marketing videos for you.',
    platform = 'youtube',
}) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const colors = platformColors[platform] || platformColors.youtube;

    // ---- Phase animations ----
    // Card slide in (0-40)
    const cardY = spring({ frame, fps, config: { damping: 14, stiffness: 100, mass: 1 }, delay: 10 });
    const cardScale = interpolate(cardY, [0, 1], [0.85, 1]);
    const cardTranslateY = interpolate(cardY, [0, 1], [200, 0]);

    // Toggle animation (frames 60-90)
    const toggleProgress = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const toggleX = interpolate(toggleProgress, [0, 1], [2, 28]);
    const toggleBg = toggleProgress > 0.5 ? colors.primary : '#6b7280';

    // Status text (frames 90+)
    const statusOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Progress bar (frames 100-220)
    const progressWidth = interpolate(frame, [100, 220], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Success checkmark (frames 220+)
    const checkScale = spring({ frame: Math.max(0, frame - 220), fps, config: { damping: 10, stiffness: 150, mass: 0.6 } });
    const checkOpacity = interpolate(frame, [220, 230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Celebration particles (frames 230+)
    const celebrationParticles = Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const delay = i * 2;
        const t = Math.max(0, frame - 230 - delay);
        const r = t * 4;
        const pOpacity = interpolate(t, [0, 5, 30, 50], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
        return {
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r - t * 1.5,
            opacity: pOpacity,
            color: i % 2 === 0 ? colors.primary : '#fbbf24',
        };
    });

    // Overall fade
    const fadeOut = interpolate(frame, [270, 300], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <div
            style={{
                width,
                height,
                background: 'linear-gradient(180deg, #0f172a 0%, #0a0a0c 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Inter', system-ui, sans-serif",
                opacity: fadeOut,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background mesh */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 30%, ${colors.bg} 0%, transparent 50%)` }} />

            {/* Brand watermark */}
            <div style={{
                position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
                fontSize: 28, fontWeight: 800, color: 'rgba(255,255,255,0.1)', letterSpacing: '0.1em',
            }}>
                JOMOCAL AI
            </div>

            {/* Main card */}
            <div
                style={{
                    width: width * 0.85,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 32,
                    padding: 48,
                    transform: `translateY(${cardTranslateY}px) scale(${cardScale})`,
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                }}
            >
                {/* Platform icon */}
                <div style={{
                    width: 80, height: 80, borderRadius: 20,
                    background: colors.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, marginBottom: 32,
                    border: `1px solid ${colors.primary}33`,
                    color: colors.primary,
                }}>
                    {colors.icon}
                </div>

                {/* Automation name */}
                <div style={{ fontSize: 38, fontWeight: 700, color: 'white', marginBottom: 12, lineHeight: 1.2 }}>
                    {automationName}
                </div>
                <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.5 }}>
                    {description}
                </div>

                {/* Toggle row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                        {toggleProgress > 0.5 ? '● Active' : '○ Inactive'}
                    </div>
                    <div style={{
                        width: 60, height: 32, borderRadius: 16,
                        background: toggleBg, position: 'relative',
                        transition: 'background 0.3s',
                        boxShadow: toggleProgress > 0.5 ? `0 0 20px ${colors.primary}66` : 'none',
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 14,
                            background: 'white', position: 'absolute',
                            top: 2, left: toggleX,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }} />
                    </div>
                </div>

                {/* Processing status */}
                {frame >= 90 && (
                    <div style={{ marginTop: 32, opacity: statusOpacity }}>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                            {progressWidth >= 100 ? '✅ Automation is live!' : `Processing... ${Math.round(progressWidth)}%`}
                        </div>
                        <div style={{
                            width: '100%', height: 6, borderRadius: 3,
                            background: 'rgba(255,255,255,0.1)', overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${progressWidth}%`, height: '100%',
                                background: `linear-gradient(90deg, ${colors.primary}, #8b5cf6)`,
                                borderRadius: 3,
                                boxShadow: `0 0 10px ${colors.primary}`,
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Success burst */}
            {frame >= 220 && (
                <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: colors.primary, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transform: `scale(${checkScale})`,
                        opacity: checkOpacity,
                        boxShadow: `0 0 40px ${colors.primary}88`,
                        fontSize: 40, color: 'white',
                    }}>
                        ✓
                    </div>
                    {celebrationParticles.map((p, i) => (
                        <div key={i} style={{
                            position: 'absolute', width: 8, height: 8,
                            borderRadius: '50%', background: p.color,
                            opacity: p.opacity,
                            transform: `translate(${p.x}px, ${p.y}px)`,
                            boxShadow: `0 0 12px ${p.color}`,
                        }} />
                    ))}
                </div>
            )}

            {/* Bottom CTA text */}
            <div style={{
                position: 'absolute', bottom: 100,
                fontSize: 20, fontWeight: 600,
                color: 'rgba(255,255,255,0.3)',
                opacity: interpolate(frame, [240, 260], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
                Powered by Jomocal AI
            </div>
        </div>
    );
};
