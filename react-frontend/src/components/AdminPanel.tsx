import { useState } from "react";

import { Loader2 } from "lucide-react";
import api from "../lib/api";

interface AdminPanelProps {
    disputeId: number;
    onResolved: () => void;
}

export default function AdminPanel({ disputeId, onResolved }: AdminPanelProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleResolve = async (resolution: "RESOLVED" | "REJECTED") => {
        setIsSubmitting(true);
        setError("");

        try {
            await api.post(`/disputes/${disputeId}/resolve`, { resolution });
            onResolved();
        } catch (err: any) {
            setError(err.response?.data?.msg || err.message || "Failed to resolve dispute");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-6 bg-gold-50/50 dark:bg-gold-500/10 p-5 rounded-xl border border-gold-200 dark:border-gold-500/30 transition-colors duration-200">
            <h4 className="text-lg font-serif italic text-gold-900 dark:text-gold-500 mb-4 tracking-wide font-medium">Admin Actions</h4>
            {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg mb-4 border border-red-200 dark:border-red-900/50">{error}</div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => handleResolve("RESOLVED")}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white dark:text-gray-900 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all"
                >
                    {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    Resolve (Refund Buyer)
                </button>
                <button
                    onClick={() => handleResolve("REJECTED")}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white dark:text-gray-900 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all"
                >
                    {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    Reject Dispute
                </button>
            </div>
        </div>
    );
}
