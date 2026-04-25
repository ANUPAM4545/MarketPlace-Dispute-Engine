import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Zap, GripHorizontal, Users, Sun, Moon, Menu, X, Sparkles, Search, Bell, Box, Activity } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mockupIndex, setMockupIndex] = useState(0);

    // Cycle through mockups
    useEffect(() => {
        const interval = setInterval(() => {
            setMockupIndex((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const mockups = [
        {
            title: "AI Dispute Analysis",
            icon: Sparkles,
            content: "Gemini AI detected shipping inconsistencies. Recommended action: Issue partial refund.",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Global Inventory",
            icon: Box,
            content: "Premium Drone added to catalog. Stock level: 12 units. Price updated securely.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Real-Time Hub",
            icon: Bell,
            content: "New order received! Payment verified and pending shipment. Buyer notified.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        }
    ];

    return (
        <div className="bg-white dark:bg-appbg transition-colors duration-300 min-h-screen text-gray-900 dark:text-gray-200 font-sans selection:bg-gold-500 selection:text-black">
            {/* Header */}
            <header className="absolute inset-x-0 top-0 z-50 border-b border-gray-100 dark:border-appborder/30 bg-white/60 dark:bg-appbg/60 backdrop-blur-xl transition-colors duration-300">
                <nav className="flex items-center justify-between p-5 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5 transition-transform hover:scale-105">
                            <span className="sr-only">Dispute Engine</span>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center border border-gold-200 dark:border-gold-500/30">
                                    <ShieldCheck className="w-5 h-5 text-gold-600 dark:text-gold-500" />
                                </div>
                                <span className="font-serif italic text-xl text-gray-900 dark:text-white tracking-wide font-medium">Dispute<span className="text-gold-600 dark:text-gold-500">Engine</span></span>
                            </div>
                        </Link>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <Link to="/" className="text-sm font-bold tracking-wide leading-6 text-gold-600 dark:text-gold-500 uppercase">Home</Link>
                        <Link to="/features" className="text-sm font-bold tracking-wide leading-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors uppercase">Features</Link>
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-6 items-center">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 text-gray-500 hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400 transition-colors bg-gray-50 dark:bg-appcard rounded-xl border border-gray-200 dark:border-appborder/50"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </button>
                        <Link to="/login" className="text-sm font-bold leading-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link to="/register" className="text-sm font-bold leading-6 bg-gray-900 dark:bg-gold-500 text-white dark:text-black px-6 py-2.5 rounded-xl hover:bg-black dark:hover:bg-gold-400 transition-all shadow-lg hover:shadow-xl active:scale-95">
                            Get Started
                        </Link>
                    </div>
                    <div className="flex lg:hidden flex-1 justify-end items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 text-gray-500 hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400 transition-colors bg-gray-50 dark:bg-appcard rounded-xl border border-gray-200 dark:border-appborder/50"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </button>
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                </nav>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <div className="lg:hidden" role="dialog" aria-modal="true">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></motion.div>
                            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-appbg px-6 py-6 sm:max-w-sm border-l border-gray-200 dark:border-appborder shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-6 h-6 text-gold-600 dark:text-gold-500" />
                                            <span className="font-serif italic text-xl text-gray-900 dark:text-white tracking-wide font-medium">Dispute<span className="text-gold-600 dark:text-gold-500">Engine</span></span>
                                        </div>
                                    </Link>
                                    <button
                                        type="button"
                                        className="-m-2.5 rounded-md p-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <X className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="mt-8 flow-root">
                                    <div className="-my-6 divide-y divide-gray-100 dark:divide-appborder">
                                        <div className="space-y-2 py-6">
                                            <Link to="/" className="-mx-3 block rounded-xl px-3 py-3 text-base font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-appcard" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                                            <Link to="/features" className="-mx-3 block rounded-xl px-3 py-3 text-base font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-appcard" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                                        </div>
                                        <div className="py-6 space-y-3">
                                            <Link to="/login" className="-mx-3 block rounded-xl px-3 py-3 text-base font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-appcard text-center border border-gray-200 dark:border-appborder" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                                            <Link to="/register" className="-mx-3 block rounded-xl px-3 py-3 text-base font-bold bg-gray-900 dark:bg-gold-500 text-white dark:text-black hover:bg-black dark:hover:bg-gold-400 text-center" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <div className="relative isolate pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Ambient Animated Orbs */}
                <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] bg-gold-500/20 rounded-full blur-[120px]"
                    />
                    <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]"
                    />
                </div>
                
                <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
                    {/* Left: Text Content */}
                    <div className="flex-1 text-center lg:text-left z-10">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-8 flex justify-center lg:justify-start"
                        >
                            <Link to="/features" className="relative rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 border border-gold-500/30 bg-gold-50/50 dark:bg-gold-500/5 hover:bg-gold-100 dark:hover:bg-gold-500/10 transition-colors flex items-center gap-2 backdrop-blur-md">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 dark:bg-gold-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-600 dark:bg-gold-500"></span>
                                </span>
                                AI-Powered Marketplace V2.0
                            </Link>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-8 font-light text-gray-900 dark:text-white leading-[1.1]"
                        >
                            The Intelligent <br />
                            <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">Marketplace</span> Engine.
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="text-lg sm:text-xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 font-light"
                        >
                            Buy and sell with absolute confidence. Our platform combines a rich global catalog with an autonomous AI analyst to instantly resolve disputes fairly.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <Link
                                to="/register"
                                className="w-full sm:w-auto rounded-xl bg-gray-900 dark:bg-gold-500 px-8 py-4 text-sm font-bold text-white dark:text-black shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Get Started Now <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link 
                                to="/features" 
                                className="w-full sm:w-auto rounded-xl bg-white dark:bg-appcard border border-gray-200 dark:border-appborder px-8 py-4 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-appbg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Explore Platform
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: Dynamic UI Mockup */}
                    <motion.div 
                        initial={{ opacity: 0, x: 40, rotateY: 15 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="flex-1 w-full max-w-lg mx-auto perspective-1000 hidden md:block"
                    >
                        <div className="relative rounded-3xl border border-gray-200/50 dark:border-white/10 bg-white/40 dark:bg-[#111]/40 backdrop-blur-2xl shadow-2xl overflow-hidden aspect-[4/3] flex flex-col transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
                            {/* Mockup Header */}
                            <div className="h-12 border-b border-gray-200/50 dark:border-white/5 bg-white/50 dark:bg-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="mx-auto w-1/2 h-5 rounded-md bg-gray-100 dark:bg-white/5"></div>
                            </div>
                            
                            {/* Mockup Body */}
                            <div className="flex-1 p-6 relative overflow-hidden">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-1/3 h-8 rounded-lg bg-gray-200 dark:bg-white/10"></div>
                                    <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                                    </div>
                                </div>

                                {/* Dynamic Animated Card */}
                                <div className="absolute inset-x-6 top-24 bottom-6">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={mockupIndex}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.5 }}
                                            className="h-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#1a1a1a]/80 shadow-lg p-6 flex flex-col justify-center items-center text-center gap-4"
                                        >
                                            <div className={`w-16 h-16 rounded-2xl ${mockups[mockupIndex].bg} flex items-center justify-center`}>
                                                {(() => {
                                                    const Icon = mockups[mockupIndex].icon;
                                                    return <Icon className={`w-8 h-8 ${mockups[mockupIndex].color}`} />;
                                                })()}
                                            </div>
                                            <h3 className="text-xl font-serif italic text-gray-900 dark:text-white">{mockups[mockupIndex].title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">{mockups[mockupIndex].content}</p>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Features Highlights Snippet */}
                <div className="mt-24 sm:mt-32 pb-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.15 } },
                                hidden: {}
                            }}
                            className="grid grid-cols-1 gap-6 sm:grid-cols-3"
                        >
                            {/* Feature 1 */}
                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                                }}
                                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                                className="bg-white/50 dark:bg-appcard/50 backdrop-blur-sm border border-gray-100 dark:border-appborder/50 rounded-3xl p-8 hover:bg-white dark:hover:bg-appcard hover:border-gold-500/30 transition-all group relative overflow-hidden shadow-sm flex flex-col"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] transition-transform group-hover:scale-125"></div>
                                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-6 border border-purple-100 dark:border-purple-500/20 relative z-10 group-hover:scale-110 transition-transform">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">AI Dispute Analyst</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light relative z-10">Powered by Gemini. Our autonomous AI instantly reviews evidence and issues fair, data-driven recommendations.</p>
                            </motion.div>
                            
                            {/* Feature 2 */}
                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                                }}
                                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                                className="bg-white/50 dark:bg-appcard/50 backdrop-blur-sm border border-gray-100 dark:border-appborder/50 rounded-3xl p-8 hover:bg-white dark:hover:bg-appcard hover:border-gold-500/30 transition-all group relative overflow-hidden shadow-sm flex flex-col"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] transition-transform group-hover:scale-125"></div>
                                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-6 border border-blue-100 dark:border-blue-500/20 relative z-10 group-hover:scale-110 transition-transform">
                                    <Search className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">Global Catalog</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light relative z-10">A robust marketplace. Discover products instantly with global URL-driven search and dynamic filtering.</p>
                            </motion.div>
                            
                            {/* Feature 3 */}
                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                                }}
                                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                                className="bg-white/50 dark:bg-appcard/50 backdrop-blur-sm border border-gray-100 dark:border-appborder/50 rounded-3xl p-8 hover:bg-white dark:hover:bg-appcard hover:border-gold-500/30 transition-all group relative overflow-hidden shadow-sm flex flex-col"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] transition-transform group-hover:scale-125"></div>
                                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-100 dark:border-emerald-500/20 relative z-10 group-hover:scale-110 transition-transform">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">Real-Time Hub</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light relative z-10">Never miss an update. Receive instant notifications for new orders, shipping updates, and resolved disputes.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Footer gradient fade */}
            <div className="h-24 bg-gradient-to-t from-gray-50 dark:from-black to-transparent"></div>
        </div>
    );
}
