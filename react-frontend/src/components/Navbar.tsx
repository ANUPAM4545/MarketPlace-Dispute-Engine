import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LogOut, LayoutDashboard, Sun, Moon, UserCircle, ChevronDown, Mail, Search, Bell, ShoppingBag, Box, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationCenter from "./NotificationCenter";
import api from "../lib/api";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 1) {
                try {
                    const res = await api.get(`/search/?q=${searchQuery}`);
                    setSearchResults(res.data);
                    setIsSearchOpen(true);
                } catch (err) {
                    console.error("Search failed");
                }
            } else {
                setSearchResults([]);
                setIsSearchOpen(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    if (!user) return null;

    return (
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none"
        >
            <nav className="w-full max-w-7xl bg-white/80 dark:bg-appcard/80 backdrop-blur-xl border border-gray-200 dark:border-appborder/50 rounded-2xl shadow-lg pointer-events-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Left: Brand & Links */}
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-2 h-2 rounded-full bg-gold-500 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
                            <span className="text-xl font-medium tracking-wide text-gray-900 dark:text-white"><span className="font-serif italic text-gold-600 dark:text-gold-500">Dispute</span>Engine</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-2 ml-4 px-1 py-1 bg-gray-50 dark:bg-appcard border border-gray-200 dark:border-appborder rounded-md">
                            <Link to="/dashboard" className="px-4 py-1.5 flex items-center gap-2 text-gold-700 dark:text-gold-500 text-sm font-medium hover:bg-gold-500/5 rounded transition-colors">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        </div>

                        {/* Search Bar */}
                        {user.role !== "Admin" && (
                            <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative items-center w-72 xl:w-96 group">
                                <Search className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length > 1 && setIsSearchOpen(true)}
                                    placeholder="Search products, orders..."
                                    className="w-full bg-gray-50 dark:bg-appcard/50 border border-gray-100 dark:border-appborder/50 rounded-full py-2.5 pl-11 pr-12 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/30 transition-all placeholder:text-gray-400"
                                />
                                {searchQuery && (
                                    <button 
                                        type="submit"
                                        className="absolute right-2 p-1.5 bg-gold-500 text-white rounded-full hover:bg-gold-600 transition-colors shadow-lg shadow-gold-500/20"
                                    >
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                )}

                                <AnimatePresence>
                                    {isSearchOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-appcard border border-gray-100 dark:border-appborder/50 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[400px] overflow-y-auto"
                                            >
                                                <div className="p-2">
                                                    {searchResults.length > 0 ? (
                                                        searchResults.map((result, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => {
                                                                    navigate(`/dashboard?search=${encodeURIComponent(result.title)}`);
                                                                    setIsSearchOpen(false);
                                                                    setSearchQuery("");
                                                                }}
                                                                className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-appbg rounded-xl transition-colors text-left"
                                                            >
                                                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-appbg flex items-center justify-center">
                                                                    {result.type === 'Product' ? <ShoppingBag className="w-5 h-5 text-gold-500" /> : <Box className="w-5 h-5 text-indigo-500" />}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{result.type}</p>
                                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{result.title}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{result.subtitle}</p>
                                                                </div>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="p-6 text-center">
                                                            <Search className="w-8 h-8 text-gray-200 dark:text-gray-800 mx-auto mb-2" />
                                                            <p className="text-sm text-gray-400 italic">No matches found for "{searchQuery}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </form>
                        )}
                    </div>

                    {/* Right: User actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400 focus:outline-none transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-appcard"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <NotificationCenter />

                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-appborder/50 relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-appcard transition-colors focus:outline-none"
                            >
                                <div className="w-9 h-9 rounded-full bg-gold-100 dark:bg-gold-500/10 text-gold-600 dark:text-gold-500 flex items-center justify-center font-bold shadow-sm border border-gold-200 dark:border-gold-500/30">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setIsProfileOpen(false)}
                                        ></div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-appcard border border-gray-100 dark:border-appborder/50 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] z-50 overflow-hidden backdrop-blur-xl"
                                        >
                                            <div className="p-5 border-b border-gray-100 dark:border-appborder/50 bg-gray-50/50 dark:bg-appbg/50">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-500/10 text-gold-600 dark:text-gold-500 flex items-center justify-center font-bold text-xl shadow-inner border border-gold-200 dark:border-gold-500/30">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                                                            {user.name}
                                                        </p>
                                                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-gold-100 dark:bg-gold-500/20 text-gold-700 dark:text-gold-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-gold-200 dark:border-gold-500/30">
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        navigate('/profile');
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-appbg rounded-xl transition-colors mb-1"
                                                >
                                                    <UserCircle className="h-4 w-4 text-gold-500" />
                                                    Manage Profile
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        logout();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Sign out
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    </div>
                </div>
            </nav>
        </motion.div>
    );
}
