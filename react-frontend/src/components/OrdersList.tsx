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

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {user?.role === 'Seller' ? 'My Sales' : 'My Orders'}
                </h3>
                <div className="flex items-center space-x-4">
                    {user?.role === "Buyer" && (
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            {showCreateForm ? "Cancel" : "+ Create New Order"}
                        </button>
                    )}
                    {orders.length === 0 && (
                        <button
                            onClick={seedOrders}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Seed Demo Orders
                        </button>
                    )}
                </div>
            </div>

            {showCreateForm && (
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-t border-gray-200">
                    <form onSubmit={handleCreateOrder} className="flex flex-col space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input 
                                type="text" 
                                required 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={newOrder.product_name}
                                onChange={e => setNewOrder({...newOrder, product_name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                            <input 
                                type="number" 
                                required
                                min="0.01" step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={newOrder.amount}
                                onChange={e => setNewOrder({...newOrder, amount: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Seller</label>
                            <select 
                                required
                                className="mt-1 bg-white block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {createLoading ? "Creating..." : "Submit Order"}
                        </button>
                    </form>
                </div>
            )}

            <ul className="divide-y divide-gray-200">
                {orders.length === 0 ? (
                    <li className="px-4 py-4 text-center text-gray-500">No orders found.</li>
                ) : (
                    orders.map((order) => (
                        <li key={order.id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                    {order.product_name}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        Amount: ${order.amount}
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <p className="mr-4">
                                        Purchased on {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                    {user?.role === "Buyer" && order.status === "DELIVERED" && (
                                        <button
                                            onClick={() => handleFileDispute(order.id)}
                                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                                        >
                                            File Dispute
                                        </button>
                                    )}
                                    {user?.role === "Seller" && (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-500">Pre-delivery Evidence:</span>
                                            <input 
                                                type="file" 
                                                id={`evidence-${order.id}`}
                                                className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition-colors cursor-pointer"
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
