import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  Rocket,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

/* ─────────────────────── DATA ─────────────────────── */

const plans = [
  {
    id: 'creator',
    name: 'Creator',
    tagline: 'For solo-creators and freelancers.',
    monthlyPrice: 999,
    annualPrice: 799,
    icon: Zap,
    accentFrom: '#3b82f6',
    accentTo: '#06b6d4',
    features: [
      '500 Automation Tasks / month',
      'YouTube AI Video Automation (Basic)',
      'Social Media Auto-Posting',
      'Community Discord Support',
      '1 Connected Account per integration',
    ],
    cta: 'Start Creating',
    popular: false,
  },
  {
    id: 'business',
    name: 'Business Pro',
    tagline: 'For growing MSMEs and local shops.',
    monthlyPrice: 2499,
    annualPrice: 1999,
    icon: Crown,
    accentFrom: '#8b5cf6',
    accentTo: '#ec4899',
    features: [
      '3,000 Automation Tasks / month',
      'Lead Hunter & WhatsApp Commerce Agent',
      'Google Reviews Auto-Pilot',
      'Smart Dukaan Inventory Predictor',
      'Priority Email Support',
      '3 Connected Accounts per integration',
    ],
    cta: 'Get Business Pro',
    popular: true,
  },
  {
    id: 'agency',
    name: 'Agency / Enterprise',
    tagline: 'For marketing agencies and high-volume teams.',
    monthlyPrice: 7999,
    annualPrice: 6399,
    icon: Rocket,
    accentFrom: '#f59e0b',
    accentTo: '#ef4444',
    features: [
      'Unlimited Automation Tasks',
      'White-Label AI Telegram Bots',
      'Apify B2B Lead Harvester Access',
      'Custom API Webhooks',
      'Dedicated 1-on-1 WhatsApp Support',
      'Unlimited Connected Accounts',
    ],
    cta: 'Go Enterprise',
    popular: false,
  },
];

const faqs = [
  {
    question: 'What counts as an automation task?',
    answer:
      'An automation task is a single execution of any workflow. For example, auto-posting one social media update, generating one AI video, or processing one lead through the Lead Hunter — each counts as one task. Multi-step workflows still count as a single task.',
  },
  {
    question: 'Can I change my plan later?',
    answer:
      'Absolutely. You can upgrade, downgrade, or cancel your plan at any time from this page. When you upgrade, the price difference is pro-rated for the remainder of your billing cycle. Downgrades take effect at the start of your next billing period.',
  },
  {
    question: 'Do I need to know how to code?',
    answer:
      'Absolutely not. Jomocal AI is a 1-click platform. Just activate and go. Every automation is pre-built and ready to use — no flowcharts, no API keys, no technical setup required.',
  },
];

/* ─────────────────── ANIMATION VARIANTS ──────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ──────────────── FORMAT HELPERS ──────────────── */

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN').format(price);

/* ──────────────── TOGGLE SWITCH ──────────────── */

const BillingToggle = ({ isAnnual, setIsAnnual }) => (
  <div className="flex items-center justify-center gap-4 mt-10 mb-2">
    <span
      className={`text-sm font-semibold transition-colors duration-300 ${
        !isAnnual ? 'text-main' : 'text-secondary'
      }`}
    >
      Monthly
    </span>

    <button
      id="billing-toggle"
      onClick={() => setIsAnnual(!isAnnual)}
      className="relative w-16 h-8 rounded-full cursor-pointer transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      style={{
        background: isAnnual
          ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
          : 'var(--color-border)',
      }}
      aria-label="Toggle annual billing"
    >
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg"
        animate={{ x: isAnnual ? 32 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>

    <span
      className={`text-sm font-semibold transition-colors duration-300 ${
        isAnnual ? 'text-main' : 'text-secondary'
      }`}
    >
      Annually
    </span>

    <AnimatePresence>
      {isAnnual && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8, x: -8 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -8 }}
          className="ml-1 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25"
        >
          <Sparkles size={12} /> Save 20%
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

/* ──────────────── PRICING CARD ──────────────── */

const PricingCard = ({ plan, isAnnual, index }) => {
  const Icon = plan.icon;
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

  return (
    <motion.div
      variants={cardVariants}
      className="relative group"
      style={{ zIndex: plan.popular ? 10 : 1 }}
    >
      {/* Popular badge — floats above the card */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${plan.accentFrom}, ${plan.accentTo})`,
              boxShadow: `0 4px 20px ${plan.accentFrom}40`,
            }}
          >
            ⭐ Most Popular
          </motion.div>
        </div>
      )}

      {/* Gradient glow border wrapper */}
      <div
        className="rounded-3xl p-[1px] transition-all duration-500"
        style={{
          background: plan.popular
            ? `linear-gradient(135deg, ${plan.accentFrom}, ${plan.accentTo}, ${plan.accentFrom})`
            : 'var(--color-border)',
          boxShadow: plan.popular
            ? `0 0 40px ${plan.accentFrom}20, 0 0 80px ${plan.accentTo}10`
            : 'none',
        }}
      >
        <div
          className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
            plan.popular ? 'lg:-my-4 lg:py-4' : ''
          }`}
          style={{
            background: 'var(--color-surface)',
          }}
        >
          {/* Ambient glow blob inside */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-[0.07] pointer-events-none transition-opacity duration-700 group-hover:opacity-[0.14]"
            style={{
              background: `radial-gradient(circle, ${plan.accentFrom} 0%, transparent 70%)`,
              transform: 'translate(30%, -40%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl opacity-[0.05] pointer-events-none transition-opacity duration-700 group-hover:opacity-[0.1]"
            style={{
              background: `radial-gradient(circle, ${plan.accentTo} 0%, transparent 70%)`,
              transform: 'translate(-30%, 40%)',
            }}
          />

          <div className="relative z-10 p-8 lg:p-10">
            {/* Icon + Name */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-300"
                style={{
                  background: `${plan.accentFrom}15`,
                  borderColor: `${plan.accentFrom}30`,
                  color: plan.accentFrom,
                }}
              >
                <Icon size={20} />
              </div>
              <h3 className="text-xl font-bold text-main font-display">
                {plan.name}
              </h3>
            </div>

            <p className="text-secondary text-sm mb-6">{plan.tagline}</p>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={price}
                    initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl font-extrabold text-main font-display tracking-tight"
                  >
                    ₹{formatPrice(price)}
                  </motion.span>
                </AnimatePresence>
                <span className="text-secondary text-sm font-medium">/mo</span>
              </div>
              {isAnnual && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-secondary mt-1.5"
                >
                  Billed ₹{formatPrice(price * 12)}/year
                </motion.p>
              )}
            </div>

            {/* Divider */}
            <div
              className="h-px w-full mb-8 opacity-60"
              style={{
                background: plan.popular
                  ? `linear-gradient(90deg, transparent, ${plan.accentFrom}40, ${plan.accentTo}40, transparent)`
                  : 'var(--color-border)',
              }}
            />

            {/* Features */}
            <ul className="space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: `${plan.accentFrom}15`,
                      color: plan.accentFrom,
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm text-secondary leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              id={`cta-${plan.id}`}
              className="w-full relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer group/btn overflow-hidden"
              style={
                plan.popular
                  ? {
                      background: `linear-gradient(135deg, ${plan.accentFrom}, ${plan.accentTo})`,
                      color: '#ffffff',
                      boxShadow: `0 4px 24px ${plan.accentFrom}35`,
                    }
                  : {
                      background: 'transparent',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border)',
                    }
              }
              onMouseEnter={(e) => {
                if (plan.popular) {
                  e.currentTarget.style.boxShadow = `0 8px 32px ${plan.accentFrom}55`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                } else {
                  e.currentTarget.style.borderColor = plan.accentFrom;
                  e.currentTarget.style.color = plan.accentFrom;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (plan.popular) {
                  e.currentTarget.style.boxShadow = `0 4px 24px ${plan.accentFrom}35`;
                  e.currentTarget.style.transform = 'translateY(0)';
                } else {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {plan.cta}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ──────────────── FAQ ACCORDION ──────────────── */

const FAQItem = ({ faq, isOpen, onToggle, index }) => (
  <motion.div
    variants={fadeUp}
    className="border rounded-2xl overflow-hidden transition-colors duration-300"
    style={{
      borderColor: isOpen ? 'var(--color-border-hover)' : 'var(--color-border)',
      background: isOpen ? 'var(--color-surface)' : 'transparent',
    }}
  >
    <button
      id={`faq-${index}`}
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors duration-300 hover:bg-[var(--color-surface)]"
    >
      <span className="text-main font-semibold pr-4">{faq.question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex-shrink-0"
      >
        <ChevronDown size={20} className="text-secondary" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="px-6 pb-6 text-secondary text-sm leading-relaxed">
            {faq.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */

const Billing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="animate-fade-in">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto mb-4 pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-6">
          <Sparkles size={14} />
          Pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-main font-display leading-tight mb-4">
          Simple, transparent pricing{' '}
          <span className="text-gradient-primary">for your AI workforce.</span>
        </h1>
        <p className="text-secondary text-lg max-w-xl mx-auto">
          Choose the perfect plan to put your operations on autopilot. No coding
          required.
        </p>
      </motion.div>

      {/* ─── Toggle ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <BillingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
      </motion.div>

      {/* ─── Pricing Cards ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 max-w-6xl mx-auto mt-12 mb-20 items-start lg:items-center"
      >
        {plans.map((plan, i) => (
          <PricingCard key={plan.id} plan={plan} isAnnual={isAnnual} index={i} />
        ))}
      </motion.div>

      {/* ─── Trust bar ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-secondary font-medium mb-20"
      >
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          No credit card required
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Cancel anytime
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          7-day free trial on all plans
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          GST invoice included
        </span>
      </motion.div>

      {/* ─── FAQ Section ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="max-w-3xl mx-auto mb-16"
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <h2 className="text-3xl font-bold text-main font-display mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-secondary">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openFAQ === i}
              onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
            />
          ))}
        </div>
      </motion.div>

      {/* ─── Bottom CTA Strip ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl overflow-hidden p-[1px] mb-8 max-w-4xl mx-auto"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
        }}
      >
        <div
          className="rounded-3xl px-8 py-12 md:py-14 text-center relative overflow-hidden"
          style={{ background: 'var(--color-surface)' }}
        >
          {/* Background glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-main font-display mb-3">
              Need a custom plan for your team?
            </h3>
            <p className="text-secondary mb-8 max-w-lg mx-auto">
              We'll craft a tailored solution that scales with your business.
              White-glove onboarding included.
            </p>
            <button
              id="cta-contact-sales"
              className="btn btn-primary px-10 shadow-lg"
              style={{
                boxShadow: '0 4px 24px rgba(59, 130, 246, 0.3)',
              }}
            >
              Talk to Sales <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Billing;
