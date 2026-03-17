import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

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

    if (loading) return <div>Loading disputes...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {disputes.length === 0 ? (
                    <li className="px-4 py-4 text-center text-gray-500">No disputes found.</li>
                ) : (
                    disputes.map((dispute) => (
                        <li key={dispute.id}>
                            <Link to={`/disputes/${dispute.id}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-indigo-600 truncate">
                                            {dispute.category}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dispute.status === "OPEN"
                                                        ? "bg-green-100 text-green-800"
                                                        : dispute.status === "RESOLVED"
                                                            ? "bg-gray-100 text-gray-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {dispute.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {dispute.description.substring(0, 100)}...
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>Created on {new Date(dispute.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
