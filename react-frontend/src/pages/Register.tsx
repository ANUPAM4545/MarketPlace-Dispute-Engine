import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail, User, Phone, ChevronDown, ShieldCheck } from "lucide-react";
import api from "../lib/api";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from "react-hot-toast";

import ThemeToggle from "../components/ThemeToggle";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Buyer");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await api.post("/auth/register", { name, email, phone, password, role });
            toast.success("Registration successful! Please sign in.");
            navigate("/login");
        } catch (err: any) {
            toast.error(err.response?.data?.msg || err.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: 0.08,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="relative isolate flex min-h-screen items-center justify-center bg-white dark:bg-appbg p-4 sm:p-8 font-sans selection:bg-gold-500 selection:text-black overflow-hidden transition-colors duration-700">
            {/* Ultra-Premium Background Glowing Orbs - Enhanced */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div 
                    animate={{ 
                        x: [0, -100, 0],
                        y: [0, 80, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-gold-400/10 dark:bg-gold-500/5 rounded-full blur-[120px]"
                />
                <motion.div 
                    animate={{ 
                        x: [0, 120, 0],
                        y: [0, -60, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-[10%] -left-[10%] w-[700px] h-[700px] bg-emerald-400/5 dark:bg-emerald-900/10 rounded-full blur-[150px]"
                />
            </div>

            {/* Theme Toggle Positioned Absolutely */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute top-8 right-8 z-50"
            >
                <ThemeToggle />
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-lg space-y-8 rounded-[2.5rem] bg-white/40 dark:bg-appcard/40 backdrop-blur-3xl border border-white/50 dark:border-white/5 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-colors duration-500 z-10"
            >
                <div className="text-center space-y-4">
                    <motion.div variants={itemVariants} className="flex justify-center">
                        <Link to="/" className="relative group">
                            <motion.div 
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-50 dark:from-gold-500/20 dark:to-gold-500/5 flex items-center justify-center border border-gold-200/50 dark:border-gold-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500"
                            >
                                <ShieldCheck className="h-8 w-8 text-gold-600 dark:text-gold-500" />
                            </motion.div>
                            <div className="absolute -inset-2 bg-gold-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Link>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <h2 className="text-4xl font-light tracking-tight text-gray-900 dark:text-white">
                            Create <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">account</span>
                        </h2>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-light tracking-wide uppercase">Engine Registration V2.0</p>
                    </motion.div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <User className="h-5 w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-gold-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                required
                                className={cn(
                                    "block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-appbg/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all duration-300",
                                    "hover:ring-gray-300 dark:hover:ring-white/20 hover:bg-white dark:hover:bg-appbg"
                                )}
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {/* Email */}
                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-gold-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                className={cn(
                                    "block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-appbg/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all duration-300",
                                    "hover:ring-gray-300 dark:hover:ring-white/20 hover:bg-white dark:hover:bg-appbg"
                                )}
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {/* Phone */}
                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Phone className="h-5 w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-gold-500 transition-colors" />
                            </div>
                            <input
                                type="tel"
                                required
                                className={cn(
                                    "block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-appbg/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all duration-300",
                                    "hover:ring-gray-300 dark:hover:ring-white/20 hover:bg-white dark:hover:bg-appbg"
                                )}
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        {/* Role */}
                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <User className="h-5 w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-gold-500 transition-colors" />
                            </div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className={cn(
                                    "block w-full rounded-2xl border-0 py-4 pl-12 pr-10 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-appbg/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 appearance-none transition-all duration-300",
                                    "hover:ring-gray-300 dark:hover:ring-white/20 hover:bg-white dark:hover:bg-appbg hover:cursor-pointer"
                                )}
                            >
                                <option value="Buyer">Buyer Account</option>
                                <option value="Seller">Seller Account</option>
                                <option value="Admin">System Admin</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                            </div>
                        </div>
                        {/* Password */}
                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-gold-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                className={cn(
                                    "block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-appbg/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all duration-300",
                                    "hover:ring-gray-300 dark:hover:ring-white/20 hover:bg-white dark:hover:bg-appbg"
                                )}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* Confirm Password */}
                        <div className="group relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-gold-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                className={cn(
                                    "block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-appbg/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gold-500 dark:focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all duration-300",
                                    "hover:ring-gray-300 dark:hover:ring-white/20 hover:bg-white dark:hover:bg-appbg"
                                )}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full justify-center rounded-2xl bg-gray-900 dark:bg-gold-500 px-4 py-4 text-sm font-bold text-white dark:text-black shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_20px_rgba(212,175,55,0.1)] hover:bg-black dark:hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                                Initialize Enterprise Account
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100 dark:border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                            <span className="bg-white/0 px-4 text-gray-400 dark:text-gray-600">Fast Enrollment</span>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex justify-center mt-4">
                        <div className="w-full p-0.5 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/5 rounded-xl">
                            <GoogleLogin
                                theme="filled_black"
                                width="100%"
                                shape="pill"
                                onSuccess={async (credentialResponse) => {
                                    setIsLoading(true);
                                    try {
                                        const res = await api.post("/auth/google", { token: credentialResponse.credential, role: role });
                                        localStorage.setItem("token", res.data.access_token);
                                        localStorage.setItem("role", res.data.role);
                                        localStorage.setItem("name", res.data.name);
                                        toast.success("Successfully registered and logged in");
                                        window.location.href = "/dashboard";
                                    } catch (err: any) {
                                        toast.error(err.response?.data?.msg || err.message || "Google Login failed");
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                onError={() => {
                                    toast.error("Google Login failed");
                                }}
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center text-sm font-light">
                        <span className="text-gray-500 dark:text-gray-500">Already a member? </span>
                        <Link
                            to="/login"
                            className="font-bold text-gold-600 dark:text-gold-500 hover:text-gold-700 dark:hover:text-gold-400 transition-colors"
                        >
                            Sign in to Portal
                        </Link>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
}
