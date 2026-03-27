import { Link } from "react-router-dom";
import { ShieldCheck, BarChart3, GripHorizontal, FileStack } from "lucide-react";

export default function Features() {
    const features = [
        {
            title: "Visual Dispute Management",
            description: "Admins can seamlessly track and update dispute statuses using our drag-and-drop Kanban board. Visually move cases from 'Open' to 'Resolved' with pure fluidity.",
            image: "/features/kanban.png",
            icon: GripHorizontal,
            color: "text-indigo-600 bg-indigo-100",
        },
        {
            title: "Real-time Platform Analytics",
            description: "Gain instant insights into platform health. Interactive dashboards track total orders, user growth, and dispute resolution metrics in real-time, helping you make data-driven decisions.",
            image: "/features/analytics.png",
            icon: BarChart3,
            color: "text-blue-600 bg-blue-100",
        },
        {
            title: "Role-Based Access Control",
            description: "Security is our priority. Distinct dashboards and strict permission models ensure Buyers only see their orders, Sellers manage their sales, and Admins govern the ecosystem safely.",
            image: "/features/rbac.png",
            icon: ShieldCheck,
            color: "text-purple-600 bg-purple-100",
        },
        {
            title: "Secure Evidence Uploads",
            description: "When words aren't enough, users can easily upload documents and images to support their claims. Our cloud-backed evidence system ensures files are securely stored and rapidly accessible for Admins.",
            image: "/features/evidence.png",
            icon: FileStack,
            color: "text-teal-600 bg-teal-100",
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 duration-200 min-h-screen">
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
                                <span className="font-bold text-xl text-gray-900 dark:text-white">DisputeEngine</span>
                            </div>
                        </Link>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <Link to="/" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-indigo-600 transition">Home</Link>
                        <Link to="/features" className="text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400">Features</Link>
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
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
                        Powerful Features for <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Fair Resolutions</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                        Everything you need to automate, track, and resolve marketplace disputes seamlessly. Discover why thousands trust DisputeEngine.
                    </p>
                </div>
            </div>

            {/* Feature Blocks */}
            <div className="py-12 bg-gray-50 dark:bg-gray-800/50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="space-y-32">
                        {features.map((feature, index) => (
                            <div key={feature.title} className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                                {/* Text Content */}
                                <div className="flex-1 space-y-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color}`}>
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{feature.title}</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                                
                                {/* Image / Visual */}
                                <div className="flex-1 relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-3xl transform rotate-3 scale-105 blur-lg dark:from-indigo-900/40 dark:to-purple-900/40"></div>
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10">
                                        <img 
                                            src={feature.image} 
                                            alt={feature.title} 
                                            className="w-full h-auto object-cover transform hover:scale-105 transition duration-700 ease-in-out"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Bottom */}
                    <div className="mt-32 text-center bg-gray-900 rounded-3xl py-16 px-6 sm:py-24 sm:px-12 relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 mix-blend-overlay"></div>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6 relative z-10">
                            Ready to transform your marketplace?
                        </h2>
                        <div className="mt-10 flex items-center justify-center gap-x-6 relative z-10">
                            <Link
                                to="/register"
                                className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 transition"
                            >
                                Start for free
                            </Link>
                            <Link to="/login" className="text-base font-semibold leading-6 text-white hover:text-indigo-200 transition">
                                Log in <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Minimal Footer */}
            <footer className="bg-white dark:bg-gray-900 py-12 text-center border-t border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm">© 2026 DisputeEngine. Built with React and Flask.</p>
            </footer>
        </div>
    );
}
