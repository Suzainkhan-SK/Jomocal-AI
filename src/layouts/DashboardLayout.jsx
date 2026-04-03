import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Zap,
    Link as LinkIcon,
    Activity,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    BarChart3,
    MessageSquare,
    Sparkles,
    Sun,
    Moon,
    PanelLeftClose,
    PanelLeftOpen,
    HelpCircle,
    Headphones,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', String(isCollapsed));
    }, [isCollapsed]);

    useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') setIsMobileMenuOpen(false); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/login');
    }, [navigate]);

    /* ── Simple, MSME-friendly page labels ── */
    const navItems = [
        { path: '/dashboard', label: 'Home', icon: LayoutDashboard, exact: true },
        { path: '/dashboard/how-it-works', label: 'How it Works', icon: HelpCircle },
        { path: '/dashboard/automations', label: 'My Automations', icon: Zap },
        { path: '/dashboard/apps', label: 'Connect Apps', icon: LinkIcon },
        { path: '/dashboard/analytics', label: 'Reports', icon: BarChart3 },
        { path: '/dashboard/messages', label: 'Customer Chats', icon: MessageSquare },
        { path: '/dashboard/bot-settings', label: 'AI Bot Setup', icon: Sparkles },
        { path: '/dashboard/activity', label: 'Work History', icon: Activity },
        { path: '/dashboard/support', label: 'Customer Support', icon: Headphones },
        { path: '/dashboard/billing', label: 'Subscription', icon: CreditCard },
        { path: '/dashboard/settings', label: 'Account Settings', icon: Settings },
    ];

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    };

    const NavItem = ({ item, onClick, showTooltip = false }) => {
        const active = isActive(item);
        const Icon = item.icon;
        return (
            <Link
                to={item.path}
                onClick={onClick}
                className="sidebar-nav-item group relative flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-300"
                style={{
                    background: active ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    color: active ? '#3b82f6' : 'var(--color-sidebar-text-secondary)',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'var(--color-sidebar-hover)'; e.currentTarget.style.color = 'var(--color-sidebar-text)'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-sidebar-text-secondary)'; } }}
            >
                {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
                        style={{ background: 'linear-gradient(180deg, #3b82f6, #6366f1)', boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)' }}
                    />
                )}
                <div className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 transition-all duration-300"
                    style={{ background: active ? 'rgba(59, 130, 246, 0.12)' : 'transparent' }}>
                    <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                </div>
                <span className="sidebar-label">{item.label}</span>
                {showTooltip && <span className="sidebar-tooltip">{item.label}</span>}
            </Link>
        );
    };

    return (
        <div className="min-h-screen flex text-main transition-colors duration-400" style={{ background: 'var(--color-background)' }}>
            {/* ═══ Desktop Sidebar ═══ */}
            <aside
                className={`sidebar hidden md:flex flex-col bg-sidebar fixed h-full z-20 ${isCollapsed ? 'collapsed' : ''}`}
                style={{ borderRight: '1px solid var(--color-border)', transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}
            >
                {/* Logo & Toggle Area */}
                <div className="flex items-center justify-between px-4 py-4 min-h-[64px]">
                    <Link to="/dashboard" className="flex items-center overflow-hidden flex-1 mr-2">
                        <div className="sidebar-logo-full w-full">
                            <img src="/jomocal ai logo.png" alt="Jomocal AI" className="h-[48px] sm:h-[60px] lg:h-[72px] max-w-[200px] object-contain object-left pl-1" />
                        </div>
                        <div className="sidebar-logo-mini">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-xs"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#ffffff' }}>J</div>
                        </div>
                    </Link>
                    
                    {/* Hamburger Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300 cursor-pointer flex-shrink-0"
                        style={{ color: 'var(--color-sidebar-text-secondary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-sidebar-hover)'; e.currentTarget.style.color = 'var(--color-sidebar-text)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-sidebar-text-secondary)'; }}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <Menu size={20} />
                    </button>
                </div>

                <div className="mx-3 h-px" style={{ background: 'var(--color-border)' }} />

                {/* Navigation */}
                <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => (
                        <NavItem key={item.path} item={item} showTooltip={isCollapsed} />
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="px-3 py-3 space-y-0.5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <button onClick={toggleTheme}
                        className="sidebar-nav-item group relative w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 cursor-pointer"
                        style={{ color: 'var(--color-sidebar-text-secondary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-sidebar-hover)'; e.currentTarget.style.color = 'var(--color-sidebar-text)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-sidebar-text-secondary)'; }}
                    >
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0">
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </div>
                        <span className="sidebar-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        {isCollapsed && <span className="sidebar-tooltip">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>

                    <button onClick={handleLogout}
                        className="sidebar-nav-item group relative w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 cursor-pointer"
                        style={{ color: '#ef4444' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"><LogOut size={16} /></div>
                        <span className="sidebar-label">Sign Out</span>
                        {isCollapsed && <span className="sidebar-tooltip" style={{ color: '#ef4444' }}>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* ═══ Mobile Header — compact ═══ */}
            <div className="md:hidden fixed top-0 w-full z-30 px-3 py-2 flex items-center justify-between"
                style={{
                    background: 'var(--color-header)', borderBottom: '1px solid var(--color-border)',
                    backdropFilter: 'blur(20px) saturate(1.6)', WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
                }}
            >
                <Link to="/dashboard" className="flex items-center pt-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/jomocal ai logo.png" alt="Jomocal AI" className="h-9 w-auto object-contain" />
                </Link>
                <div className="flex items-center gap-0.5">
                    <button onClick={toggleTheme} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}>
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-primary)' }}>
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* ═══ Mobile Sidebar Overlay ═══ */}
            <div className={`md:hidden fixed inset-0 z-40 transition-all duration-400 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div className="absolute inset-0 transition-opacity duration-400"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: isMobileMenuOpen ? 'blur(4px)' : 'blur(0px)', opacity: isMobileMenuOpen ? 1 : 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className="absolute top-0 left-0 h-full w-64 overflow-y-auto"
                    style={{
                        background: 'var(--color-sidebar)', borderRight: '1px solid var(--color-border)',
                        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        boxShadow: isMobileMenuOpen ? '8px 0 30px rgba(0,0,0,0.2)' : 'none',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center px-4 py-4 border-b min-h-[64px]" style={{ borderColor: 'var(--color-border)' }}>
                        <img src="/jomocal ai logo.png" alt="Jomocal AI" className="h-[44px] w-auto object-contain" />
                    </div>
                    <nav className="px-3 py-3 space-y-0.5">
                        {navItems.map((item) => (
                            <NavItem key={item.path} item={item} onClick={() => setIsMobileMenuOpen(false)} />
                        ))}
                    </nav>
                    <div className="px-3 py-3 mt-auto border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium cursor-pointer"
                            style={{ color: '#ef4444' }}
                        >
                            <div className="flex items-center justify-center w-7 h-7 rounded-lg"><LogOut size={16} /></div>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══ Main Content — USE FULL WIDTH ═══ */}
            <main className={`main-content flex-1 px-3 py-3 md:px-6 md:py-6 pt-[52px] md:pt-6 overflow-y-auto min-h-screen ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
