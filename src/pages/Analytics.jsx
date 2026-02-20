import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Clock, MessageSquare } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/analytics/dashboard', {
                headers: { 'x-auth-token': token }
            });
            setAnalytics(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-body transition-colors">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const stats = [
        {
            name: 'Messages Processed',
            value: analytics?.totals?.messagesReceived || 0,
            icon: MessageSquare,
            color: 'blue',
            change: '+12%'
        },
        {
            name: 'Auto-Replies Sent',
            value: analytics?.totals?.messagesSent || 0,
            icon: TrendingUp,
            color: 'green',
            change: '+8%'
        },
        {
            name: 'Unique Users',
            value: analytics?.totals?.uniqueUsers || 0,
            icon: Users,
            color: 'purple',
            change: '+5%'
        },
        {
            name: 'Time Saved',
            value: `${analytics?.totals?.timeSaved || 0} min`,
            icon: Clock,
            color: 'orange',
            change: '+15%'
        }
    ];

    const colorClasses = {
        blue: 'bg-primary/10 text-primary',
        green: 'bg-emerald-500/10 text-emerald-500',
        purple: 'bg-indigo-500/10 text-indigo-500',
        orange: 'bg-orange-500/10 text-orange-500'
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8 p-6 bg-surface border border-main rounded-2xl transition-colors">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-main mb-2">
                    Analytics Dashboard
                </h1>
                <p className="text-secondary">
                    Track your automation performance over the last 30 days
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={stat.name}
                        className="card transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${colorClasses[stat.color]}`}>
                                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span className="text-xs font-bold text-emerald-500">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-main mb-1">
                            {stat.value}
                        </h3>
                        <p className="text-xs md:text-sm text-secondary font-medium uppercase tracking-widest">{stat.name}</p>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="card mb-8 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-display font-bold text-main">
                        Activity Over Time
                    </h2>
                </div>

                {analytics?.chartData && analytics.chartData.length > 0 ? (
                    <div className="space-y-4">
                        {/* Simple bar chart visualization */}
                        <div className="grid grid-cols-7 gap-2 md:gap-4 lg:gap-6">
                            {analytics.chartData.slice(-7).map((day, index) => {
                                const maxValue = Math.max(...analytics.chartData.map(d => d.messagesSent));
                                const height = maxValue > 0 ? (day.messagesSent / maxValue) * 200 : 20;

                                return (
                                    <div key={index} className="flex flex-col items-center gap-2">
                                        <div className="w-full bg-body rounded-lg overflow-hidden flex items-end transition-colors" style={{ height: '200px' }}>
                                            <div
                                                className="w-full bg-primary/80 rounded-t-sm md:rounded-t-lg transition-all duration-500 hover:bg-primary"
                                                style={{ height: `${height}px` }}
                                            ></div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-main">{day.messagesSent}</p>
                                            <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-6 pt-4 border-t border-main">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <span className="text-xs font-bold text-secondary uppercase tracking-widest">Messages Sent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-xs font-bold text-secondary uppercase tracking-widest">Messages Received</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BarChart3 className="w-16 h-16 text-secondary/30 mx-auto mb-4" />
                        <p className="text-secondary font-medium">No data available yet. Start automating to see your analytics!</p>
                    </div>
                )}
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card transition-colors">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                        Efficiency Rate
                    </h3>
                    <p className="text-3xl font-display font-bold text-primary mb-1">
                        {analytics?.totals?.messagesSent > 0
                            ? Math.round((analytics.totals.messagesSent / analytics.totals.messagesReceived) * 100)
                            : 0}%
                    </p>
                    <p className="text-xs text-secondary font-medium">Auto-reply success rate</p>
                </div>

                <div className="card transition-colors">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                        Avg. Response Time
                    </h3>
                    <p className="text-3xl font-display font-bold text-emerald-500 mb-1">&lt;1s</p>
                    <p className="text-xs text-secondary font-medium">Lightning fast automation</p>
                </div>

                <div className="card transition-colors">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                        Active Automations
                    </h3>
                    <p className="text-3xl font-display font-bold text-indigo-500 mb-1">1</p>
                    <p className="text-xs text-secondary font-medium">Running 24/7</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
