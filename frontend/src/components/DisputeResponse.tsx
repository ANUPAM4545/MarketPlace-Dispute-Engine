"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface DisputeResponseProps {
    disputeId: number;
    onResponseSubmitted: () => void;
}

export default function DisputeResponse({ disputeId, onResponseSubmitted }: DisputeResponseProps) {
    const { token } = useAuth();
    const [response, setResponse] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch(`http://localhost:5001/disputes/${disputeId}/respond`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ response }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.msg || "Failed to submit response");
            }

            setResponse("");
            onResponseSubmitted();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Submit Response</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}
                <div>
                    <label htmlFor="response" className="block text-sm font-medium text-gray-700">
                        Explanation
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="response"
                            name="response"
                            rows={4}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="Provide your side of the story..."
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
