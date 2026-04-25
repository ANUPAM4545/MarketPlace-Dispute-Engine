import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, BarChart3, GripHorizontal, Search, Palette, Bell, Menu, X, Sun, Moon, Sparkles, MapPin } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Features() {
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const features = [
        {
            title: "Autonomous AI Analyst",
            description: "Powered by Gemini & Grok. The engine reads buyer complaints, cross-references seller evidence, and issues a data-driven resolution recommendation instantly. Never get stuck on a complex case again.",
            image: "/features/evidence.png", // Repurposing image
            icon: Sparkles,
            color: "text-purple-500 bg-purple-500/10 border border-purple-500/20",
        },
        {
            title: "Global Marketplace Catalog",
            description: "A rich e-commerce frontend where buyers can search globally, view comprehensive product details, and place orders seamlessly. Sellers manage their inventory via a dedicated secure portal.",
            image: "/features/analytics.png", // Repurposing image
            icon: Search,
            color: "text-blue-500 bg-blue-500/10 border border-blue-500/20",
        },
        {
            title: "Real-Time Notification Hub",
            description: "An interactive notification center that pings users the second an event occurs. Whether it's a new order, a shipment dispatch, or an AI ruling, you'll see the alert instantly.",
            image: "/features/messaging.png", // Repurposing image
            icon: Bell,
            color: "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
        },
        {
            title: "Logistics & Order Tracking",
            description: "Visual timeline tracking for every order. Buyers can see exactly when an item is paid, shipped, and delivered, while Sellers are required to upload undeniable proof of shipment.",
            image: "/features/kanban.png", // Repurposing image
            icon: MapPin,
            color: "text-amber-500 bg-amber-500/10 border border-amber-500/20",
        },
        {
            title: "Interactive Admin Kanban",
            description: "Admins can seamlessly track and update dispute statuses using our drag-and-drop Kanban board. Visually move cases from 'Open' to 'Resolved' with pure fluidity.",
            image: "/features/kanban.png",
            icon: GripHorizontal,
            color: "text-gold-500 bg-gold-500/10 border border-gold-500/20",
        },
        {
            title: "Premium Dark Aesthetics",
            description: "A meticulously crafted interface that provides a luxurious dark mode experience. Enjoy refined glassmorphism, dynamic animations, and calibrated contrast that reduces eye strain.",
            image: "/features/theme.png",
            icon: Palette,
            color: "text-rose-500 bg-rose-500/10 border border-rose-500/20",
        }
    ];

    return (
        <div className="bg-white dark:bg-appbg transition-colors duration-300 min-h-screen font-sans selection:bg-gold-500 selection:text-black">
            {/* Header */}
            <header className="absolute inset-x-0 top-0 z-50 border-b border-gray-100 dark:border-appborder/30 bg-white/60 dark:bg-appbg/60 backdrop-blur-xl">
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
                        <Link to="/" className="text-sm font-bold tracking-wide leading-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors uppercase">Home</Link>
                        <Link to="/features" className="text-sm font-bold tracking-wide leading-6 text-gold-600 dark:text-gold-500 uppercase">Features</Link>
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
            <div className="relative isolate pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden border-b border-gray-100 dark:border-appborder/50">
                {/* Ambient Animated Orbs */}
                <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[100px]"
                    />
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl lg:text-7xl tracking-tight mb-6 font-light text-gray-900 dark:text-white"
                    >
                        Features built for <br className="hidden sm:block"/> 
                        <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">Industry Leaders.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light px-2"
                    >
                        Explore the powerful suite of tools designed to automate conflict resolution, manage global inventory, and provide a seamless marketplace experience.
                    </motion.p>
                </div>
            </div>

            {/* Feature Blocks */}
            <div className="py-20 bg-gray-50/50 dark:bg-appbg relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="space-y-32">
                        {features.map((feature, index) => (
                            <motion.div 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={{
                                    hidden: { opacity: 0, y: 40 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                                }}
                                key={feature.title} 
                                className={`flex flex-col lg:flex-row gap-12 sm:gap-20 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                {/* Text Content */}
                                <div className="flex-1 space-y-6 text-center lg:text-left relative">
                                    <div className={`absolute -inset-x-6 -inset-y-6 z-0 rounded-3xl opacity-0 lg:opacity-100 transition-opacity duration-500 ${feature.color.split(' ')[1]} blur-2xl group-hover:opacity-50 pointer-events-none`}></div>
                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-8 ${feature.color} shadow-lg`}>
                                            <feature.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">{feature.title}</h2>
                                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Image / Visual */}
                                <div className="flex-1 w-full group mt-4 lg:mt-0 px-2 sm:px-0 perspective-1000">
                                    <div className={`relative rounded-[2.5rem] overflow-hidden glass-card aspect-[4/3] flex items-center justify-center bg-white dark:bg-appcard shadow-2xl border border-gray-200 dark:border-white/5 transform transition-transform duration-700 ease-out ${index % 2 !== 0 ? 'rotate-y-[-5deg] rotate-x-[5deg]' : 'rotate-y-[5deg] rotate-x-[5deg]'} group-hover:rotate-y-0 group-hover:rotate-x-0`}>
                                        
                                        {/* Inner Frame */}
                                        <div className="absolute inset-2 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/50">
                                            {/* Feature Image */}
                                            <img 
                                                src={feature.image} 
                                                alt={feature.title}
                                                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100"
                                            />
                                            {/* Overlay to maintain premium dark feel */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Bottom */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mt-40 text-center bg-gray-900 dark:bg-appcard border border-gray-800 dark:border-white/10 rounded-[3rem] py-20 px-6 sm:py-28 sm:px-12 relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent mix-blend-overlay"></div>
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500/30 rounded-full blur-[100px]"></div>
                        
                        <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-8 relative z-10">
                            Ready to transform your <span className="font-serif italic text-gold-400 font-medium">marketplace?</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto rounded-xl bg-gold-500 px-10 py-4 text-base font-bold text-black shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:bg-gold-400 hover:scale-[1.02] transition-all"
                            >
                                Get Started Free
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto rounded-xl px-10 py-4 text-base font-bold text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/20">
                                Log in to Dashboard <span aria-hidden="true" className="ml-2">→</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* Minimal Footer */}
            <footer className="bg-white dark:bg-appbg py-12 text-center border-t border-gray-200 dark:border-appborder transition-colors duration-300">
                <p className="text-gray-500 dark:text-gray-500 text-sm font-light tracking-wide">© 2026 DisputeEngine. Built with React and Flask.</p>
            </footer>
        </div>
    );
}
