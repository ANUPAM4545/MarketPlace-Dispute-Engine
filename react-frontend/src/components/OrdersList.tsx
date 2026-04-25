import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import api from "../lib/api";
import { Package, CreditCard, Truck, CheckCircle, AlertCircle, Search, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
    id: number;
    product_name: string;
    quantity: number;
    amount: number;
    status: string;
    created_at: string;
    seller_id: number;
    product_id: number;
    has_reviewed?: boolean;
    tracking_id?: string;
    carrier_name?: string;
}

export default function OrdersList() {
    const { token, user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";
    const navigate = useNavigate();

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewingOrderId, setReviewingOrderId] = useState<number | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");

    const fetchOrders = async () => {
        if (!token) return;
        try {
            const res = await api.get("/orders/");
            setOrders(res.data);
        } catch (err: any) {
            setError(err.response?.data?.msg || err.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const handleUpdateStatus = async (orderId: number, status: string) => {
        setActionLoading(orderId);
        try {
            await api.patch(`/orders/${orderId}/status`, { status });
            await fetchOrders();
        } catch (err: any) {
            toast.error(err.response?.data?.msg || "Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    const handlePayment = async (orderId: number) => {
        setActionLoading(orderId);
        try {
            await api.post(`/orders/${orderId}/pay`);
            await fetchOrders();
        } catch (err: any) {
            toast.error(err.response?.data?.msg || "Payment failed");
        } finally {
            setActionLoading(null);
        }
    };

    const handleFileDispute = (orderId: number, category: string = "") => {
        navigate("/create-dispute", { state: { orderId, preselectedCategory: category } });
    };

    const handleShipWithProof = async (orderId: number) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            setActionLoading(orderId);
            const formData = new FormData();
            formData.append('evidence', file);

            const carrier = prompt("Enter Carrier Name (e.g. FedEx, UPS):", "Standard Delivery");
            const tracking = prompt("Enter Tracking ID:");

            try {
                // 1. Upload Evidence
                await api.post(`/orders/${orderId}/evidence`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                // 2. Update Status to SHIPPED with tracking info
                await api.patch(`/orders/${orderId}/status`, { 
                    status: 'SHIPPED',
                    carrier_name: carrier,
                    tracking_id: tracking
                });
                
                toast.success("Order shipped! Tracking info and proof uploaded.");
                await fetchOrders();
            } catch (err: any) {
                toast.error(err.response?.data?.msg || "Failed to process shipping");
            } finally {
                setActionLoading(null);
            }
        };
        fileInput.click();
    };

    const handleSubmitReview = async () => {
        if (!reviewingOrderId) return;
        setActionLoading(reviewingOrderId);
        try {
            await api.post(`/orders/${reviewingOrderId}/review`, {
                rating: reviewRating,
                comment: reviewComment
            });
            toast.success("Review submitted successfully!");
            setReviewModalOpen(false);
            setReviewingOrderId(null);
            setReviewComment("");
            setReviewRating(5);
            await fetchOrders();
        } catch (err: any) {
            toast.error(err.response?.data?.msg || "Failed to submit review");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredOrders = useMemo(() => {
        if (!searchQuery) return orders;
        return orders.filter(o => 
            o.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.id.toString().includes(searchQuery)
        );
    }, [orders, searchQuery]);

    if (loading) return <div className="p-8 text-center text-gray-500 font-light italic">Fetching transaction history...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-light">Error: {error}</div>;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <CreditCard className="w-4 h-4 text-orange-500" />;
            case 'PAID': return <Package className="w-4 h-4 text-blue-500" />;
            case 'SHIPPED': return <Truck className="w-4 h-4 text-indigo-500" />;
            case 'DELIVERED': return <CheckCircle className="w-4 h-4 text-green-500" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
            case 'PAID': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
            case 'SHIPPED': return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
            case 'PENDING': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
            default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20';
        }
    };

    return (
        <div className="bg-white dark:bg-appcard shadow-[0_0_15px_rgba(0,0,0,0.05)] overflow-hidden rounded-xl mb-8 border border-gray-100 dark:border-appborder transition-colors duration-200">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-100 dark:border-appborder/50">
                <h3 className="text-xl leading-6 font-serif italic text-gray-900 dark:text-gold-500 font-medium tracking-wide">
                    {user?.role === 'Seller' ? 'Recent Sales' : 'My Purchase History'}
                </h3>
            </div>

            <AnimatePresence>
                {searchQuery && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 py-3 bg-gold-500/5 border-b border-gold-500/20 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <Search className="w-4 h-4 text-gold-600" />
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                Showing orders matching "<span className="text-gold-600 font-bold">{searchQuery}</span>" 
                                <span className="ml-2 text-gray-400 font-normal">({filteredOrders.length} found)</span>
                            </p>
                        </div>
                        <button 
                            onClick={() => {
                                searchParams.delete("search");
                                setSearchParams(searchParams);
                            }}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-gold-600 hover:text-gold-700 uppercase"
                        >
                            <X className="w-3 h-3" />
                            Clear
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <ul className="divide-y divide-gray-100 dark:divide-appborder/50">
                {filteredOrders.length === 0 ? (
                    <li className="px-4 py-20 text-center">
                        {searchQuery ? (
                            <div className="flex flex-col items-center justify-center">
                                <Search className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" />
                                <p className="text-lg text-gray-900 dark:text-gray-200 mb-1">No matching transactions found</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Try adjusting your search terms.</p>
                                <button 
                                    onClick={() => {
                                        searchParams.delete("search");
                                        setSearchParams(searchParams);
                                    }}
                                    className="mt-6 px-6 py-2 bg-gray-900 dark:bg-gold-500 text-white dark:text-black rounded-lg text-sm font-bold"
                                >
                                    View all orders
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 font-light">
                                <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                <p className="text-lg text-gray-900 dark:text-gray-200 mb-1">No transactions found</p>
                                <p className="text-sm">Your order history will appear here.</p>
                            </div>
                        )}
                    </li>
                ) : (
                    filteredOrders.map((order) => (
                        <li key={order.id} className="px-4 py-6 sm:px-6 hover:bg-gray-50/50 dark:hover:bg-appbg/50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-base font-semibold text-gray-900 dark:text-gold-500 truncate tracking-wide">
                                            {order.product_name} <span className="text-sm font-normal text-gray-500">(x{order.quantity})</span>
                                        </p>
                                        <div className={`px-2.5 py-0.5 inline-flex items-center gap-1.5 text-xs leading-5 font-bold rounded-full border ${getStatusClass(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Order ID: <span className="font-mono text-gray-400">#ORD-{order.id.toString().padStart(5, '0')}</span> • {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                    {order.tracking_id && (
                                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1">
                                            <Truck className="w-3 h-3" />
                                            Tracking: {order.carrier_name} - <span className="font-mono">{order.tracking_id}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col md:items-end gap-3">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white md:text-right">
                                        ${order.amount.toFixed(2)}
                                    </p>
                                    
                                    {/* Action Buttons Based on Role & Status */}
                                    <div className="flex flex-wrap md:justify-end gap-2">
                                        {user?.role === "Buyer" && order.status === "PENDING" && (
                                            <button
                                                onClick={() => handlePayment(order.id)}
                                                disabled={actionLoading === order.id}
                                                className="w-full sm:w-auto bg-gold-600 dark:bg-gold-500 text-white dark:text-black px-4 py-1.5 rounded-md text-sm font-bold hover:bg-gold-700 dark:hover:bg-gold-400 transition-all shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                                            >
                                                {actionLoading === order.id ? "Processing..." : "Pay Now"}
                                            </button>
                                        )}

                                        {user?.role === "Seller" && order.status === "PAID" && (
                                            <button
                                                onClick={() => handleShipWithProof(order.id)}
                                                disabled={actionLoading === order.id}
                                                className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-indigo-700 transition-all shadow-[0_0_10px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"
                                            >
                                                <Truck className="w-4 h-4" />
                                                {actionLoading === order.id ? "Uploading..." : "Ship with Proof"}
                                            </button>
                                        )}

                                        {user?.role === "Buyer" && order.status === "SHIPPED" && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                                                    disabled={actionLoading === order.id}
                                                    className="w-full sm:w-auto bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-green-700 transition-all shadow-[0_0_10px_rgba(5,150,105,0.3)]"
                                                >
                                                    {actionLoading === order.id ? "Confirming..." : "Mark Delivered"}
                                                </button>
                                                <button
                                                    onClick={() => handleFileDispute(order.id, 'Item Not Received')}
                                                    className="w-full sm:w-auto text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors border border-red-200 dark:border-red-500/20 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-500/10 text-center"
                                                    title="Use this if the item has been stuck in transit for too long."
                                                >
                                                    Report Not Received
                                                </button>
                                            </>
                                        )}

                                        {user?.role === "Buyer" && order.status === "DELIVERED" && (
                                            <>
                                                {!order.has_reviewed && (
                                                    <button
                                                        onClick={() => {
                                                            setReviewingOrderId(order.id);
                                                            setReviewModalOpen(true);
                                                        }}
                                                        className="w-full sm:w-auto bg-gold-500 text-black px-4 py-1.5 rounded-md text-sm font-bold hover:bg-gold-400 transition-all shadow-[0_0_10px_rgba(212,175,55,0.4)] flex items-center justify-center gap-1"
                                                    >
                                                        ★ Leave Review
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleFileDispute(order.id)}
                                                    className="w-full sm:w-auto text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors border border-red-200 dark:border-red-500/20 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-500/10 text-center"
                                                >
                                                    File Dispute
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {/* Review Modal */}
            <AnimatePresence>
                {reviewModalOpen && reviewingOrderId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-appcard rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-appborder"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rate Your Product</h3>
                            
                            <div className="mb-6 flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setReviewRating(star)}
                                        className={`text-4xl transition-transform hover:scale-110 ${star <= reviewRating ? 'text-gold-500 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'text-gray-300 dark:text-gray-600'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Comment (Optional)
                                </label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-appbg border border-gray-200 dark:border-appborder rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:text-white"
                                    rows={3}
                                    placeholder="What did you think about this item?"
                                ></textarea>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setReviewModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={actionLoading === reviewingOrderId}
                                    className="bg-gold-500 text-black px-6 py-2 rounded-xl text-sm font-bold hover:bg-gold-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
                                >
                                    {actionLoading === reviewingOrderId ? "Submitting..." : "Submit Review"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
