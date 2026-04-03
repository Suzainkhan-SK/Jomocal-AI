import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Rocket, Zap, HeartHandshake, Bot, ShieldCheck } from 'lucide-react';

const riseUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const FAQ_DATA = [
    {
        q: "What exactly does Jomocal AI do?",
        a: "Jomocal AI acts as a 24/7 digital employee for your business. It automatically replies to customer inquiries on WhatsApp, finds new B2B leads for you, asks your customers for Google Reviews, and can even automatically post on your YouTube channel. You simply connect your accounts, turn on an automation, and let it work."
    },
    {
        q: "Do I need technical skills to use this?",
        a: "Absolutely not! We built this platform specifically for business owners, not programmers. If you can use WhatsApp and email, you can use Jomocal AI. Everything is pre-built — you just click 'Activate'."
    },
    {
        q: "Is it safe to connect my accounts like WhatsApp and Google?",
        a: "Yes, 100%. We use official, highly secure integrations (OAuth and direct APIs). We never see your passwords, and we never use your accounts for anything other than the exact automations you turn on."
    },
    {
        q: "What if the AI answers a customer wrong on WhatsApp?",
        a: "Our AI is highly customizable. In the 'AI Bot Setup' page, you teach the AI exactly what your business does, your pricing, and your tone. It only replies based on the instructions you give it. If it doesn't know the answer, it can be set to simply say 'I will have a human get back to you shortly'."
    },
    {
        q: "Will this actually increase my sales?",
        a: "Fast responses equal higher sales. By ensuring no customer waits more than 5 seconds for a reply (even at 2 AM), and by actively hunting new leads every day, our users typically see a 30% increase in customer conversion within the first month."
    }
];

const FAQAccordion = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden mb-3 bg-white dark:bg-[#111113]">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
                <span className="font-bold text-gray-900 dark:text-white sm:text-lg pr-4">{faq.q}</span>
                <ChevronDown className={`shrink-0 transition-transform duration-300 text-gray-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                            {faq.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StepCard = ({ number, title, desc, icon: Icon, color }) => (
    <div className="flex flex-col sm:flex-row gap-5 items-start bg-white dark:bg-[#111113] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-[10rem] font-black opacity-[0.03] pointer-events-none" style={{ color }}>
            {number}
        </div>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner" style={{ background: `${color}15`, color }}>
            <Icon size={32} strokeWidth={2} />
        </div>
        <div className="relative z-10 pt-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Step {number}: {title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const HowItWorks = () => {
    return (
        <div className="max-w-4xl mx-auto pb-16 animate-fade-in">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-6 mx-auto">
                    <HelpCircle size={32} strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white font-display tracking-tight mb-4">
                    How Jomocal AI Works
                </h1>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    We designed this platform so anyone can use it. No coding, no complex setups. Just simple tools that bring you more customers and save you time.
                </p>
            </motion.div>

            {/* Steps */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6 mb-16">
                <motion.div variants={riseUp}>
                    <StepCard 
                        number="1" 
                        title="Connect Your Apps" 
                        desc="Go to the 'Connect Apps' page and easily link your WhatsApp, Google Account, or Social Media. It takes just 2 clicks and is completely secure."
                        icon={HeartHandshake}
                        color="#3b82f6"
                    />
                </motion.div>
                <motion.div variants={riseUp}>
                    <StepCard 
                        number="2" 
                        title="Train Your AI Assistant" 
                        desc="Navigate to 'AI Bot Setup'. Simply type in what your business does, your opening hours, and your prices in plain English. The AI learns it instantly."
                        icon={Bot}
                        color="#8b5cf6"
                    />
                </motion.div>
                <motion.div variants={riseUp}>
                    <StepCard 
                        number="3" 
                        title="Turn on Automations" 
                        desc="Browse the 'My Automations' page and pick what you want to achieve (e.g., 'Find Leads' or 'Auto-Reply to WhatsApp'). Click activate, and you're done!"
                        icon={Zap}
                        color="#f59e0b"
                    />
                </motion.div>
                <motion.div variants={riseUp}>
                    <StepCard 
                        number="4" 
                        title="Watch Your Business Grow" 
                        desc="Sit back and relax. Check the 'Reports' or 'Work History' page occasionally to see exactly how many hours the AI has saved you and how many customers it has handled."
                        icon={Rocket}
                        color="#10b981"
                    />
                </motion.div>
            </motion.div>

            {/* Trusted Banner */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between mb-16 shadow-sm">
                <div className="flex items-center gap-4">
                    <ShieldCheck size={40} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-emerald-100 text-lg">Bank-level Security</h4>
                        <p className="text-sm text-emerald-800 dark:text-emerald-300/80">Your data is encrypted and completely private forever.</p>
                    </div>
                </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-display mb-8 text-center">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-1">
                    {FAQ_DATA.map((faq, i) => <FAQAccordion key={i} faq={faq} />)}
                </div>
            </motion.div>

        </div>
    );
};

export default HowItWorks;
