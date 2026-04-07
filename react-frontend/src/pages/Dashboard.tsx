import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LogOut, LayoutDashboard, Plus, Sun, Moon } from "lucide-react";
import DisputeList from "../components/DisputeList";
import OrdersList from "../components/OrdersList";
import AdminAnalytics from "../components/AdminAnalytics";
import AdminKanbanBoard from "../components/AdminKanbanBoard";

export default function Dashboard() {
    const { user, loading, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [adminView, setAdminView] = useState<'kanban' | 'list' | 'analytics'>('kanban');
    const [sellerView, setSellerView] = useState<'orders' | 'disputes'>('orders');

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
        );
    }

    const tabBaseClass = "px-6 py-2.5 font-medium text-sm transition-all duration-200 border-b-2";
    const tabActiveClass = "text-gold-600 dark:text-gold-500 border-gold-600 dark:border-gold-500";
    const tabInactiveClass = "text-gray-500 dark:text-gray-400 border-transparent hover:text-gold-700 dark:hover:text-gold-400";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200 text-gray-900 dark:text-gray-200 font-sans selection:bg-gold-500 selection:text-black">
            {/* Top Navigation */}
            <nav className="border-b border-gray-200 dark:border-appborder/50 bg-white/80 dark:bg-appbg/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Left: Brand & Links */}
                        <div className="flex items-center gap-8">
                            <Link to="/dashboard" className="flex items-center gap-2 group">
                                <div className="w-2 h-2 rounded-full bg-gold-500 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
                                <span className="text-xl font-medium tracking-wide text-gray-900 dark:text-white"><span className="font-serif italic text-gold-600 dark:text-gold-500">Dispute</span>Engine</span>
                            </Link>

                            <div className="hidden md:flex items-center gap-2 ml-4 px-1 py-1 bg-gray-50 dark:bg-appcard border border-gray-200 dark:border-appborder rounded-md">
                                <span className="px-4 py-1.5 flex items-center gap-2 text-gold-700 dark:text-gold-500 text-sm font-medium bg-gold-100 dark:bg-gold-500/10 rounded">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </span>
                            </div>
                        </div>

                        {/* Right: User actions */}
                        <div className="flex items-center gap-4">
                            {user.role === "Buyer" && (
                                <Link
                                    to="/create-dispute"
                                    className="hidden sm:flex items-center gap-2 bg-gold-600 dark:bg-gold-500 text-white dark:text-black px-4 py-2 rounded-md font-medium hover:bg-gold-700 dark:hover:bg-gold-400 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Dispute
                                </Link>
                            )}

                            <button
                                onClick={toggleTheme}
                                className="p-2 ml-2 text-gray-500 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400 focus:outline-none transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-appcard"
                                aria-label="Toggle Dark Mode"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-appborder">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gold-600 dark:text-gold-500 font-medium uppercase tracking-wider">
                                        {user.role}
                                    </p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-appcard"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Hero Greeting */}
                <div className="mb-12 mt-4">
                    <p className="text-gold-600 dark:text-gold-500 uppercase tracking-[0.2em] text-xs font-semibold mb-2">{user.role} DASHBOARD</p>
                    <h1 className="text-4xl sm:text-5xl font-light text-gray-900 dark:text-white tracking-wide">
                        Hello, <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">{user.name}</span>
                    </h1>
                </div>

                {/* Seller Tabs */}
                {user.role === "Seller" && (
                    <div className="mb-8 border-b border-gray-200 dark:border-appborder overflow-x-auto">
                        <div className="flex gap-2 min-w-max pb-1">
                            <button
                                onClick={() => setSellerView('orders')}
                                className={`${tabBaseClass} ${sellerView === 'orders' ? tabActiveClass : tabInactiveClass}`}
                            >
                                Active Orders
                            </button>
                            <button
                                onClick={() => setSellerView('disputes')}
                                className={`${tabBaseClass} ${sellerView === 'disputes' ? tabActiveClass : tabInactiveClass}`}
                            >
                                Manage Disputes
                            </button>
                        </div>
                    </div>
                )}

                {/* Admin Tabs */}
                {user.role === "Admin" && (
                    <div className="mb-8 border-b border-gray-200 dark:border-appborder overflow-x-auto">
                        <div className="flex gap-2 min-w-max pb-1">
                            <button
                                onClick={() => setAdminView('kanban')}
                                className={`${tabBaseClass} ${adminView === 'kanban' ? tabActiveClass : tabInactiveClass}`}
                            >
                                Kanban Board
                            </button>
                            <button
                                onClick={() => setAdminView('list')}
                                className={`${tabBaseClass} ${adminView === 'list' ? tabActiveClass : tabInactiveClass}`}
                            >
                                List View
                            </button>
                            <button
                                onClick={() => setAdminView('analytics')}
                                className={`${tabBaseClass} ${adminView === 'analytics' ? tabActiveClass : tabInactiveClass}`}
                            >
                                Analytics
                            </button>
                        </div>
                    </div>
                )}

                {/* Dynamic Content Views */}
                <div className="space-y-6">
                    {user.role === "Buyer" && (
                        <div className="mt-8 border-t border-gray-200 dark:border-appborder pt-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-serif italic text-gray-800 dark:text-white font-medium">Your Orders</h3>
                            </div>
                            <OrdersList />
                        </div>
                    )}

                    {user.role === "Seller" && sellerView === "orders" && (
                        <div className="mt-4">
                            <OrdersList />
                        </div>
                    )}

                    {user.role === "Admin" && adminView === "analytics" && (
                        <div className="mt-4">
                            <AdminAnalytics />
                        </div>
                    )}

                    {user.role === "Admin" && adminView === "kanban" && (
                        <div className="mt-4">
                            <AdminKanbanBoard />
                        </div>
                    )}

                    {/* Dispute List (Shared Context) */}
                    {(user.role === "Buyer" || (user.role === "Admin" && adminView === "list") || (user.role === "Seller" && sellerView === "disputes")) && (
                        <div className={`mt-8 ${user.role === "Buyer" ? "border-t border-gray-200 dark:border-appborder pt-8" : "mt-4"}`}>
                            <h3 className="text-xl font-serif italic text-gray-800 dark:text-white font-medium mb-6">
                                {user.role === "Admin"
                                    ? "All Platform Disputes"
                                    : user.role === "Seller"
                                        ? "Incoming Disputes"
                                        : "My Disputes"}
                            </h3>
                            <DisputeList />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
