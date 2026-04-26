import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DisputeList from "../components/DisputeList";
import OrdersList from "../components/OrdersList";
import AdminAnalytics from "../components/AdminAnalytics";
import AdminKanbanBoard from "../components/AdminKanbanBoard";
import ProductCatalog from "../components/ProductCatalog";
import SellerInventory from "../components/SellerInventory";
import DashboardStats from "../components/DashboardStats";
import { motion } from "framer-motion";
import { ShoppingBag, Box, History, Clock as ClockIcon, Calendar } from "lucide-react";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [adminView, setAdminView] = useState<'kanban' | 'list' | 'analytics'>('kanban');
    const [sellerView, setSellerView] = useState<'orders' | 'inventory' | 'disputes'>('inventory');
    const [buyerView, setBuyerView] = useState<'catalog' | 'history' | 'disputes'>('catalog');
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user?.role === 'Buyer' && !loading) {
            import("../lib/api").then(api => {
                api.default.get("/orders/").then(res => {
                    const count = res.data.filter((o: any) => o.status === 'PENDING').length;
                    setPendingOrdersCount(count);
                });
            });
        }
    }, [user, loading, buyerView]);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
        );
    }

    const tabBaseClass = "px-6 py-2.5 font-medium text-sm transition-all duration-200 border-b-2 flex items-center gap-2";
    const tabActiveClass = "text-gold-600 dark:text-gold-500 border-gold-600 dark:border-gold-500";
    const tabInactiveClass = "text-gray-500 dark:text-gray-400 border-transparent hover:text-gold-700 dark:hover:text-gold-400";

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200 text-gray-900 dark:text-gray-200 font-sans selection:bg-gold-500 selection:text-black overflow-x-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-400/5 dark:bg-gold-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-gray-400/5 dark:bg-gray-500/5 rounded-full blur-[150px]"></div>
            </div>
            


            <motion.main 
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8"
            >
                {/* Hero Greeting Section */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="mb-8 md:mb-12 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-[1px] bg-gold-500"></span>
                            <p className="text-gold-600 dark:text-gold-500 uppercase tracking-[0.3em] text-[10px] font-bold">{user.role} COMMAND CENTER</p>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-gray-900 dark:text-white tracking-tight leading-tight">
                            Hello, <br className="sm:hidden" />
                            <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">{user.name}</span>
                        </h1>
                        <p className="mt-2 text-gray-400 dark:text-gray-500 text-sm font-medium">Welcome back to your business overview.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-4 bg-white/50 dark:bg-appcard/30 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 dark:border-appborder/30">
                        <div className="flex items-center gap-3 pr-4 border-r border-gray-200 dark:border-appborder/50">
                            <div className="p-2 bg-gold-100 dark:bg-gold-500/10 rounded-lg text-gold-600 dark:text-gold-500">
                                <ClockIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Local Time</p>
                                <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                                <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">
                                    {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard Statistics Bar */}
                <DashboardStats />

                {/* Role-Specific Navigation Tabs */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="mb-8 border-b border-gray-200 dark:border-appborder overflow-x-auto">
                    <div className="flex gap-2 min-w-max pb-1">
                        {user.role === "Buyer" && (
                            <>
                                <button
                                    onClick={() => setBuyerView('catalog')}
                                    className={`${tabBaseClass} ${buyerView === 'catalog' ? tabActiveClass : tabInactiveClass}`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Product Catalog
                                </button>
                                <button
                                    onClick={() => setBuyerView('history')}
                                    className={`${tabBaseClass} ${buyerView === 'history' ? tabActiveClass : tabInactiveClass}`}
                                >
                                    <History className="w-4 h-4" />
                                    Purchase History
                                    {pendingOrdersCount > 0 && (
                                        <span className="ml-1 px-2 py-0.5 text-[10px] bg-red-500 text-white rounded-full animate-pulse">
                                            {pendingOrdersCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setBuyerView('disputes')}
                                    className={`${tabBaseClass} ${buyerView === 'disputes' ? tabActiveClass : tabInactiveClass}`}
                                >
                                    My Disputes
                                </button>
                            </>
                        )}
                        {user.role === "Seller" && (
                            <>
                                <button
                                    onClick={() => setSellerView('inventory')}
                                    className={`${tabBaseClass} ${sellerView === 'inventory' ? tabActiveClass : tabInactiveClass}`}
                                >
                                    <Box className="w-4 h-4" />
                                    My Inventory
                                </button>
                                <button
                                    onClick={() => setSellerView('orders')}
                                    className={`${tabBaseClass} ${sellerView === 'orders' ? tabActiveClass : tabInactiveClass}`}
                                >
                                    Recent Sales
                                </button>
                                <button
                                    onClick={() => setSellerView('disputes')}
                                    className={`${tabBaseClass} ${sellerView === 'disputes' ? tabActiveClass : tabInactiveClass}`}
                                >
                                    Manage Disputes
                                </button>
                            </>
                        )}
                        {user.role === "Admin" && (
                            <>
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
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Dynamic Content Views */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="space-y-6">
                    {/* Buyer Views */}
                    {user.role === "Buyer" && buyerView === "catalog" && <ProductCatalog onOrderPlaced={() => setBuyerView('history')} />}
                    {user.role === "Buyer" && buyerView === "history" && <OrdersList />}
                    {user.role === "Buyer" && buyerView === "disputes" && <DisputeList />}

                    {/* Seller Views */}
                    {user.role === "Seller" && sellerView === "inventory" && <SellerInventory />}
                    {user.role === "Seller" && sellerView === "orders" && <OrdersList />}
                    {user.role === "Seller" && sellerView === "disputes" && <DisputeList />}

                    {/* Admin Views */}
                    {user.role === "Admin" && adminView === "analytics" && <AdminAnalytics />}
                    {user.role === "Admin" && adminView === "kanban" && <AdminKanbanBoard />}
                    {user.role === "Admin" && adminView === "list" && <DisputeList />}
                </motion.div>
            </motion.main>
        </div>
    );
}
