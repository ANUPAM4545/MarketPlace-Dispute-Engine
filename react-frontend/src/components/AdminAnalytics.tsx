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

const COLORS = ["#10B981", "#EF4444", "#F59E0B"]; // Green, Red, Yellow for PieChart

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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
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
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8 transition-colors duration-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-6">
                Platform Analytics
            </h3>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg px-4 py-5 overflow-hidden sm:p-6 transition-colors duration-200">
                    <dt className="text-sm font-medium text-indigo-500 dark:text-indigo-300 truncate">Total Users</dt>
                    <dd className="mt-1 text-3xl font-semibold text-indigo-900 dark:text-indigo-100">{data.total_users}</dd>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg px-4 py-5 overflow-hidden sm:p-6 transition-colors duration-200">
                    <dt className="text-sm font-medium text-blue-500 dark:text-blue-300 truncate">Total Orders</dt>
                    <dd className="mt-1 text-3xl font-semibold text-blue-900 dark:text-blue-100">{data.total_orders}</dd>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg px-4 py-5 overflow-hidden sm:p-6 transition-colors duration-200">
                    <dt className="text-sm font-medium text-purple-500 dark:text-purple-300 truncate">Total Disputes</dt>
                    <dd className="mt-1 text-3xl font-semibold text-purple-900 dark:text-purple-100">{data.total_disputes}</dd>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Dispute Status Pie Chart */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 transition-colors duration-200">
                    <h4 className="text-center font-medium text-gray-700 dark:text-gray-300 mb-4">Dispute Resolution Status</h4>
                    <div className="h-64 flex items-center justify-center">
                        {data.total_disputes === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">No disputes yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
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
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Platform Growth Bar Chart */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 transition-colors duration-200">
                    <h4 className="text-center font-medium text-gray-700 dark:text-gray-300 mb-4">Platform Overview</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(243, 244, 246, 0.4)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
