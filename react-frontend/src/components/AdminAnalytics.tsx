import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import api from "../lib/api";

interface AnalyticsData {
    total_disputes: number;
    open_disputes: number;
    resolved_disputes: number;
    rejected_disputes: number;
    total_users: number;
    total_orders: number;
}

const COLORS = ["#d4af37", "#b5952f", "#937826"]; // Different shades of Gold for PieChart

export default function AdminAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get("/analytics/");
                setData(res.data);
            } catch (err: any) {
                setError(err.response?.data?.msg || err.message || "Failed to fetch analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500 font-light">Loading analytics...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-light">Error: {error}</div>;
    if (!data) return null;

    const allPieData = [
        { name: "Resolved", value: data.resolved_disputes, color: COLORS[0] },
        { name: "Rejected", value: data.rejected_disputes, color: COLORS[1] },
        { name: "Open/Review", value: data.open_disputes, color: COLORS[2] },
    ];
    
    const pieData = allPieData.filter(item => item.value > 0);

    const barData = [
        { name: "Users", count: data.total_users },
        { name: "Orders", count: data.total_orders },
        { name: "Disputes", count: data.total_disputes },
    ];

    return (
        <div className="bg-white dark:bg-appcard shadow-[0_0_15px_rgba(0,0,0,0.05)] rounded-xl p-6 mb-8 transition-colors duration-200 border border-gray-100 dark:border-appborder">
            <h3 className="text-xl leading-6 font-serif italic text-gray-900 dark:text-gold-500 mb-6 font-medium">
                Platform Analytics
            </h3>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div className="bg-gray-50 dark:bg-appbg rounded-lg px-4 py-5 overflow-hidden sm:p-6 transition-colors duration-200 border border-gray-100 dark:border-appborder/50">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate tracking-wide">Total Users</dt>
                    <dd className="mt-1 text-3xl font-light text-gray-900 dark:text-white">{data.total_users}</dd>
                </div>
                <div className="bg-gray-50 dark:bg-appbg rounded-lg px-4 py-5 overflow-hidden sm:p-6 transition-colors duration-200 border border-gray-100 dark:border-appborder/50">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate tracking-wide">Total Orders</dt>
                    <dd className="mt-1 text-3xl font-light text-gray-900 dark:text-white">{data.total_orders}</dd>
                </div>
                <div className="bg-gray-50 dark:bg-appbg rounded-lg px-4 py-5 overflow-hidden sm:p-6 transition-colors duration-200 border border-gray-100 dark:border-appborder/50">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate tracking-wide">Total Disputes</dt>
                    <dd className="mt-1 text-3xl font-light text-gray-900 dark:text-white">{data.total_disputes}</dd>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Dispute Status Pie Chart */}
                <div className="bg-white dark:bg-appbg p-4 rounded-xl border border-gray-100 dark:border-appborder transition-colors duration-200">
                    <h4 className="text-center font-medium text-gray-700 dark:text-gray-300 mb-4 tracking-wide text-sm">Dispute Resolution Status</h4>
                    <div className="h-64 flex items-center justify-center">
                        {data.total_disputes === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 font-light">No disputes yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#d4af37"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(26, 26, 26, 0.95)',
                                            color: '#f3f4f6',
                                            borderRadius: '8px',
                                            border: '1px solid #333',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                                        }}
                                        itemStyle={{ color: '#d4af37' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Platform Growth Bar Chart */}
                <div className="bg-white dark:bg-appbg p-4 rounded-xl border border-gray-100 dark:border-appborder transition-colors duration-200">
                    <h4 className="text-center font-medium text-gray-700 dark:text-gray-300 mb-4 tracking-wide text-sm">Platform Overview</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" className="opacity-30 dark:opacity-100" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                                        color: '#f3f4f6',
                                        borderRadius: '8px',
                                        border: '1px solid #333',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#d4af37' }}
                                />
                                <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
