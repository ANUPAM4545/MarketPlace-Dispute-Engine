import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Zap, Sparkles, ArrowRight, Rocket, Crown } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

    const plans = [
        {
            name: "Essentials",
            price: billingCycle === "monthly" ? "0" : "0",
            description: "Perfect for individual sellers and new buyers starting their journey.",
            icon: Rocket,
            features: [
                "Up to 5 active disputes",
                "Standard AI Analysis",
                "Global Product Catalog",
                "Real-time Notifications",
                "Email Support"
            ],
            cta: "Start for Free",
            highlight: false,
            color: "text-blue-500",
            bg: "bg-blue-500/5",
            border: "border-blue-500/20"
        },
        {
            name: "Professional",
            price: billingCycle === "monthly" ? "49" : "39",
            description: "Designed for high-volume merchants and power users who need speed.",
            icon: Zap,
            features: [
                "Unlimited active disputes",
                "Priority AI Analysis (Gemini Ultra)",
                "Bulk Inventory Uploads",
                "Custom Dispute Templates",
                "24/7 Priority Chat Support",
                "Advanced Sales Analytics"
            ],
            cta: "Go Professional",
            highlight: true,
            color: "text-gold-500",
            bg: "bg-gold-500/5",
            border: "border-gold-500/30"
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Custom infrastructure and dedicated support for global marketplaces.",
            icon: Crown,
            features: [
                "White-labeled Interface",
                "Dedicated Account Manager",
                "SLA-backed Resolutions",
                "Custom AI Model Training",
                "On-premise Deployment Options",
                "Unlimited Staff Accounts"
            ],
            cta: "Contact Sales",
            highlight: false,
            color: "text-purple-500",
            bg: "bg-purple-500/5",
            border: "border-purple-500/20"
        }
    ];

    return (
        <div className="bg-white dark:bg-appbg min-h-screen font-sans selection:bg-gold-500 selection:text-black transition-colors duration-500">
            <Navbar />

            <div className="relative isolate pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Ambient Background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[150px]"
                    />
                    <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                        className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[180px]"
                    />
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <Sparkles className="w-3 h-3" /> Transparent Pricing
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl tracking-tight font-light text-gray-900 dark:text-white mb-6"
                        >
                            Plans that scale with your <br />
                            <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">ambition.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-600 dark:text-gray-400 font-light"
                        >
                            Choose the perfect plan for your business. Whether you're a solo seller or a global marketplace, we have the right tools for you.
                        </motion.p>

                        {/* Billing Switch */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-10 flex items-center justify-center gap-4"
                        >
                            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Monthly</span>
                            <button 
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
                                className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-appcard p-1 transition-colors border border-gray-300 dark:border-white/10"
                            >
                                <motion.div 
                                    animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
                                    className="w-5 h-5 rounded-full bg-gold-500 shadow-lg"
                                />
                            </button>
                            <span className={`text-sm font-bold ${billingCycle === 'annually' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                Annually <span className="ml-1 text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">Save 20%</span>
                            </span>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className={`relative p-8 rounded-[2.5rem] flex flex-col h-full transition-all duration-500 group ${
                                    plan.highlight 
                                    ? 'bg-gray-900 dark:bg-appcard border-2 border-gold-500/50 scale-105 z-10 shadow-[0_30px_60px_rgba(0,0,0,0.3)]' 
                                    : 'bg-white/50 dark:bg-appcard/30 backdrop-blur-xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 shadow-xl'
                                }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold-500 text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className={`w-12 h-12 rounded-2xl ${plan.bg} flex items-center justify-center mb-6 border ${plan.border}`}>
                                        <plan.icon className={`w-6 h-6 ${plan.color}`} />
                                    </div>
                                    <h3 className={`text-2xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
                                    <p className={`mt-2 text-sm leading-relaxed ${plan.highlight ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'} font-light`}>{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-4xl font-light ${plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                            {plan.price === 'Custom' ? '' : '$'}
                                            {plan.price}
                                        </span>
                                        {plan.price !== 'Custom' && (
                                            <span className={`text-sm ${plan.highlight ? 'text-gray-500' : 'text-gray-400'}`}>
                                                /{billingCycle === 'monthly' ? 'mo' : 'mo'}
                                            </span>
                                        )}
                                    </div>
                                    {plan.price !== '0' && plan.price !== 'Custom' && (
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                                            {billingCycle === 'annually' ? 'Billed annually' : 'Billed monthly'}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4 mb-10">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3">
                                            <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? 'bg-gold-500/20' : 'bg-gray-100 dark:bg-white/5'}`}>
                                                <Check className={`w-3 h-3 ${plan.highlight ? 'text-gold-500' : 'text-gray-400'}`} />
                                            </div>
                                            <span className={`text-sm ${plan.highlight ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'} font-light`}>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    to={plan.name === "Enterprise" ? "/contact" : "/register"}
                                    className={`w-full py-4 rounded-2xl text-sm font-bold text-center transition-all active:scale-95 flex items-center justify-center gap-2 ${
                                        plan.highlight
                                        ? 'bg-gold-500 text-black hover:bg-gold-400 shadow-[0_10px_20px_rgba(212,175,55,0.2)]'
                                        : 'bg-gray-900 dark:bg-white/10 text-white dark:text-white hover:bg-black dark:hover:bg-white/20'
                                    }`}
                                >
                                    {plan.cta} <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ Mini Section */}
                    <div className="mt-32 max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-light text-gray-900 dark:text-white">Frequently Asked <span className="font-serif italic text-gold-600 dark:text-gold-500">Questions</span></h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { q: "How accurate is the AI Dispute Analysis?", a: "The AI Analyst achieves a 99.4% accuracy rate by cross-referencing shipping data, message history, and user reputation scores." },
                                { q: "Can I change plans at any time?", a: "Yes, you can upgrade or downgrade your plan instantly from your account settings. Pro-rated refunds apply." }
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-gray-50/50 dark:bg-appcard/30 border border-gray-100 dark:border-white/5">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{item.q}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-12 text-center border-t border-gray-100 dark:border-appborder/30">
                <p className="text-xs text-gray-400 font-light uppercase tracking-widest">© 2026 DisputeEngine Enterprise. Powered by Gemini AI.</p>
            </footer>
        </div>
    );
}
