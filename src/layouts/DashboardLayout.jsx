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
    Sparkles
} from 'lucide-react';

const DashboardLayout = () => {
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
        <div className="min-h-screen bg-bg-body flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border fixed h-full z-10">
                <div className="p-6 border-b border-border">
                    <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Bot size={28} />
                        <span>AI Auto Studio</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                                ? 'bg-primary-light text-primary'
                                : 'text-text-secondary hover:bg-gray-50 hover:text-text-main'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-border z-20 px-4 py-3 flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary">
                    <Bot size={24} />
                    <span>AI Auto Studio</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-text-secondary">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-30 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="bg-white w-72 h-full p-4 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2 font-bold text-xl text-primary mb-8 px-2">
                            <Bot size={24} />
                            <span>AI Auto Studio</span>
                        </div>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                                        ? 'bg-primary-light text-primary'
                                        : 'text-text-secondary hover:bg-gray-50 hover:text-text-main'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-8"
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
