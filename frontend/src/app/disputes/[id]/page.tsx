"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DisputeResponse from "@/components/DisputeResponse";
import AdminPanel from "@/components/AdminPanel";

interface Dispute {
    id: number;
    status: string;
    category: string;
    description: string;
    created_at: string;
    buyer_id: number;
    seller_response?: string;
}

export default function DisputeDetails() {
    const { token, user, loading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const [dispute, setDispute] = useState<Dispute | null>(null);
    const [error, setError] = useState("");
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        const fetchDispute = async () => {
            if (!token || !params?.id) return;
            try {
                // Ideally backend should have a specific GET /disputes/:id endpoint
                // For now, I'll fetch all and filter client side or assume I need to add that endpoint
                // Let's UPDATE backend to support GET /disputes/:id first or mocking it ?
                // Wait, I didn't add GET /disputes/:id in backend yet. 
                // I should add it. For now, I will use a placeholder or assume I will add it.
                // Let's assume I will add it in the next step or right now.

                // Correction: I should add the endpoint to backend/routes/disputes.py
                // But to save steps, I will implement this page assuming the endpoint exists
                // and then fix the backend.

                const res = await fetch(`http://localhost:5001/disputes/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch dispute details");
                const data = await res.json();
                setDispute(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setFetchLoading(false);
            }
        };

        if (!loading) {
            fetchDispute();
        }
    }, [token, params?.id, loading]);

    if (loading || fetchLoading) return <div className="p-8">Loading details...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    if (!dispute) return <div className="p-8">Dispute not found</div>;

    return (
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Dispute #{dispute.id}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Details and resolution status.
                            </p>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dispute.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                            dispute.status === 'RESOLVED' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {dispute.status}
                        </span>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Category
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {dispute.category}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Description
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {dispute.description}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Created At
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {new Date(dispute.created_at).toLocaleDateString()}
                                </dd>
                            </div>
                            {/* Show Seller Response if available */}
                            {dispute.seller_response && (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Seller Response
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {dispute.seller_response}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex flex-col space-y-4">
                            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500 self-start">
                                &larr; Back to Dashboard
                            </Link>

                            {user?.role === 'Seller' && dispute.status !== 'RESOLVED' && dispute.status !== 'REJECTED' && !dispute.seller_response && (
                                <DisputeResponse
                                    disputeId={dispute.id}
                                    onResponseSubmitted={() => window.location.reload()}
                                />
                            )}

                            {user?.role === 'Admin' && dispute.status !== 'RESOLVED' && dispute.status !== 'REJECTED' && (
                                <AdminPanel
                                    disputeId={dispute.id}
                                    onResolved={() => window.location.reload()}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
