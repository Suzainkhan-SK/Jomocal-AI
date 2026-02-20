import React from 'react';
import { Check, CreditCard, Download } from 'lucide-react';

const Billing = () => {
    return (
        <div className="animate-fade-in">
            <div className="mb-10 p-6 bg-surface border border-main rounded-2xl transition-colors">
                <h1 className="text-3xl font-bold text-main tracking-tight">Billing & Plans</h1>
                <p className="text-secondary mt-1">Manage your subscription and payment methods.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* Current Plan */}
                <div className="lg:col-span-2">
                    <div className="card bg-surface border-main h-full relative overflow-hidden transition-colors">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2"></div>

                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4 uppercase tracking-wider">Current Plan</span>
                                <h2 className="text-4xl font-bold text-main mb-1">Pro Plan</h2>
                                <p className="text-secondary">Perfect for growing businesses</p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-bold text-main">₹2,999<span className="text-sm text-secondary font-normal">/mo</span></p>
                                <p className="text-xs text-secondary mt-2 font-medium">Next billing: Feb 24, 2026</p>
                            </div>
                        </div>

                        <div className="border-t border-main pt-8 mb-8">
                            <div className="grid sm:grid-cols-2 gap-y-5 gap-x-8">
                                <div className="flex items-center gap-3 text-sm text-main">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 flex-shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    Unlimited Automations
                                </div>
                                <div className="flex items-center gap-3 text-sm text-main">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 flex-shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    Priority Support
                                </div>
                                <div className="flex items-center gap-3 text-sm text-main">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 flex-shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    Advanced Analytics
                                </div>
                                <div className="flex items-center gap-3 text-sm text-main">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 flex-shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    5 Team Members
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button className="btn btn-primary px-8 shadow-lg shadow-blue-500/20">Upgrade Plan</button>
                            <button className="btn btn-secondary text-red-400 border-main hover:bg-red-500/10 hover:border-red-500/20">Cancel Subscription</button>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="card bg-surface border-main flex flex-col justify-center transition-colors">
                    <h3 className="font-bold text-lg text-main mb-6">Payment Method</h3>
                    <div className="flex items-center gap-4 p-5 border border-main rounded-2xl mb-6 bg-body transition-colors">
                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center border border-main shadow-sm">
                            <CreditCard size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="font-bold text-main">Visa ending in 4242</p>
                            <p className="text-xs text-secondary mt-1 font-medium">Expires 12/28</p>
                        </div>
                    </div>
                    <button className="btn btn-secondary w-full border-main text-secondary hover:text-main hover:bg-body transition-all font-semibold">Update Payment Method</button>
                </div>
            </div>

            {/* Billing History */}
            <div>
                <h2 className="text-xl font-bold text-main mb-6">Billing History</h2>
                <div className="card p-0 overflow-hidden bg-surface border border-main transition-colors">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-body border-b border-main transition-colors">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-main">
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-5 text-sm text-secondary">Jan 24, 2026</td>
                                <td className="px-6 py-5 text-sm text-main font-semibold">Pro Plan - Monthly</td>
                                <td className="px-6 py-5 text-sm text-main">₹2,999.00</td>
                                <td className="px-6 py-5"><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Paid</span></td>
                                <td className="px-6 py-5">
                                    <button className="text-blue-500 hover:text-blue-400 flex items-center gap-1.5 text-sm font-bold transition-colors">
                                        <Download size={16} /> PDF
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-5 text-sm text-secondary">Dec 24, 2025</td>
                                <td className="px-6 py-5 text-sm text-main font-semibold">Pro Plan - Monthly</td>
                                <td className="px-6 py-5 text-sm text-main">₹2,999.00</td>
                                <td className="px-6 py-5"><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Paid</span></td>
                                <td className="px-6 py-5">
                                    <button className="text-blue-500 hover:text-blue-400 flex items-center gap-1.5 text-sm font-bold transition-colors">
                                        <Download size={16} /> PDF
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Billing;
