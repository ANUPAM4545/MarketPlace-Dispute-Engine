import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreateDispute() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState("");
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

            const res = await fetch("http://localhost:5001/disputes/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Failed to create dispute");

            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (user?.role && user.role !== "Buyer") {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500">Only Buyers can create disputes.</p>
                <Link
                    to="/dashboard"
                    className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block"
                >
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create a New Dispute
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="text-red-500 text-center">{error}</div>}

                        <div>
                            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
                                Order ID (Enter a number)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="orderId"
                                    name="orderId"
                                    type="number"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <div className="mt-1">
                                <select
                                    id="category"
                                    name="category"
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
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
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="evidence" className="block text-sm font-medium text-gray-700">
                                Evidence (Optional)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="evidence"
                                    name="evidence"
                                    type="file"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit Dispute"}
                            </button>
                        </div>
                        <div className="text-center">
                            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-500 text-sm">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
