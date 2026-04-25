import { useEffect, useState } from "react";
import api from "../lib/api";
import { motion } from "framer-motion";
import { TrendingUp, Package, ShieldAlert, Users, CreditCard, Activity } from "lucide-react";

interface StatItem {
    label: string;
    value: string | number;
    color: string;
}

const colorMap: any = {
    gold: "from-amber-400 to-amber-600 shadow-amber-500/20",
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/20",
    red: "from-rose-500 to-red-600 shadow-red-500/20",
    green: "from-emerald-400 to-green-600 shadow-emerald-500/20",
    orange: "from-orange-400 to-rose-500 shadow-orange-500/20",
    indigo: "from-indigo-500 to-purple-600 shadow-indigo-500/20"
};

const iconMap: any = {
    "Total Spent": CreditCard,
    "Orders Placed": Package,
    "Active Disputes": ShieldAlert,
    "Total Earnings": TrendingUp,
    "Pending Shipments": Activity,
    "Dispute Rate": ShieldAlert,
    "Total Users": Users,
    "System Disputes": ShieldAlert,
    "Insurance Claims": ShieldAlert
};

export default function DashboardStats() {
    const [stats, setStats] = useState<StatItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/auth/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Stats fetch failed");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white dark:bg-appcard border border-gray-100 dark:border-appborder/50 rounded-2xl p-6 h-28 animate-pulse">
                        <div className="flex justify-between items-start">
                            <div className="space-y-3 w-1/2">
                                <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
                            </div>
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const displayStats = stats.length > 0 ? stats : [
        {label: "Total Earnings", value: "$0.00", color: "green"},
        {label: "Pending Shipments", value: "0", color: "blue"},
        {label: "Dispute Rate", value: "0%", color: "orange"}
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {displayStats.map((stat, idx) => {
                const Icon = iconMap[stat.label] || Activity;
                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative group overflow-hidden bg-white/60 dark:bg-appcard/80 backdrop-blur-md border border-gray-100 dark:border-appborder/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="absolute top-4 right-4 flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorMap[stat.color].split(' ')[0].replace('from-', 'bg-')}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${colorMap[stat.color].split(' ')[0].replace('from-', 'bg-')}`}></span>
                        </div>
                        
                        <div className="flex items-center justify-between relative z-10 mt-2">
                            <div>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                                    {stat.label}
                                </p>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${colorMap[stat.color]} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-6 h-6" />
                            </div>
                        </div>
                        
                        {/* Subtle background decoration */}
                        <div className={`absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-br ${colorMap[stat.color]} opacity-[0.05] group-hover:opacity-[0.1] rounded-full blur-3xl transition-opacity duration-500`} />
                    </motion.div>
                );
            })}
        </div>
    );
}
