import React from 'react';
import {
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Img,
    staticFile,
} from 'remotion';

/**
 * JomocalIntro - "AI Video Creation" Motion Graphic
 * Showcases how Jomocal AI auto-creates a marketing video:
 *   Phase 1: Logo + Branding intro
 *   Phase 2: User types a simple prompt
 *   Phase 3: AI generates script, voice, and images
 *   Phase 4: Final video rendered and ready
 * Duration: 10 seconds at 30fps (300 frames)
 */

const promptText = "Make a short video about my bakery's fresh bread";
const scriptLines = [
    "🎬 Scene 1: Fresh bread rising in the oven...",
    "🗣 Voice: \"Taste the warmth of handmade bread...\"",
    "📸 Adding images & music automatically...",
];

export const JomocalIntro = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // ═════════ PHASE 1: BRANDING (frames 0–60) ═════════
    const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 80, mass: 0.8 } });
    const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const brandTextOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const brandTextY = interpolate(frame, [20, 40], [15, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const phase1Opacity = interpolate(frame, [50, 65], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // ═════════ PHASE 2: PROMPT TYPING (frames 60–130) ═════════
    const phase2Opacity = interpolate(frame, [60, 75, 125, 140], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const typedChars = Math.floor(interpolate(frame, [75, 120], [0, promptText.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    const cursorBlink = Math.floor(frame / 8) % 2 === 0;
    const sendBtnOpacity = interpolate(frame, [118, 125], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const sendBtnScale = spring({ frame: Math.max(0, frame - 118), fps, config: { damping: 12, stiffness: 150 } });

    // ═════════ PHASE 3: AI PROCESSING (frames 135–220) ═════════
    const phase3Opacity = interpolate(frame, [135, 148, 215, 230], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const progressWidth = interpolate(frame, [148, 210], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Script lines reveal one by one
    const scriptReveals = scriptLines.map((_, i) => {
        const start = 155 + i * 20;
        return {
            opacity: interpolate(frame, [start, start + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            x: interpolate(frame, [start, start + 12], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        };
    });

    // Voice waveform
    const waveAmplitudes = Array.from({ length: 24 }, (_, i) => {
        const waveFrame = Math.max(0, frame - 170);
        return Math.abs(Math.sin((waveFrame * 0.15) + (i * 0.8))) * interpolate(frame, [170, 185, 205, 215], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    });

    // ═════════ PHASE 4: VIDEO READY (frames 225–300) ═════════
    const phase4Opacity = interpolate(frame, [225, 240, 280, 300], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const checkScale = spring({ frame: Math.max(0, frame - 235), fps, config: { damping: 10, stiffness: 120, mass: 0.6 } });
    const videoCardY = interpolate(frame, [225, 245], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Celebration particles
    const particles = Array.from({ length: 10 }, (_, i) => {
        const t = Math.max(0, frame - 240 - i * 1.5);
        const angle = (i / 10) * Math.PI * 2;
        return {
            x: Math.cos(angle) * t * 3,
            y: Math.sin(angle) * t * 3 - t * 0.8,
            opacity: interpolate(t, [0, 5, 25, 40], [0, 1, 0.6, 0], { extrapolateRight: 'clamp' }),
            color: ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'][i % 5],
            size: 4 + (i % 3) * 2,
        };
    });

    // ═════════ BACKGROUND ═════════
    const bgGlowPulse = Math.sin(frame * 0.04) * 0.1 + 0.25;

    return (
        <div style={{
            width, height,
            background: 'linear-gradient(155deg, #06080f 0%, #0c1220 40%, #0a0e1a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
            overflow: 'hidden', position: 'relative',
        }}>
            {/* Dot grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
            }} />

            {/* Ambient glow */}
            <div style={{
                position: 'absolute', width: 1000, height: 800, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                opacity: bgGlowPulse, top: '10%', left: '20%',
            }} />
            <div style={{
                position: 'absolute', width: 700, height: 700, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                opacity: bgGlowPulse * 0.8, bottom: '5%', right: '10%',
            }} />

            {/* ═══ PHASE 1: LOGO & BRANDING ═══ */}
            <div style={{
                position: 'absolute', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                opacity: phase1Opacity, zIndex: 10,
            }}>
                {/* Logo from public folder */}
                <div style={{
                    width: 280, height: 280, borderRadius: 64,
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: `scale(${logoScale})`, opacity: logoOpacity,
                    boxShadow: '0 32px 100px rgba(59,130,246,0.3), 0 0 0 2px rgba(255,255,255,0.08)',
                    marginBottom: 50, overflow: 'hidden',
                }}>
                    <Img src={staticFile('jomocal ai logo.png')} style={{ width: 240, height: 240, objectFit: 'contain' }} />
                </div>
                <div style={{
                    fontSize: 140, fontWeight: 800, color: 'white', letterSpacing: '-0.03em',
                    opacity: brandTextOpacity, transform: `translateY(${brandTextY * 2.5}px)`,
                    background: 'linear-gradient(135deg, #fff 30%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Jomocal AI</div>
                <div style={{
                    fontSize: 48, color: 'rgba(255,255,255,0.4)', marginTop: 24,
                    opacity: brandTextOpacity, transform: `translateY(${brandTextY * 2.5}px)`,
                    letterSpacing: '0.06em',
                }}>AI-Powered Video Creation</div>
            </div>

            {/* ═══ PHASE 2: PROMPT TYPING ═══ */}
            <div style={{
                position: 'absolute', width: width * 0.85, opacity: phase2Opacity, zIndex: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
                <div style={{
                    fontSize: 42, color: 'rgba(255,255,255,0.4)', marginBottom: 40,
                    letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase',
                }}>Step 1: Describe your video</div>

                {/* Input field */}
                <div style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)',
                    border: '2px solid rgba(255,255,255,0.12)', borderRadius: 32,
                    padding: '40px 48px', display: 'flex', alignItems: 'center', gap: 32,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.05)',
                }}>
                    <div style={{ flex: 1, fontSize: 52, color: 'white', fontWeight: 500, lineHeight: 1.4 }}>
                        {promptText.slice(0, Math.floor(typedChars))}
                        {frame >= 75 && frame < 125 && <span style={{ opacity: cursorBlink ? 1 : 0, color: '#3b82f6', fontWeight: 300 }}>|</span>}
                    </div>
                    <div style={{
                        width: 100, height: 100, borderRadius: 28,
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: sendBtnOpacity, transform: `scale(${sendBtnScale})`,
                        boxShadow: '0 10px 30px rgba(59,130,246,0.4)',
                    }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ═══ PHASE 3: AI PROCESSING ═══ */}
            <div style={{
                position: 'absolute', width: width * 0.85, opacity: phase3Opacity, zIndex: 10,
                display: 'flex', flexDirection: 'column', gap: 32,
            }}>
                <div style={{
                    fontSize: 42, color: 'rgba(255,255,255,0.4)', marginBottom: 16,
                    letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase',
                    textAlign: 'center',
                }}>Step 2: AI is creating your video...</div>

                {/* Script lines */}
                {scriptLines.map((line, i) => (
                    <div key={i} style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '2px solid rgba(255,255,255,0.08)',
                        borderRadius: 24, padding: '32px 48px',
                        fontSize: 44, color: 'rgba(255,255,255,0.75)', fontWeight: 500,
                        opacity: scriptReveals[i].opacity,
                        transform: `translateX(${scriptReveals[i].x * 2.5}px)`,
                    }}>{line}</div>
                ))}

                {/* Voice waveform */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, height: 120, marginTop: 20,
                }}>
                    {waveAmplitudes.map((amp, i) => (
                        <div key={i} style={{
                            width: 12, borderRadius: 6,
                            height: 16 + amp * 100,
                            background: `linear-gradient(180deg, #3b82f6, #8b5cf6)`,
                            opacity: 0.7 + amp * 0.3,
                        }} />
                    ))}
                </div>

                {/* Progress bar */}
                <div style={{
                    width: '100%', height: 14, borderRadius: 7,
                    background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginTop: 10,
                }}>
                    <div style={{
                        width: `${progressWidth}%`, height: '100%',
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        borderRadius: 7,
                        boxShadow: '0 0 20px rgba(59,130,246,0.6)',
                    }} />
                </div>
                <div style={{
                    textAlign: 'center', fontSize: 32, color: 'rgba(255,255,255,0.35)',
                    fontWeight: 500,
                }}>{Math.round(progressWidth)}% complete</div>
            </div>

            {/* ═══ PHASE 4: VIDEO READY ═══ */}
            <div style={{
                position: 'absolute', opacity: phase4Opacity, zIndex: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                transform: `translateY(${videoCardY * 2}px)`,
            }}>
                {/* Success icon */}
                <div style={{
                    width: 180, height: 180, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: `scale(${checkScale})`,
                    boxShadow: '0 20px 60px rgba(34,197,94,0.4)',
                    marginBottom: 50,
                }}>
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </div>

                {/* Particles */}
                {particles.map((p, i) => (
                    <div key={i} style={{
                        position: 'absolute', width: p.size * 3, height: p.size * 3,
                        borderRadius: '50%', background: p.color,
                        opacity: p.opacity, transform: `translate(${p.x * 3}px, ${p.y * 3}px)`,
                        boxShadow: `0 0 ${p.size * 8}px ${p.color}80`,
                    }} />
                ))}

                <div style={{
                    fontSize: 86, fontWeight: 800, color: 'white',
                    textAlign: 'center', marginBottom: 20,
                }}>Your Video is Ready! 🎉</div>
                <div style={{
                    fontSize: 42, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 60,
                }}>Uploaded to YouTube automatically</div>

                {/* Mini video card mockup */}
                <div style={{
                    width: 700, background: 'rgba(255,255,255,0.06)',
                    border: '2px solid rgba(255,255,255,0.1)', borderRadius: 36,
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: 400, background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                    }}>
                        <div style={{
                            width: 120, height: 120, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <div style={{
                            position: 'absolute', bottom: 20, right: 20,
                            background: 'rgba(0,0,0,0.7)', color: 'white',
                            padding: '8px 16px', borderRadius: 10, fontSize: 24, fontWeight: 600,
                        }}>0:45</div>
                    </div>
                    <div style={{ padding: '32px 36px' }}>
                        <div style={{ fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 12 }}>
                            Fresh Bread — Your Local Bakery
                        </div>
                        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.4)' }}>
                            Created by Jomocal AI • Just now
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom watermark */}
            <div style={{
                position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: 16, opacity: 0.3,
            }}>
                <div style={{
                    width: 48, height: 48, borderRadius: 12, overflow: 'hidden',
                    background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Img src={staticFile('jomocal ai logo.png')} style={{ width: 44, height: 44, objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: 28, fontWeight: 600, color: 'white', letterSpacing: '0.04em' }}>
                    Jomocal AI
                </span>
            </div>
        </div>
    );
};
