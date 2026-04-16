import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, BarChart3, GripHorizontal, FileStack, Palette, MessageSquareText, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function Features() {
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const features = [
        {
            title: "Visual Dispute Management",
            description: "Admins can seamlessly track and update dispute statuses using our drag-and-drop Kanban board. Visually move cases from 'Open' to 'Resolved' with pure fluidity.",
            image: "/features/kanban.png",
            icon: GripHorizontal,
            color: "text-gold-500 bg-gold-500/10 border border-gold-500/20",
        },
        {
            title: "Real-time Platform Analytics",
            description: "Gain instant insights into platform health. Interactive dashboards track total orders, user growth, and dispute resolution metrics in real-time, helping you make data-driven decisions.",
            image: "/features/analytics.png",
            icon: BarChart3,
            color: "text-gold-500 bg-gold-500/10 border border-gold-500/20",
        },
        {
            title: "Role-Based Access Control",
            description: "Security is our priority. Distinct dashboards and strict permission models ensure Buyers only see their orders, Sellers manage their sales, and Admins govern the ecosystem safely.",
            image: "/features/rbac.png",
            icon: ShieldCheck,
            color: "text-gold-500 bg-gold-500/10 border border-gold-500/20",
        },
        {
            title: "Secure Evidence Uploads",
            description: "When words aren't enough, users can easily upload documents and images to support their claims. Our cloud-backed evidence system ensures files are securely stored and rapidly accessible for Admins.",
            image: "/features/evidence.png",
            icon: FileStack,
            color: "text-gold-500 bg-gold-500/10 border border-gold-500/20",
        },
        {
            title: "Premium Dark Aesthetics",
            description: "A meticulously crafted interface that provides a luxurious 'black and gold' dark mode. Enjoy a refined visual experience with glassmorphism components and calibrated contrast that reduces eye strain.",
            image: "/features/theme.png",
            icon: Palette,
            color: "text-gold-500 bg-gold-500/10 border border-gold-500/20",
        },
        {
            title: "Unified Secure Messaging",
            description: "Keep all communication organized in one secure place. Buyers, Sellers, and Admins can discuss dispute details seamlessly with an encrypted chat tab right inside the case file.",
            image: "/features/messaging.png",
            icon: MessageSquareText,
            color: "text-gold-500 bg-gold-500/10 border border-gold-500/20",
        }
    ];

    return (
        <div className="bg-white dark:bg-appbg transition-colors duration-200 min-h-screen font-sans selection:bg-gold-500 selection:text-black">
            {/* Header */}
            <header className="absolute inset-x-0 top-0 z-50 border-b border-gray-200 dark:border-appborder/50 bg-white/80 dark:bg-appbg/80 backdrop-blur-md">
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
                        <Link to="/" className="text-sm font-medium leading-6 text-gray-500 hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400 transition-colors">Home</Link>
                        <Link to="/features" className="text-sm font-medium leading-6 text-gold-600 dark:text-gold-500">Features</Link>
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
                        <Link to="/register" className="text-sm font-semibold leading-6 bg-gold-600 dark:bg-gold-500 text-white dark:text-appbg px-5 py-2 rounded-md hover:bg-gold-700 dark:hover:bg-gold-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
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
            <div className="relative isolate pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                {/* Ambient Animated Orbs */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-gold-500/10 dark:bg-gold-500/5 rounded-full blur-[100px]"
                    />
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl tracking-tight mb-6 font-light text-gray-900 dark:text-white"
                    >
                        Powerful Features for <br className="hidden sm:block"/> 
                        <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">Fair Resolutions</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400 font-light px-2"
                    >
                        Everything you need to automate, track, and resolve marketplace disputes seamlessly. Discover why thousands trust DisputeEngine.
                    </motion.p>
                </div>
            </div>

            {/* Feature Blocks */}
            <div className="py-12 bg-gray-50/50 dark:bg-appbg relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="space-y-24 sm:space-y-32">
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
                                className={`flex flex-col lg:flex-row gap-10 sm:gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                {/* Text Content */}
                                <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 ${feature.color}`}>
                                        <feature.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-serif italic text-gray-900 dark:text-white tracking-wide">{feature.title}</h2>
                                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                                        {feature.description}
                                    </p>
                                </div>
                                
                                {/* Image / Visual (Glassmorphism Placeholder) */}
                                <div className="flex-1 w-full group mt-4 lg:mt-0 px-2 sm:px-0">
                                    <div className="relative rounded-3xl overflow-hidden glass-card aspect-video flex items-center justify-center bg-gradient-to-tr from-gray-100 to-white dark:from-appcard dark:to-appbg shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-appborder">
                                        
                                        {/* Feature Image */}
                                        <img 
                                            src={feature.image} 
                                            alt={feature.title}
                                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                                        />
                                        
                                        {/* Overlay to maintain premium dark feel */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-appbg/20 to-transparent pointer-events-none" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Bottom */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mt-32 text-center bg-white dark:bg-appcard border border-gray-200 dark:border-appborder/50 rounded-3xl py-12 px-6 sm:py-24 sm:px-12 relative overflow-hidden shadow-xl"
                    >
                        <div className="absolute inset-0 bg-gold-500/5 mix-blend-overlay"></div>
                        <h2 className="text-3xl font-light tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6 relative z-10">
                            Ready to transform your marketplace?
                        </h2>
                        <div className="mt-10 flex items-center justify-center gap-x-6 relative z-10">
                            <Link
                                to="/register"
                                className="rounded-md bg-gold-500 px-8 py-3.5 text-base font-semibold text-appbg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-gold-400 hover:scale-[1.02] transition-all"
                            >
                                Start for free
                            </Link>
                            <Link to="/login" className="text-base font-medium leading-6 text-gray-600 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                                Log in <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* Minimal Footer */}
            <footer className="bg-white dark:bg-appbg py-12 text-center border-t border-gray-200 dark:border-appborder">
                <p className="text-gray-500 dark:text-gray-500 text-sm font-light">© 2026 DisputeEngine. Built with React and Flask.</p>
            </footer>
        </div>
    );
}
