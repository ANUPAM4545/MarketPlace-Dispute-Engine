import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Zap, GripHorizontal, Users } from "lucide-react";

export default function Home() {
    return (
        <div className="bg-appbg min-h-screen text-gray-200 font-sans selection:bg-gold-500 selection:text-black">
            {/* Header */}
            <header className="absolute inset-x-0 top-0 z-50 border-b border-appborder/50 bg-appbg/80 backdrop-blur-md">
                <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5 transition-transform hover:scale-105">
                            <span className="sr-only">Dispute Engine</span>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-gold-500" />
                                <span className="font-serif italic text-xl text-gold-500 tracking-wide font-medium">DisputeEngine</span>
                            </div>
                        </Link>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <Link to="/" className="text-sm font-medium leading-6 text-gold-500">Home</Link>
                        <Link to="/features" className="text-sm font-medium leading-6 text-gray-400 hover:text-gold-400 transition-colors">Features</Link>
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-6 items-center">
                        <Link to="/login" className="text-sm font-medium leading-6 text-gray-300 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link to="/register" className="text-sm font-semibold leading-6 bg-gold-500 text-appbg px-5 py-2 rounded-md hover:bg-gold-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            Get Started
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <div className="relative isolate pt-32 pb-20 lg:pt-48">
                {/* Subtle golden glow in background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
                
                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
                    <div className="mb-10 flex justify-center">
                        <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gold-400 border border-gold-500/20 bg-gold-500/5 hover:bg-gold-500/10 transition-colors cursor-pointer flex items-center gap-2 shadow-[0_0_10px_rgba(212,175,55,0.05)]">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                            </span>
                            Discover the new visual Kanban board
                            <Link to="/features" className="font-semibold text-gold-300 ml-1 flex items-center group">
                                Read more <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl tracking-out mb-6 font-light">
                        <span className="text-white">Resolve Disputes </span>
                        <br className="hidden sm:block"/>
                        <span className="font-serif italic text-gold-500 font-medium">Fairly & Efficiently</span>
                    </h1>
                    
                    <p className="mt-8 text-lg leading-8 text-gray-400 max-w-2xl mx-auto font-light">
                        The ultimate engine for modern marketplaces. Streamline conflict resolution, manage encrypted evidence, and gain clear visual control over every administrative case.
                    </p>
                    
                    <div className="mt-12 flex items-center justify-center gap-x-6 flex-col sm:flex-row gap-y-4">
                        <Link
                            to="/register"
                            className="rounded-md bg-gold-500 px-8 py-3.5 text-base font-semibold text-appbg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-gold-400 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300"
                        >
                            Start Resolving Now
                        </Link>
                        <Link 
                            to="/features" 
                            className="text-base font-medium leading-6 text-gray-300 hover:text-gold-400 flex items-center gap-2 group transition-colors"
                        >
                            Explore Platform Features 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Features Highlights Snippet */}
                <div className="mt-24 sm:mt-32 pb-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
                            <div className="bg-appcard border border-appborder rounded-2xl p-8 hover:border-gold-500/30 transition-colors group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gold-500/10 text-gold-500 mb-6 border border-gold-500/20">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-serif italic text-white mb-3 tracking-wide">Lightning Fast</h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-light">Respond to claims instantly with an automated pipeline and real-time alerts tailored to active disputes.</p>
                            </div>
                            
                            <div className="bg-appcard border border-appborder rounded-2xl p-8 hover:border-gold-500/30 transition-colors group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gold-500/10 text-gold-500 mb-6 border border-gold-500/20">
                                    <GripHorizontal className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-serif italic text-white mb-3 tracking-wide">Visual Kanban</h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-light">Administrators can drag and drop active disputes across stages to intuitively manage the entire case load.</p>
                            </div>
                            
                            <div className="bg-appcard border border-appborder rounded-2xl p-8 hover:border-gold-500/30 transition-colors group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gold-500/10 text-gold-500 mb-6 border border-gold-500/20">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-serif italic text-white mb-3 tracking-wide">Role-Based Access</h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-light">Buyers, Sellers, and Admins each get tailor-made views corresponding directly to their specific needs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer gradient fade */}
            <div className="h-24 bg-gradient-to-t from-black to-transparent"></div>
        </div>
    );
}
