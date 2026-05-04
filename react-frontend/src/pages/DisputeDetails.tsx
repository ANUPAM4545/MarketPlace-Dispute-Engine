import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import DisputeResponse from "../components/DisputeResponse";
import AdminPanel from "../components/AdminPanel";
import GeminiAIInsights from "../components/GeminiAIInsights";

import { motion } from "framer-motion";

interface Dispute {
    id: number;
    status: string;
    category: string;
    description: string;
    created_at: string;
    buyer_id: number;
    order_id: number;
    seller_response?: string;
    is_suspicious?: boolean;
    ai_analysis?: string;
    ai_recommendation?: string;
    evidence?: {
        id: number;
        file_url: string;
        uploaded_by: number;
        uploaded_at: string;
        image_type: string;
        metadata_info?: any;
    }[];
}

export default function DisputeDetails() {
    const { token, user, loading } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [dispute, setDispute] = useState<Dispute | null>(null);
    const [error, setError] = useState("");
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchDispute = async () => {
            if (!token || !id) return;
            try {
                const res = await api.get(`/disputes/${id}`);
                setDispute(res.data);
            } catch (err: any) {
                setError(err.response?.data?.msg || err.message || "Failed to fetch dispute details");
            } finally {
                setFetchLoading(false);
            }
        };

        if (!loading) {
            fetchDispute();
        }
    }, [token, id, loading]);

    if (loading || fetchLoading) return <div className="p-8 text-center text-gray-500 font-light tracking-wide min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200">Loading details...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-medium min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200">Error: {error}</div>;
    if (!dispute) return <div className="p-8 text-center text-gray-500 min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200">Dispute not found</div>;

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${api.defaults.baseURL}${url}`;
    };

    const statusColor =
        dispute.status === "OPEN"
            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
            : dispute.status === "RESOLVED"
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                : "bg-gold-50 text-gold-700 border-gold-200 dark:bg-gold-500/10 dark:text-gold-400 dark:border-gold-500/20";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white/90 dark:bg-appcard/90 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(0,0,0,0.4)] overflow-hidden sm:rounded-3xl border border-gray-100 dark:border-appborder transition-colors duration-500"
                >
                    <div className="px-4 py-6 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-appborder gap-4">
                        <div>
                            <h3 className="text-xl leading-6 font-serif italic text-gray-900 dark:text-white flex flex-wrap items-center font-medium gap-2">
                                Dispute <span className="text-gold-600 dark:text-gold-500">#{dispute.id}</span>
                                {dispute.is_suspicious && (
                                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-lg bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                                        FRAUD SUSPECTED
                                    </span>
                                )}
                            </h3>
                            <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400 font-light">Details and resolution status.</p>
                        </div>
                        <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-lg border uppercase tracking-wider whitespace-nowrap ${statusColor}`}
                        >
                            {dispute.status}
                        </span>
                    </div>
                    <div className="px-4 py-5 sm:p-0">
                        <motion.dl 
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
                            className="sm:divide-y sm:divide-gray-100 dark:sm:divide-appborder/50"
                        >
                            <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50/50 dark:hover:bg-appbg/50 transition-colors">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 font-medium">
                                    {dispute.category}
                                </dd>
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50/50 dark:hover:bg-appbg/50 transition-colors">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 leading-relaxed font-light">
                                    {dispute.description}
                                </dd>
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50/50 dark:hover:bg-appbg/50 transition-colors">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 items-center flex font-light text-opacity-80">
                                    {new Date(dispute.created_at).toLocaleDateString()}
                                </dd>
                            </motion.div>
                            {dispute.seller_response && (
                                <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gold-50/30 dark:bg-gold-500/5 hover:bg-gold-50/50 dark:hover:bg-gold-500/10 transition-colors">
                                    <dt className="text-sm font-medium text-gold-700 dark:text-gold-500">Seller Response</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2 leading-relaxed font-light italic border-l-2 border-gold-300 dark:border-gold-500/30 pl-4">
                                        "{dispute.seller_response}"
                                    </dd>
                                </motion.div>
                            )}
                            
                            {/* EVIDENCE SECTION */}
                            {dispute.evidence && dispute.evidence.length > 0 && (
                                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="py-6 sm:px-6">
                                    <dt className="text-sm font-bold tracking-wide uppercase text-gray-500 dark:text-gold-500 mb-6 border-b border-gray-100 dark:border-appborder/50 pb-3 flex items-center">
                                        Evidence & Audit Log
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Seller pre-delivery evidence */}
                                        <div className="border border-gray-200 dark:border-appborder rounded-xl p-5 bg-white/50 dark:bg-appbg/50 backdrop-blur-sm">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-appborder/50">Seller Pre-Delivery Images</h4>
                                            {dispute.evidence.filter(e => e.image_type === 'SELLER').map(e => (
                                                <div key={e.id} className="mb-5 group">
                                                    <a href={getImageUrl(e.file_url)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-gray-200 dark:border-appborder bg-white dark:bg-appbg group-hover:border-gold-300 dark:group-hover:border-gold-500/50 transition-colors">
                                                        <img src={getImageUrl(e.file_url)} alt="Seller Evidence" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    </a>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex justify-between items-center font-light">
                                                        <span>{new Date(e.uploaded_at).toLocaleString()}</span>
                                                        {e.metadata_info && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm">{(e.metadata_info.file_size / 1024).toFixed(1)} KB</span>}
                                                    </div>
                                                </div>
                                            ))}
                                            {dispute.evidence.filter(e => e.image_type === 'SELLER').length === 0 && (
                                                <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-appborder rounded-lg bg-gray-50/50 dark:bg-appcard/50">
                                                    <p className="text-gray-400 dark:text-gray-500 text-center font-light text-sm px-4">No pre-delivery evidence.</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Buyer dispute evidence */}
                                        <div className="border border-gray-200 dark:border-appborder rounded-xl p-5 bg-white/50 dark:bg-appbg/50 backdrop-blur-sm">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-appborder/50">Buyer Dispute Images</h4>
                                            {dispute.evidence.filter(e => e.image_type === 'BUYER').map(e => (
                                                <div key={e.id} className="mb-5 group">
                                                    <a href={getImageUrl(e.file_url)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-gray-200 dark:border-appborder bg-white dark:bg-appbg group-hover:border-gold-300 dark:group-hover:border-gold-500/50 transition-colors">
                                                        <img src={getImageUrl(e.file_url)} alt="Buyer Evidence" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    </a>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex justify-between items-center font-light">
                                                        <span>{new Date(e.uploaded_at).toLocaleString()}</span>
                                                        {e.metadata_info && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm">{(e.metadata_info.file_size / 1024).toFixed(1)} KB</span>}
                                                    </div>
                                                </div>
                                            ))}
                                            {dispute.evidence.filter(e => e.image_type === 'BUYER').length === 0 && (
                                                <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-appborder rounded-lg bg-gray-50/50 dark:bg-appcard/50">
                                                    <p className="text-gray-400 dark:text-gray-500 text-center font-light text-sm px-4">No damage evidence.</p>
                                                </div>
                                            )}
                                        </div>
                                    </dd>
                                </motion.div>
                            )}

                        </motion.dl>
                    </div>
                    <div className="px-6 py-6 border-t border-gray-100 dark:border-appborder bg-gray-50/50 dark:bg-appcard">
                        <div className="flex flex-col space-y-5">
                            <Link to="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400 text-sm font-medium self-start transition-colors border-b border-transparent hover:border-gold-500">
                                &larr; Return to Dashboard
                            </Link>

                            {user?.role === "Seller" &&
                                dispute.status !== "RESOLVED" &&
                                dispute.status !== "REJECTED" &&
                                !dispute.seller_response && (
                                    <DisputeResponse
                                        disputeId={dispute.id}
                                        onResponseSubmitted={() => window.location.reload()}
                                    />
                                )}

                            {user?.role === "Admin" &&
                                dispute.status !== "RESOLVED" &&
                                dispute.status !== "REJECTED" && (
                                    <>
                                        <GeminiAIInsights 
                                            recommendation={dispute.ai_recommendation || ""} 
                                            analysis={dispute.ai_analysis || ""} 
                                        />
                                        <AdminPanel
                                            disputeId={dispute.id}
                                            onResolved={() => window.location.reload()}
                                        />
                                    </>
                                )}


                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
