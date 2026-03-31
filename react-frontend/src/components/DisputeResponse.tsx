import React, { useState } from "react";

import { Loader2 } from "lucide-react";
import api from "../lib/api";

interface DisputeResponseProps {
    disputeId: number;
    onResponseSubmitted: () => void;
}

export default function DisputeResponse({ disputeId, onResponseSubmitted }: DisputeResponseProps) {
    const [response, setResponse] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            await api.post(`/disputes/${disputeId}/respond`, { response });
            setResponse("");
            onResponseSubmitted();
        } catch (err: any) {
            setError(err.response?.data?.msg || err.message || "Failed to submit response");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-6 bg-white dark:bg-appbg p-5 rounded-xl border border-gray-200 dark:border-appborder transition-colors duration-200">
            <h4 className="text-lg font-serif italic text-gray-900 dark:text-gold-500 mb-4 tracking-wide font-medium">Submit Response</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50">{error}</div>
                )}
                <div>
                    <label htmlFor="response" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Explanation
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="response"
                            name="response"
                            rows={4}
                            className="block w-full rounded-lg border border-gray-300 dark:border-appborder bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-3 transition-all focus:outline-none focus:ring-2 resize-none"
                            placeholder="Provide your side of the story..."
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.2)] text-white dark:text-gray-900 bg-gold-600 dark:bg-gold-500 hover:bg-gold-700 dark:hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 transition-all active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Response"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
