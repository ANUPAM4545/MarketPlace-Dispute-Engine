import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail, User, Phone, ChevronDown, ShieldCheck } from "lucide-react";
import api from "../lib/api";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Buyer");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await api.post("/auth/register", { name, email, phone, password, role });
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.msg || err.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative isolate flex min-h-screen items-center justify-center bg-gray-50 dark:bg-appbg p-4 sm:p-8 font-sans selection:bg-gold-500 selection:text-black overflow-hidden transition-colors duration-500">
            {/* Ultra-Premium Background Glowing Orbs */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-gold-400/20 dark:bg-gold-500/10 rounded-full blur-[100px] pointer-events-none -z-10"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.4, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-gray-400/10 dark:bg-appcard/40 rounded-full blur-[120px] pointer-events-none -z-10"
            />

            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md space-y-8 rounded-3xl glass-card p-8 sm:p-10 !backdrop-blur-2xl transition-colors duration-200 z-10"
            >
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center justify-center mb-6 hover:scale-105 transition-transform">
                        <ShieldCheck className="h-10 w-10 text-gold-600 dark:text-gold-500" />
                    </Link>
                    <h2 className="text-3xl font-light tracking-wide text-gray-900 dark:text-white">
                        Create an <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">account</span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-light">
                        Join the marketplace dispute resolution platform
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 text-center font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Name */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                required
                                className={cn(
                                    "block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 dark:text-white bg-white dark:bg-appbg shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-appborder placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all",
                                    "hover:ring-gray-400 dark:hover:ring-gray-600"
                                )}
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {/* Email */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="email"
                                required
                                className={cn(
                                    "block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 dark:text-white bg-white dark:bg-appbg shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-appborder placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all",
                                    "hover:ring-gray-400 dark:hover:ring-gray-600"
                                )}
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {/* Phone */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="tel"
                                required
                                className={cn(
                                    "block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 dark:text-white bg-white dark:bg-appbg shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-appborder placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all",
                                    "hover:ring-gray-400 dark:hover:ring-gray-600"
                                )}
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        {/* Password */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="password"
                                required
                                className={cn(
                                    "block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 dark:text-white bg-white dark:bg-appbg shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-appborder placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all",
                                    "hover:ring-gray-400 dark:hover:ring-gray-600"
                                )}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* Confirm Password */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="password"
                                required
                                className={cn(
                                    "block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 dark:text-white bg-white dark:bg-appbg shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-appborder placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all",
                                    "hover:ring-gray-400 dark:hover:ring-gray-600"
                                )}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {/* Role */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            </div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className={cn(
                                    "block w-full rounded-lg border-0 py-3 pl-10 pr-10 text-gray-900 dark:text-white bg-white dark:bg-appbg shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-appborder focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 appearance-none transition-all",
                                    "hover:ring-gray-400 dark:hover:ring-gray-600 hover:cursor-pointer"
                                )}
                            >
                                <option value="Buyer">Buyer</option>
                                <option value="Seller">Seller</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full justify-center rounded-lg bg-gold-600 dark:bg-gold-500 px-4 py-3 text-sm font-semibold text-white dark:text-appbg shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:bg-gold-700 dark:hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                            Register
                        </button>
                    </div>

                    <div className="text-center text-sm font-light">
                        <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
                        <Link
                            to="/login"
                            className="font-medium text-gold-600 dark:text-gold-500 hover:text-gold-700 dark:hover:text-gold-400 transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
