import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Zap, GripHorizontal, Users } from "lucide-react";

export default function Home() {
    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Header */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Dispute Engine</span>
                            <div className="flex items-center gap-2">
                                <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">DisputeEngine</span>
                            </div>
                        </Link>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <Link to="/" className="text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400">Home</Link>
                        <Link to="/features" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 transition">Features</Link>
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-6">
                        <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 pt-1 hover:text-indigo-600 transition">
                            Log in
                        </Link>
                        <Link to="/register" className="text-sm font-semibold leading-6 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-500 transition shadow-md shadow-indigo-500/30">
                            Get Started
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <div className="relative isolate pt-14 selection:bg-indigo-200 dark:selection:bg-indigo-900">
                {/* Decorative Background Gradients */}
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6366f1] to-[#a855f7] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>
                
                <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-40 px-6 text-center">
                    <div className="hidden sm:mb-10 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition cursor-pointer flex items-center gap-2">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Discover our new Kanban board feature
                            <Link to="/features" className="font-semibold text-indigo-700 dark:text-indigo-300 ml-1 flex items-center">
                                Read more <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </div>
                    
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl mb-8">
                        Resolve Disputes <br className="hidden sm:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Fairly and Efficiently
                        </span>
                    </h1>
                    
                    <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        The ultimate engine for marketplaces. Streamline conflict resolution, upload encrypted evidence, and give administrators visual control over every case.
                    </p>
                    
                    <div className="mt-12 flex items-center justify-center gap-x-6 flex-col sm:flex-row gap-y-4">
                        <Link
                            to="/register"
                            className="rounded-full bg-gray-900 dark:bg-white px-8 py-3.5 text-base font-semibold text-white dark:text-gray-900 shadow-xl hover:scale-105 hover:shadow-indigo-500/25 transition-all duration-200"
                        >
                            Get Started for Free
                        </Link>
                        <Link 
                            to="/features" 
                            className="text-base font-semibold leading-6 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 group"
                        >
                            Explore Features 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Features Highlights Snippet */}
                <div className="mt-10 sm:mt-20 pb-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-8 lg:gap-x-12">
                            <div className="text-center group">
                                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                                    <Zap className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Respond to claims instantly with an automated pipeline and real-time alerts.</p>
                            </div>
                            <div className="text-center group">
                                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                                    <GripHorizontal className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Visual Kanban</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Administrators can drag and drop active disputes to intuitively manage case load.</p>
                            </div>
                            <div className="text-center group">
                                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                                    <Users className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Role-Based Access</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Buyers, Sellers, and Admins each get tailor-made views corresponding directly to their needs.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
