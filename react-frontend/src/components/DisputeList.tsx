import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { motion } from "framer-motion";

interface Dispute {
    id: number;
    status: string;
    category: string;
    description: string;
    created_at: string;
}

export default function DisputeList() {
    const { token } = useAuth();
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDisputes = async () => {
            if (!token) return;
            try {
                const res = await api.get("/disputes/");
                setDisputes(res.data);
            } catch (err: any) {
                setError(err.response?.data?.msg || err.message || "Failed to fetch disputes");
            } finally {
                setLoading(false);
            }
        };

        fetchDisputes();
    }, [token]);

    if (loading) return <div className="p-8 text-center text-gray-500 font-light">Loading disputes...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-light">Error: {error}</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white dark:bg-appcard shadow-[0_0_15px_rgba(0,0,0,0.05)] overflow-hidden rounded-xl border border-gray-100 dark:border-appborder transition-colors duration-200"
        >
            <h3 className="px-4 py-5 sm:px-6 text-xl leading-6 font-serif italic text-gray-900 dark:text-gold-500 font-medium tracking-wide flex justify-between items-center border-b border-gray-100 dark:border-appborder/50">
                Active Disputes
            </h3>
            <motion.ul 
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                    hidden: {}
                }}
                className="divide-y divide-gray-100 dark:divide-appborder/50"
            >
                {disputes.length === 0 ? (
                    <motion.li 
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 font-light"
                    >
                        No disputes found.
                    </motion.li>
                ) : (
                    disputes.map((dispute) => (
                        <motion.li 
                            key={dispute.id} 
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0 }
                            }}
                            className="group"
                        >
                            <Link to={`/disputes/${dispute.id}`} className="block hover:bg-gray-50/50 dark:hover:bg-appbg/50 transition-colors">
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gold-500 truncate tracking-wide group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                                            #{dispute.id} - {dispute.category}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p
                                                className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border ${dispute.status === "OPEN"
                                                        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                                                        : dispute.status === "RESOLVED"
                                                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                                                            : "bg-gold-50 text-gold-700 border-gold-200 dark:bg-gold-500/10 dark:text-gold-400 dark:border-gold-500/20"
                                                    }`}
                                            >
                                                {dispute.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between items-start">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-600 dark:text-gray-300 font-light line-clamp-1 max-w-xl">
                                                {dispute.description.substring(0, 100)}{dispute.description.length > 100 ? '...' : ''}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-xs text-gray-400 sm:mt-0 font-light whitespace-nowrap">
                                            <p>Created on {new Date(dispute.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.li>
                    ))
                )}
            </motion.ul>
        </motion.div>
    );
}
