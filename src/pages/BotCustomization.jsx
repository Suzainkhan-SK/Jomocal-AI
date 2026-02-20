import { useState, useEffect } from 'react';
import { Settings, Save, Sparkles, MessageCircle } from 'lucide-react';
import api from '../utils/api';

const BotCustomization = () => {
    const [settings, setSettings] = useState({
        welcomeMessage: '',
        personality: 'friendly',
        responseDelay: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/settings/telegram', {
                headers: { 'x-auth-token': token }
            });
            setSettings(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/settings/telegram', settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save settings:', err);
        }
        setSaving(false);
    };

    const personalities = [
        {
            value: 'professional',
            label: 'Professional',
            description: 'Formal and business-like tone',
            emoji: '💼'
        },
        {
            value: 'friendly',
            label: 'Friendly',
            description: 'Warm and approachable',
            emoji: '😊'
        },
        {
            value: 'casual',
            label: 'Casual',
            description: 'Relaxed and conversational',
            emoji: '👋'
        },
        {
            value: 'enthusiastic',
            label: 'Enthusiastic',
            description: 'Energetic and exciting',
            emoji: '🎉'
        }
    ];

    const previewMessage = settings.welcomeMessage.replace('{{name}}', 'John');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-body transition-colors">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8 p-6 bg-surface border border-main rounded-2xl transition-colors">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-main mb-2">
                    Bot Customization
                </h1>
                <p className="text-secondary">
                    Personalize your bot's personality and messages
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Welcome Message */}
                    <div className="card transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <MessageCircle className="w-6 h-6 text-blue-500" />
                            <h2 className="text-2xl font-display font-bold text-main">
                                Welcome Message
                            </h2>
                        </div>

                        <p className="text-sm text-secondary mb-4">
                            Customize the first message your bot sends. Use <code className="px-2 py-1 bg-primary/10 rounded text-primary text-xs font-bold">{'{{name}}'}</code> to include the user's name.
                        </p>

                        <textarea
                            value={settings.welcomeMessage}
                            onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                            className="input min-h-[150px] font-mono text-sm"
                            placeholder="Enter your welcome message..."
                        />
                    </div>

                    {/* Personality */}
                    <div className="card transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-display font-bold text-main">
                                Bot Personality
                            </h2>
                        </div>

                        <p className="text-sm text-secondary mb-6">
                            Choose how your bot communicates with users
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {personalities.map((personality) => (
                                <button
                                    key={personality.value}
                                    onClick={() => setSettings({ ...settings, personality: personality.value })}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${settings.personality === personality.value
                                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                        : 'border-main hover:border-primary/30 hover:bg-body/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{personality.emoji}</span>
                                        <span className={`font-bold ${settings.personality === personality.value ? 'text-primary' : 'text-main'}`}>{personality.label}</span>
                                    </div>
                                    <p className="text-xs text-secondary leading-relaxed">{personality.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Response Delay */}
                    <div className="card transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <Settings className="w-6 h-6 text-orange-400" />
                            <h2 className="text-2xl font-display font-bold text-main">
                                Advanced Settings
                            </h2>
                        </div>

                        <div>
                            <label className="label">
                                Response Delay (seconds)
                            </label>
                            <p className="text-sm text-secondary mb-4">
                                Add a delay to make responses feel more natural (0-60 seconds)
                            </p>
                            <input
                                type="range"
                                min="0"
                                max="60"
                                value={settings.responseDelay}
                                onChange={(e) => setSettings({ ...settings, responseDelay: parseInt(e.target.value) })}
                                className="w-full h-2 bg-main/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-xs text-secondary mt-2">
                                <span>Instant</span>
                                <span className="font-bold text-primary">{settings.responseDelay}s</span>
                                <span>1 minute</span>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary w-full"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <span className="text-xl">✓</span>
                                Saved Successfully!
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-1">
                    <div className="card sticky top-8 border-2 shadow-2xl transition-colors">
                        <h3 className="font-display font-bold text-main mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Preview
                        </h3>

                        <div className="bg-body rounded-2xl p-6 shadow-inner border border-main mb-6 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                                    B
                                </div>
                                <div className="flex-1">
                                    <div className="bg-primary rounded-2xl rounded-tl-none p-4 shadow-md">
                                        <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                                            {previewMessage || 'Your welcome message will appear here...'}
                                        </p>
                                    </div>
                                    <p className="text-[10px] text-secondary mt-2 ml-1">Just now</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 bg-body/50 p-4 rounded-xl border border-main transition-colors">
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Personality:</span>
                                <span className="font-bold text-main capitalize">{settings.personality}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Response Delay:</span>
                                <span className="font-bold text-main">{settings.responseDelay}s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BotCustomization;
