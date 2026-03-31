import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function CreateDispute() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [orderId, setOrderId] = useState(location.state?.orderId?.toString() || "");
    const [category, setCategory] = useState("Refund");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("order_id", orderId);
            formData.append("category", category);
            formData.append("description", description);
            if (file) {
                formData.append("evidence", file);
            }

            await api.post("/disputes/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.msg || err.message || "Failed to create dispute");
        } finally {
            setSubmitting(false);
        }
    };

    if (user?.role && user.role !== "Buyer") {
        return (
            <div className="p-8 text-center min-h-screen bg-white dark:bg-appbg transition-colors duration-200">
                <p className="text-red-500 font-medium">Only Buyers can create disputes.</p>
                <Link
                    to="/dashboard"
                    className="text-gold-600 hover:text-gold-500 mt-4 inline-block font-medium"
                >
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-gold-500 selection:text-black">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl tracking-wide font-light text-gray-900 dark:text-white">
                    Create a <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">New Dispute</span>
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-appcard py-8 px-4 shadow-[0_0_20px_rgba(0,0,0,0.05)] sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-appborder">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-center border border-red-100 dark:border-red-900/50 font-medium text-sm">{error}</div>}

                        <div>
                            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Order ID
                            </label>
                            <div className="mt-1">
                                <input
                                    id="orderId"
                                    name="orderId"
                                    type="number"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-appborder bg-white dark:bg-appbg text-gray-900 dark:text-white rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-all"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Category
                            </label>
                            <div className="mt-1">
                                <select
                                    id="category"
                                    name="category"
                                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-appborder bg-white dark:bg-appbg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm rounded-lg transition-all appearance-none"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option>Refund</option>
                                    <option>Wrong Item</option>
                                    <option>Late Delivery</option>
                                    <option>Fraud</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-appborder bg-white dark:bg-appbg text-gray-900 dark:text-white rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-all resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Evidence <span className="text-gray-400 dark:text-gray-500 font-light">(Optional)</span>
                            </label>
                            <div className="mt-1 flex items-center">
                                <input
                                    id="evidence"
                                    name="evidence"
                                    type="file"
                                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gold-50 file:text-gold-700 dark:file:bg-gold-500/10 dark:file:text-gold-400 hover:file:bg-gold-100 dark:hover:file:bg-gold-500/20 transition-all cursor-pointer"
                                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex justify-center py-2.5 px-4 rounded-lg bg-gold-600 dark:bg-gold-500 text-sm font-semibold text-white dark:text-appbg shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:bg-gold-700 dark:hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {submitting ? "Submitting..." : "Submit Dispute"}
                            </button>
                        </div>
                        <div className="text-center pt-2">
                            <Link to="/dashboard" className="text-gray-500 hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400 text-sm font-medium transition-colors border-b border-transparent hover:border-gold-500">
                                Cancel & Return
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
