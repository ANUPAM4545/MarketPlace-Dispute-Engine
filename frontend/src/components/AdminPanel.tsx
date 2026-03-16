"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface AdminPanelProps {
    disputeId: number;
    onResolved: () => void;
}

export default function AdminPanel({ disputeId, onResolved }: AdminPanelProps) {
    const { token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleResolve = async (resolution: "RESOLVED" | "REJECTED") => {
        if (!confirm(`Are you sure you want to mark this dispute as ${resolution}?`)) return;

        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch(`http://localhost:5001/disputes/${disputeId}/resolve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ resolution }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.msg || "Failed to resolve dispute");
            }

            onResolved();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h4 className="text-lg font-medium text-indigo-900 mb-4">Admin Actions</h4>
            {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-4">
                    {error}
                </div>
            )}
            <div className="flex space-x-4">
                <button
                    onClick={() => handleResolve("RESOLVED")}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                    {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    Resolve (Refund Buyer)
                </button>
                <button
                    onClick={() => handleResolve("REJECTED")}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                    {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    Reject Dispute
                </button>
            </div>
        </div>
    );
}
