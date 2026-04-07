import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, BarChart3, GripHorizontal, FileStack, Palette, MessageSquareText, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl tracking-out mb-6 font-light text-gray-900 dark:text-white animate-fade-in-up opacity-0 animate-delay-100">
                        Powerful Features for <br className="hidden sm:block"/> 
                        <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">Fair Resolutions</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 font-light animate-fade-in-up opacity-0 animate-delay-200">
                        Everything you need to automate, track, and resolve marketplace disputes seamlessly. Discover why thousands trust DisputeEngine.
                    </p>
                </div>
            </div>

            {/* Feature Blocks */}
            <div className="py-12 bg-gray-50/50 dark:bg-appbg relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="space-y-32">
                        {features.map((feature, index) => (
                            <div 
                                key={feature.title} 
                                className={`flex flex-col lg:flex-row gap-16 items-center animate-fade-in-up opacity-0 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                                style={{ animationDelay: `${(index + 3) * 100}ms` }}
                            >
                                {/* Text Content */}
                                <div className="flex-1 space-y-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color}`}>
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-serif italic text-gray-900 dark:text-white tracking-wide">{feature.title}</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                                        {feature.description}
                                    </p>
                                </div>
                                
                                {/* Image / Visual */}
                                <div className="flex-1 relative w-full group">
                                    <div className="absolute inset-0 bg-gold-500/5 rounded-3xl transform rotate-3 scale-105 blur-lg dark:bg-gold-500/10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"></div>
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gold-500/10 dark:ring-gold-500/20 bg-gray-100 dark:bg-appcard aspect-video flex items-center justify-center bg-gradient-to-tr from-gray-900 to-black">
                                        <img 
                                            src={feature.image} 
                                            alt={feature.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 mix-blend-screen"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Bottom */}
                    <div 
                        className="mt-32 text-center bg-gray-900 dark:bg-appcard border border-appborder/50 rounded-3xl py-16 px-6 sm:py-24 sm:px-12 relative overflow-hidden shadow-2xl animate-scale-in opacity-0"
                        style={{ animationDelay: '800ms' }}
                    >
                        <div className="absolute inset-0 bg-gold-500/5 mix-blend-overlay"></div>
                        <h2 className="text-3xl font-light tracking-wide text-white sm:text-4xl mb-6 relative z-10">
                            Ready to transform your marketplace?
                        </h2>
                        <div className="mt-10 flex items-center justify-center gap-x-6 relative z-10">
                            <Link
                                to="/register"
                                className="rounded-md bg-gold-500 px-8 py-3.5 text-base font-semibold text-appbg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-gold-400 hover:scale-[1.02] transition-all"
                            >
                                Start for free
                            </Link>
                            <Link to="/login" className="text-base font-medium leading-6 text-gray-300 hover:text-gold-400 transition-colors">
                                Log in <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Minimal Footer */}
            <footer className="bg-white dark:bg-appbg py-12 text-center border-t border-gray-200 dark:border-appborder">
                <p className="text-gray-500 dark:text-gray-500 text-sm font-light">© 2026 DisputeEngine. Built with React and Flask.</p>
            </footer>
        </div>
    );
}
