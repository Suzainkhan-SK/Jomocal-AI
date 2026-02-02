import React from 'react';
import { User, Bell, Lock, Save } from 'lucide-react';

const Settings = () => {
    return (
        <div className="animate-fade-in">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
            </div>

            <div className="grid gap-8 max-w-4xl">
                {/* Profile Settings */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                            <p className="text-sm text-slate-500">Update your personal details</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="label">Full Name</label>
                            <input type="text" className="input" defaultValue="Suzain Khan" />
                        </div>
                        <div>
                            <label className="label">Email Address</label>
                            <input type="email" className="input" defaultValue="suzain@example.com" />
                        </div>
                        <div>
                            <label className="label">Company Name</label>
                            <input type="text" className="input" defaultValue="Creative Studio" />
                        </div>
                        <div>
                            <label className="label">Phone Number</label>
                            <input type="tel" className="input" defaultValue="+91 98765 43210" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button className="btn btn-primary">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                            <p className="text-sm text-slate-500">Manage how you receive alerts</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <p className="font-bold text-slate-900">Email Notifications</p>
                                <p className="text-sm text-slate-500">Receive emails about your automation activity.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <p className="font-bold text-slate-900">Failed Automation Alerts</p>
                                <p className="text-sm text-slate-500">Get notified immediately if an automation fails.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Security</h2>
                            <p className="text-sm text-slate-500">Update your password and security settings</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="label">Current Password</label>
                            <input type="password" className="input" placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="label">New Password</label>
                            <input type="password" className="input" placeholder="••••••••" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button className="btn btn-secondary">Update Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
