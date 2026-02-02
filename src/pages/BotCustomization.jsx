import { useState, useEffect } from 'react';
import { Settings, Save, Sparkles, MessageCircle } from 'lucide-react';
import axios from 'axios';

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
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/settings/telegram', settings, {
                headers: { 'x-auth-token': token }
            });
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
                    Bot Customization
                </h1>
                <p className="text-slate-600">
                    Personalize your bot's personality and messages
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Welcome Message */}
                    <div className="card">
                        <div className="flex items-center gap-3 mb-4">
                            <MessageCircle className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-display font-bold text-slate-900">
                                Welcome Message
                            </h2>
                        </div>

                        <p className="text-sm text-slate-600 mb-4">
                            Customize the first message your bot sends. Use <code className="px-2 py-1 bg-slate-100 rounded text-blue-600">{'{{name}}'}</code> to include the user's name.
                        </p>

                        <textarea
                            value={settings.welcomeMessage}
                            onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                            className="input min-h-[150px] font-mono text-sm"
                            placeholder="Enter your welcome message..."
                        />
                    </div>

                    {/* Personality */}
                    <div className="card">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            <h2 className="text-2xl font-display font-bold text-slate-900">
                                Bot Personality
                            </h2>
                        </div>

                        <p className="text-sm text-slate-600 mb-6">
                            Choose how your bot communicates with users
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {personalities.map((personality) => (
                                <button
                                    key={personality.value}
                                    onClick={() => setSettings({ ...settings, personality: personality.value })}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${settings.personality === personality.value
                                            ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/20'
                                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{personality.emoji}</span>
                                        <span className="font-semibold text-slate-900">{personality.label}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{personality.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Response Delay */}
                    <div className="card">
                        <div className="flex items-center gap-3 mb-4">
                            <Settings className="w-6 h-6 text-orange-600" />
                            <h2 className="text-2xl font-display font-bold text-slate-900">
                                Advanced Settings
                            </h2>
                        </div>

                        <div>
                            <label className="label">
                                Response Delay (seconds)
                            </label>
                            <p className="text-sm text-slate-600 mb-3">
                                Add a delay to make responses feel more natural (0-60 seconds)
                            </p>
                            <input
                                type="range"
                                min="0"
                                max="60"
                                value={settings.responseDelay}
                                onChange={(e) => setSettings({ ...settings, responseDelay: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-sm text-slate-600 mt-2">
                                <span>Instant</span>
                                <span className="font-semibold text-blue-600">{settings.responseDelay}s</span>
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
                    <div className="card sticky top-8 bg-gradient-to-br from-slate-50 to-slate-100">
                        <h3 className="font-display font-bold text-slate-900 mb-4">
                            Live Preview
                        </h3>

                        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                    B
                                </div>
                                <div className="flex-1">
                                    <div className="bg-blue-100 rounded-2xl rounded-tl-none p-3">
                                        <p className="text-sm text-slate-900 whitespace-pre-wrap">
                                            {previewMessage || 'Your welcome message will appear here...'}
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Just now</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Personality:</span>
                                <span className="font-semibold text-slate-900 capitalize">{settings.personality}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Response Delay:</span>
                                <span className="font-semibold text-slate-900">{settings.responseDelay}s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BotCustomization;
