import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Zap,
    Link as LinkIcon,
    Activity,
    CreditCard,
    Settings,
    LogOut,
    Bot,
    Menu,
    X,
    BarChart3,
    MessageSquare,
    Sparkles,
    Sun,
    Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/dashboard/automations', label: 'Automations', icon: <Zap size={20} /> },
        { path: '/dashboard/apps', label: 'Connected Apps', icon: <LinkIcon size={20} /> },
        { path: '/dashboard/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
        { path: '/dashboard/messages', label: 'Message History', icon: <MessageSquare size={20} /> },
        { path: '/dashboard/bot-settings', label: 'Bot Settings', icon: <Sparkles size={20} /> },
        { path: '/dashboard/activity', label: 'Activity Logs', icon: <Activity size={20} /> },
        { path: '/dashboard/billing', label: 'Billing', icon: <CreditCard size={20} /> },
        { path: '/dashboard/settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-body flex text-main transition-colors duration-300">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-main fixed h-full z-10 transition-colors duration-300">
                <div className="p-6 border-b border-main flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center">
                        <img
                            src="/jomocal ai logo.png"
                            alt="Jomocal AI"
                            className="w-20 h-auto object-contain scale-[2.5] translate-x-10"
                        />
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === item.path
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'text-sidebar-secondary hover:bg-sidebar-hover hover:text-sidebar-primary'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-main space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-secondary hover:bg-sidebar-hover hover:text-sidebar-primary transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-header backdrop-blur-md border-b border-main z-20 px-4 py-2 flex items-center justify-between transition-colors duration-300">
                <Link to="/dashboard" className="flex items-center">
                    <img
                        src="/jomocal ai logo.png"
                        alt="Jomocal AI"
                        className="w-20 h-auto object-contain scale-160"
                    />
                </Link>
                <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-2 text-main hover:text-primary transition-colors">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-main hover:text-primary transition-colors">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="bg-sidebar w-72 h-full p-4 shadow-2xl animate-fade-in border-r border-main" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center mb-8 px-2">
                            <img
                                src="/jomocal ai logo.png"
                                alt="Jomocal AI"
                                className="w-20 h-auto object-contain scale-[2.5] translate-x-10"
                            />
                        </div>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === item.path
                                        ? 'bg-blue-500/10 text-blue-500'
                                        : 'text-sidebar-secondary hover:bg-sidebar-hover hover:text-sidebar-primary'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-8"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
