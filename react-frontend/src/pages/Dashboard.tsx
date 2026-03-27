import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
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
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <nav className="bg-white dark:bg-gray-800 shadow transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
                                    Dispute Engine
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                                    {user.name}
                                </p>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wider">
                                    {user.role}
                                </p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label="Toggle theme"
                            >
                                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </button>
                            <button
                                onClick={logout}
                                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {user.role === "Admin"
                                ? "Admin Dashboard"
                                : user.role === "Seller"
                                    ? "Seller Dashboard"
                                    : "Dashboard"}
                        </h2>
                        {user.role === "Buyer" && (
                            <Link
                                to="/create-dispute"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                            >
                                + New Dispute
                            </Link>
                        )}
                    </div>

                    {user.role === "Buyer" && <OrdersList />}

                    {user.role === "Seller" && (
                        <div className="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                            <button 
                                onClick={() => setSellerView('orders')}
                                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${sellerView === 'orders' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                Active Orders
                            </button>
                            <button 
                                onClick={() => setSellerView('disputes')}
                                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${sellerView === 'disputes' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                Manage Disputes
                            </button>
                        </div>
                    )}

                    {user.role === "Seller" && sellerView === "orders" && <OrdersList />}

                    {user.role === "Admin" && (
                        <div className="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                            <button 
                                onClick={() => setAdminView('kanban')}
                                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${adminView === 'kanban' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                Kanban Board
                            </button>
                            <button 
                                onClick={() => setAdminView('list')}
                                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${adminView === 'list' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                List View
                            </button>
                            <button 
                                onClick={() => setAdminView('analytics')}
                                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${adminView === 'analytics' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                Analytics
                            </button>
                        </div>
                    )}

                    {user.role === "Admin" && adminView === "analytics" && <AdminAnalytics />}
                    {user.role === "Admin" && adminView === "kanban" && <AdminKanbanBoard />}
                    {(user.role === "Buyer" || (user.role === "Admin" && adminView === "list") || (user.role === "Seller" && sellerView === "disputes")) && (
                        <>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                                {user.role === "Admin"
                                    ? "All Disputes (List)"
                                    : user.role === "Seller"
                                        ? "Incoming Disputes"
                                        : "My Disputes"}
                            </h3>
                            <DisputeList />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
