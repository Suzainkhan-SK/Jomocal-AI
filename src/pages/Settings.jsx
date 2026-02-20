import React from 'react';
import { User, Bell, Lock, Save } from 'lucide-react';

const Settings = () => {
    return (
        <div className="animate-fade-in">
            <div className="mb-10 p-6 bg-surface border border-main rounded-2xl transition-colors">
                <h1 className="text-3xl font-bold text-main tracking-tight">Settings</h1>
                <p className="text-secondary mt-1">Manage your account preferences and security.</p>
            </div>

            <div className="grid gap-8 max-w-4xl">
                {/* Profile Settings */}
                <div className="card bg-surface border-main transition-colors">
                    <div className="flex items-center gap-3 mb-8 border-b border-main pb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-main">Profile Information</h2>
                            <p className="text-sm text-secondary">Update your personal details</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="label text-main">Full Name</label>
                            <input type="text" className="input" defaultValue="Suzain Khan" />
                        </div>
                        <div>
                            <label className="label text-main">Email Address</label>
                            <input type="email" className="input" defaultValue="suzain@example.com" />
                        </div>
                        <div>
                            <label className="label text-main">Company Name</label>
                            <input type="text" className="input" defaultValue="Creative Studio" />
                        </div>
                        <div>
                            <label className="label text-main">Phone Number</label>
                            <input type="tel" className="input" defaultValue="+91 98765 43210" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-main">
                        <button className="btn btn-primary">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card bg-surface border-main transition-colors">
                    <div className="flex items-center gap-3 mb-8 border-b border-main pb-6">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-main">Notifications</h2>
                            <p className="text-sm text-secondary">Manage how you receive alerts</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="flex items-center justify-between p-5 bg-body rounded-2xl border border-main transition-all hover:shadow-sm">
                            <div>
                                <p className="font-bold text-main">Email Notifications</p>
                                <p className="text-sm text-secondary">Receive emails about your automation activity.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-12 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-body rounded-2xl border border-main transition-all hover:shadow-sm">
                            <div>
                                <p className="font-bold text-main">Failed Automation Alerts</p>
                                <p className="text-sm text-secondary">Get notified immediately if an automation fails.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-12 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="card bg-surface border-main transition-colors">
                    <div className="flex items-center gap-3 mb-8 border-b border-main pb-6">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-main">Security</h2>
                            <p className="text-sm text-secondary">Update your password and security settings</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="label text-main">Current Password</label>
                            <input type="password" className="input" placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="label text-main">New Password</label>
                            <input type="password" className="input" placeholder="••••••••" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-main">
                        <button className="btn btn-secondary border-main text-secondary hover:bg-body">Update Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
