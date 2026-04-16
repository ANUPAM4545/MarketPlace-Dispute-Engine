import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Zap, GripHorizontal, Users, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function Home() {
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-gray-50 dark:bg-appbg transition-colors duration-200 min-h-screen text-gray-900 dark:text-gray-200 font-sans selection:bg-gold-500 selection:text-black">
            {/* Header */}
            <header className="absolute inset-x-0 top-0 z-50 border-b border-gray-200 dark:border-appborder/50 bg-white/80 dark:bg-appbg/80 backdrop-blur-md transition-colors duration-200">
                <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5 transition-transform hover:scale-105">
                            <span className="sr-only">Dispute Engine</span>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-gold-600 dark:text-gold-500" />
                                <span className="font-serif italic text-xl text-gold-600 dark:text-gold-500 tracking-wide font-medium">DisputeEngine</span>
                            </div>
                        </Link>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <Link to="/" className="text-sm font-medium leading-6 text-gold-600 dark:text-gold-500">Home</Link>
                        <Link to="/features" className="text-sm font-medium leading-6 text-gray-500 hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400 transition-colors">Features</Link>
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-6 items-center">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>
                        <Link to="/login" className="text-sm font-medium leading-6 text-gray-600 dark:text-gray-300 hover:text-gold-600 dark:hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link to="/register" className="text-sm font-semibold leading-6 bg-gold-600 dark:bg-gold-500 text-white dark:text-appbg px-5 py-2 rounded-md hover:bg-gold-700 dark:hover:bg-gold-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            Get Started
                        </Link>
                    </div>
                    <div className="flex lg:hidden flex-1 justify-end items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
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
                {mobileMenuOpen && (
                    <div className="lg:hidden" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-appbg px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:ring-white/10 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                                <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                                    <span className="sr-only">Dispute Engine</span>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-6 h-6 text-gold-600 dark:text-gold-500" />
                                        <span className="font-serif italic text-xl text-gold-600 dark:text-gold-500 tracking-wide font-medium">DisputeEngine</span>
                                    </div>
                                </Link>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <X className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-500/20">
                                    <div className="space-y-2 py-6">
                                        <Link
                                            to="/"
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-appcard"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Home
                                        </Link>
                                        <Link
                                            to="/features"
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-appcard"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Features
                                        </Link>
                                    </div>
                                    <div className="py-6 space-y-2">
                                        <Link
                                            to="/login"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-appcard"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gold-600 dark:text-gold-500 hover:bg-gray-50 dark:hover:bg-appcard"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <div className="relative isolate pt-32 pb-20 lg:pt-48 overflow-hidden">
                {/* Ambient Animated Orbs */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[10%] left-[10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gold-500/20 dark:bg-gold-500/10 rounded-full blur-[100px]"
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gold-400/20 dark:bg-gold-300/10 rounded-full blur-[120px]"
                    />
                </div>
                
                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="mb-10 flex justify-center"
                    >
                        <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gold-600 dark:text-gold-400 border border-gold-500/30 dark:border-gold-500/20 bg-gold-50 dark:bg-gold-500/5 hover:bg-gold-100 dark:hover:bg-gold-500/10 transition-colors cursor-pointer flex items-center gap-2 shadow-[0_0_10px_rgba(212,175,55,0.05)]">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 dark:bg-gold-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-600 dark:bg-gold-500"></span>
                            </span>
                            Discover the new visual Kanban board
                            <Link to="/features" className="font-semibold text-gold-700 dark:text-gold-300 ml-1 flex items-center group">
                                Read more <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6 font-light px-2"
                    >
                        <span className="text-gray-900 dark:text-white">Resolve Disputes </span>
                        <br className="hidden sm:block"/>
                        <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">Fairly & Efficiently</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        className="mt-6 sm:mt-8 text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light px-4"
                    >
                        The ultimate engine for modern marketplaces. Streamline conflict resolution, manage encrypted evidence, and gain clear visual control over every administrative case.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                        className="mt-12 flex items-center justify-center gap-x-6 flex-col sm:flex-row gap-y-4"
                    >
                        <Link
                            to="/register"
                            className="w-full sm:w-auto rounded-md bg-gold-600 dark:bg-gold-500 px-8 py-3.5 text-base font-semibold text-white dark:text-appbg gold-glow hover:bg-gold-700 dark:hover:bg-gold-400 hover:scale-[1.02] transition-all duration-300"
                        >
                            Start Resolving Now
                        </Link>
                        <Link 
                            to="/features" 
                            className="text-base font-medium leading-6 text-gray-700 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-400 flex items-center gap-2 group transition-colors"
                        >
                            Explore Platform Features 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Features Highlights Snippet */}
                <div className="mt-20 sm:mt-32 pb-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.15 } },
                                hidden: {}
                            }}
                            className="grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8"
                        >
                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                                }}
                                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                                className="bg-white dark:bg-appcard border border-gray-200 dark:border-appborder rounded-2xl p-8 hover:border-gold-500/40 dark:hover:border-gold-500/30 transition-colors group relative overflow-hidden shadow-sm flex flex-col h-full"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-500 mb-6 border border-gold-200 dark:border-gold-500/20 shadow-sm relative z-10">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-serif italic text-gray-900 dark:text-white mb-3 tracking-wide relative z-10">Lightning Fast</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light relative z-10">Respond to claims instantly with an automated pipeline and real-time alerts tailored to active disputes.</p>
                            </motion.div>
                            
                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                                }}
                                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                                className="bg-white dark:bg-appcard border border-gray-200 dark:border-appborder rounded-2xl p-8 hover:border-gold-500/40 dark:hover:border-gold-500/30 transition-colors group relative overflow-hidden shadow-sm flex flex-col h-full"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-500 mb-6 border border-gold-200 dark:border-gold-500/20 shadow-sm relative z-10">
                                    <GripHorizontal className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-serif italic text-gray-900 dark:text-white mb-3 tracking-wide relative z-10">Visual Kanban</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light relative z-10">Administrators can drag and drop active disputes across stages to intuitively manage the entire case load.</p>
                            </motion.div>
                            
                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                                }}
                                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                                className="bg-white dark:bg-appcard border border-gray-200 dark:border-appborder rounded-2xl p-8 hover:border-gold-500/40 dark:hover:border-gold-500/30 transition-colors group relative overflow-hidden shadow-sm flex flex-col h-full"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-500 mb-6 border border-gold-200 dark:border-gold-500/20 shadow-sm relative z-10">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-serif italic text-gray-900 dark:text-white mb-3 tracking-wide relative z-10">Role-Based Access</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light relative z-10">Buyers, Sellers, and Admins each get tailor-made views corresponding directly to their specific needs.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Footer gradient fade */}
            <div className="h-24 bg-gradient-to-t from-gray-100 dark:from-black to-transparent"></div>
        </div>
    );
}
