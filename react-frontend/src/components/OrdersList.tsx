import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

interface Order {
    id: number;
    product_name: string;
    amount: number;
    status: string;
    created_at: string;
    seller_id: number;
}

export default function OrdersList() {
    const { token, user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // New Order State
    const [sellers, setSellers] = useState<{id: number, name: string}[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newOrder, setNewOrder] = useState({ product_name: "", amount: "", seller_id: "" });
    const [createLoading, setCreateLoading] = useState(false);

    useEffect(() => {
        if (user?.role === 'Buyer') {
            api.get("/auth/sellers").then(res => setSellers(res.data)).catch(console.error);
        }
    }, [user?.role]);

    useEffect(() => {
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

        fetchOrders();
    }, [token]);

    const handleFileDispute = (orderId: number) => {
        navigate("/create-dispute", { state: { orderId } });
    };

    const handleUploadEvidence = async (orderId: number, file: File) => {
        const formData = new FormData();
        formData.append("evidence", file);
        try {
            await api.post(`/orders/${orderId}/evidence`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Evidence uploaded successfully!");
        } catch (err: any) {
            alert(err.response?.data?.msg || "Failed to upload evidence");
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOrder.product_name || !newOrder.amount || !newOrder.seller_id) return;
        setCreateLoading(true);
        try {
            await api.post("/orders/", newOrder);
            alert("Order created successfully!");
            setShowCreateForm(false);
            setNewOrder({ product_name: "", amount: "", seller_id: "" });
            window.location.reload();
        } catch (err: any) {
            alert(err.response?.data?.msg || "Failed to create order");
        } finally {
            setCreateLoading(false);
        }
    };

    const seedOrders = async () => {
        try {
            await api.post("/orders/seed");
            window.location.reload();
        } catch {
            alert("Error seeding orders");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-light">Loading orders...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-light">Error: {error}</div>;

    return (
        <div className="bg-white dark:bg-appcard shadow-[0_0_15px_rgba(0,0,0,0.05)] overflow-hidden rounded-xl mb-8 border border-gray-100 dark:border-appborder transition-colors duration-200">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-100 dark:border-appborder/50">
                <h3 className="text-xl leading-6 font-serif italic text-gray-900 dark:text-gold-500 font-medium tracking-wide">
                    {user?.role === 'Seller' ? 'My Sales' : 'My Orders'}
                </h3>
                <div className="flex items-center space-x-4">
                    {user?.role === "Buyer" && (
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="text-sm font-medium text-gold-600 hover:text-gold-500 dark:text-gold-500 dark:hover:text-gold-400 transition-colors bg-gold-50 hover:bg-gold-100 dark:bg-gold-500/10 dark:hover:bg-gold-500/20 px-3 py-1.5 rounded-lg border border-gold-200 dark:border-gold-500/30"
                        >
                            {showCreateForm ? "Cancel" : "+ Create New Order"}
                        </button>
                    )}
                    {orders.length === 0 && (
                        <button
                            onClick={seedOrders}
                            className="text-sm text-gray-500 hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400 transition-colors"
                        >
                            Seed Demo Orders
                        </button>
                    )}
                </div>
            </div>

            {showCreateForm && (
                <div className="px-4 py-6 sm:px-6 bg-gray-50 dark:bg-appbg/50 border-b border-gray-200 dark:border-appborder transition-colors duration-200">
                    <form onSubmit={handleCreateOrder} className="flex flex-col space-y-5 max-w-lg mx-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                            <input 
                                type="text" 
                                required 
                                className="mt-1 block w-full border border-gray-300 dark:border-appborder bg-white dark:bg-appbg text-gray-900 dark:text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-all"
                                value={newOrder.product_name}
                                onChange={e => setNewOrder({...newOrder, product_name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
                            <input 
                                type="number" 
                                required
                                min="0.01" step="0.01"
                                className="mt-1 block w-full border border-gray-300 dark:border-appborder bg-white dark:bg-appbg text-gray-900 dark:text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-all"
                                value={newOrder.amount}
                                onChange={e => setNewOrder({...newOrder, amount: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Seller</label>
                            <select 
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-appborder bg-white dark:bg-appbg text-gray-900 dark:text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-all appearance-none"
                                value={newOrder.seller_id}
                                onChange={e => setNewOrder({...newOrder, seller_id: e.target.value})}
                            >
                                <option value="">Choose a seller...</option>
                                {sellers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={createLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.2)] text-sm font-semibold text-white dark:text-appbg bg-gold-600 dark:bg-gold-500 hover:bg-gold-700 dark:hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-70 transition-all active:scale-[0.98]"
                        >
                            {createLoading ? "Creating..." : "Submit Order"}
                        </button>
                    </form>
                </div>
            )}

            <ul className="divide-y divide-gray-100 dark:divide-appborder/50">
                {orders.length === 0 ? (
                    <li className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 font-light">No orders found.</li>
                ) : (
                    orders.map((order) => (
                        <li key={order.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50/50 dark:hover:bg-appbg/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gold-500 truncate tracking-wide">
                                    {order.product_name}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <p className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border ${order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-gold-50 text-gold-700 border-gold-200 dark:bg-gold-500/10 dark:text-gold-400 dark:border-gold-500/20'}`}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between items-center">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        Amount: <span className="ml-1 text-gold-600 dark:text-gold-400">${order.amount}</span>
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                    <p className="mr-6 font-light">
                                        Purchased on {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                    {user?.role === "Buyer" && order.status === "DELIVERED" && (
                                        <button
                                            onClick={() => handleFileDispute(order.id)}
                                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors border-b border-transparent hover:border-red-400"
                                        >
                                            File Dispute
                                        </button>
                                    )}
                                    {user?.role === "Seller" && (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-400">Pre-delivery Evidence:</span>
                                            <input 
                                                type="file" 
                                                id={`evidence-${order.id}`}
                                                className="block w-full text-xs text-gray-500 dark:text-gray-400 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border border-gold-200 dark:border-gold-500/30 file:text-xs file:font-semibold file:bg-gold-50 file:text-gold-700 dark:file:bg-gold-500/10 dark:file:text-gold-400 hover:file:bg-gold-100 dark:hover:file:bg-gold-500/20 transition-colors cursor-pointer focus:outline-none"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        handleUploadEvidence(order.id, e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
