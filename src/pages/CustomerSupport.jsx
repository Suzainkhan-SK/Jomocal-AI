import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Mail, MessageCircle, Send, Bot, User, Phone, Sparkles } from 'lucide-react';

const CustomerSupport = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Namaste! I am Jomocal's highly intelligent AI Support Agent. How can I help you grow your business today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e?.preventDefault();
        if (!input.trim()) return;
        
        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking and response
        setTimeout(() => {
            let aiReply = "I can definitely help with that. Our support team can assist you further on WhatsApp if needed, but the quickest way is to check our 'How it Works' page. Is there anything specific about automations you'd like to know?";
            
            if (userMsg.toLowerCase().includes("whatsapp")) {
                aiReply = "To connect WhatsApp, go to the 'Connect Apps' page. It only takes a minute to link your number securely. Need a video tutorial?";
            } else if (userMsg.toLowerCase().includes("price") || userMsg.toLowerCase().includes("cost")) {
                aiReply = "We have highly affordable plans designed specifically for Indian MSMEs starting at just ₹999/month. You can view full details in the 'Subscription' tab.";
            } else if (userMsg.toLowerCase().includes("human") || userMsg.toLowerCase().includes("call")) {
                aiReply = "Connecting you to our team! You can immediately reach our human experts by clicking the WhatsApp button on the left.";
            }

            setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto pb-16 animate-fade-in">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white font-display tracking-tight mb-2">
                    Customer Support 🤝
                </h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    We are here for you 24/7. Ask our advanced AI agent, or reach out to our human team directly.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* ═══ Left Column: Direct Contact ═══ */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-5">
                    
                    <div className="bg-white dark:bg-[#111113] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-500 flex items-center justify-center mb-4">
                            <MessageCircle size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">WhatsApp Chat</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                            Get instant help from our Indian support executives. Available Mon-Sat, 9 AM to 7 PM.
                        </p>
                        <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" 
                           className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-transform hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/20">
                            Chat on WhatsApp
                        </a>
                    </div>

                    <div className="bg-white dark:bg-[#111113] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500 flex items-center justify-center mb-4">
                            <Mail size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Email Support</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                            For technical queries, billing, or complex issues. We typically reply within 2-4 hours.
                        </p>
                        <a href="mailto:support@jomocal.com" className="flex items-center justify-center gap-2 w-full py-3 bg-gray-50 dark:bg-[#1a1a1f] hover:bg-gray-100 dark:hover:bg-[#202025] text-gray-900 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
                            support@jomocal.com
                        </a>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Phone className="text-indigo-600 dark:text-indigo-400" size={20} />
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Sales Hotline</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">1800-123-4567</p>
                    </div>

                </motion.div>

                {/* ═══ Right Column: Live AI Agent Simulator ═══ */}
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                            className="lg:col-span-8 bg-white dark:bg-[#111113] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg flex flex-col h-[600px] overflow-hidden relative">
                    
                    {/* Decorative Agent Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Chat Header */}
                    <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#111113] relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900 relative bg-gray-100 dark:bg-gray-800">
                                    <img src="/ai_avatar.png" alt="AI Agent" className="w-full h-full object-cover scale-110" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#111113] rounded-full" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                    Jomocal Advanced AI <Sparkles size={14} className="text-indigo-500" />
                                </h3>
                                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Powered by Next-Gen Intelligence</p>
                            </div>
                        </div>
                        <div className="hidden sm:block px-3 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-bold rounded-full">
                            Instant Response
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative z-10">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 overflow-hidden border border-indigo-200 dark:border-indigo-800'}`}>
                                        {msg.role === 'user' ? <User size={18} /> : <img src="/ai_avatar.png" alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    
                                    {/* Bubble */}
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-sm shadow-md' 
                                        : 'bg-gray-50 dark:bg-[#1a1a1f] text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-gray-800'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="flex w-full justify-start">
                                <div className="flex gap-3 max-w-[80%] flex-row">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full overflow-hidden border border-indigo-200 dark:border-indigo-800 bg-indigo-100 dark:bg-indigo-900/50">
                                        <img src="/ai_avatar.png" alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="px-5 py-4 bg-gray-50 dark:bg-[#1a1a1f] rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-800 flex items-center gap-1.5 h-12">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms'}} />
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms'}} />
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms'}} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white dark:bg-[#111113] border-t border-gray-100 dark:border-gray-800 relative z-10">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask Jomocal AI anything..."
                                className="w-full bg-gray-50 dark:bg-[#1a1a1f] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl py-3.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-lg transition-colors"
                            >
                                <Send size={16} className="ml-1" />
                            </button>
                        </form>
                        <p className="text-center mt-3 text-[10px] text-gray-400">
                            Our AI provides instant, highly accurate answers regarding platform features and billing.
                        </p>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default CustomerSupport;
