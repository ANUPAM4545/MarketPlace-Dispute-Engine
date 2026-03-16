"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Order {
    id: number;
    product_name: string;
    amount: number;
    status: string;
    created_at: string;
    seller_id: number;
}

export default function OrdersList() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            try {
                const res = await fetch("http://localhost:5001/orders/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch orders");
                const data = await res.json();
                setOrders(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const handleFileDispute = (orderId: number) => {
        // Redirect to create dispute page with order ID query param
        // For now, simpler implementation:
        // Actually, we need to pass order ID to dispute creation.
        // Let's assume the user copies the ID or we auto-fill it.
        // Better: redirect to /create-dispute?orderId=...
        // But create-dispute page needs to handle query param.
        // For now, let's just copy ID to clipboard or show it.
        alert(`Order ID: ${orderId}. Please use this to file a dispute.`);
        router.push("/create-dispute");
    };

    const seedOrders = async () => {
        try {
            const res = await fetch("http://localhost:5001/orders/seed", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                window.location.reload();
            } else {
                alert("Failed to seed orders");
            }
        } catch (e) {
            alert("Error seeding orders");
        }
    }

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">My Orders</h3>
                {orders.length === 0 && (
                    <button onClick={seedOrders} className="text-sm text-indigo-600 hover:text-indigo-500">
                        Seed Demo Orders
                    </button>
                )}
            </div>
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
                                    {order.status === 'DELIVERED' && (
                                        <button
                                            onClick={() => handleFileDispute(order.id)}
                                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                                        >
                                            File Dispute
                                        </button>
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
