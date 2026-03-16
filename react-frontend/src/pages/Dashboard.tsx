import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DisputeList from "../components/DisputeList";
import OrdersList from "../components/OrdersList";

export default function Dashboard() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading || !user) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
                                    Dispute Engine
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-700 capitalize">Role: {user.role}</span>
                            <button
                                onClick={logout}
                                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {user.role === "Admin"
                                ? "Admin Dashboard"
                                : user.role === "Seller"
                                    ? "Seller Dashboard"
                                    : "Dashboard"}
                        </h2>
                        {user.role === "Buyer" && (
                            <Link
                                to="/create-dispute"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                            >
                                + New Dispute
                            </Link>
                        )}
                    </div>

                    {user.role === "Buyer" && <OrdersList />}

                    <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">
                        {user.role === "Admin"
                            ? "All Disputes"
                            : user.role === "Seller"
                                ? "Incoming Disputes"
                                : "My Disputes"}
                    </h3>
                    <DisputeList />
                </div>
            </main>
        </div>
    );
}
