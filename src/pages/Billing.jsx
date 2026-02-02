import React from 'react';
import { Check, CreditCard, Download } from 'lucide-react';

const Billing = () => {
    return (
        <div className="animate-fade-in">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Billing & Plans</h1>
                <p className="text-slate-500 mt-1">Manage your subscription and payment methods.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* Current Plan */}
                <div className="lg:col-span-2">
                    <div className="card h-full relative overflow-hidden border-blue-200">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>

                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 mb-3">Current Plan</span>
                                <h2 className="text-3xl font-bold text-slate-900 mb-1">Pro Plan</h2>
                                <p className="text-slate-500">Perfect for growing businesses</p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-bold text-slate-900">₹2,999<span className="text-sm text-slate-500 font-normal">/mo</span></p>
                                <p className="text-xs text-slate-400 mt-1">Next billing: Feb 24, 2026</p>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-8 mb-8">
                            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    Unlimited Automations
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    Priority Support
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    Advanced Analytics
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    5 Team Members
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="btn btn-primary shadow-blue-500/20">Upgrade Plan</button>
                            <button className="btn btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200">Cancel Subscription</button>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="card flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-slate-900 mb-6">Payment Method</h3>
                    <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl mb-6 bg-slate-50/50">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                            <CreditCard size={24} className="text-slate-600" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Visa ending in 4242</p>
                            <p className="text-xs text-slate-500">Expires 12/28</p>
                        </div>
                    </div>
                    <button className="btn btn-secondary w-full">Update Payment Method</button>
                </div>
            </div>

            {/* Billing History */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Billing History</h2>
                <div className="card p-0 overflow-hidden border border-slate-200 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-slate-500">Jan 24, 2026</td>
                                <td className="px-6 py-4 text-sm text-slate-900 font-medium">Pro Plan - Monthly</td>
                                <td className="px-6 py-4 text-sm text-slate-900">₹2,999.00</td>
                                <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">Paid</span></td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium transition-colors">
                                        <Download size={16} /> PDF
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-slate-500">Dec 24, 2025</td>
                                <td className="px-6 py-4 text-sm text-slate-900 font-medium">Pro Plan - Monthly</td>
                                <td className="px-6 py-4 text-sm text-slate-900">₹2,999.00</td>
                                <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">Paid</span></td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium transition-colors">
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
