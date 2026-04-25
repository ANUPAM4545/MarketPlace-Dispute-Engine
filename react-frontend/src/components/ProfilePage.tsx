import { useEffect, useState } from "react";
import api from "../lib/api";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Shield, Check, Lock, Eye, EyeOff } from "lucide-react";

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData>({
        name: "", email: "", phone: "", address: "", role: ""
    });
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/auth/profile");
                setProfile(res.data);
            } catch (err: any) {
                setErrorMsg("Failed to load profile details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg("");
        setSuccessMsg("");
        
        try {
            await api.put("/auth/profile", {
                name: profile.name,
                phone: profile.phone,
                address: profile.address,
                password: password,
                old_password: oldPassword
            });
            setSuccessMsg("Profile updated successfully!");
            setPassword("");
            setOldPassword("");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            setErrorMsg(err.response?.data?.msg || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-12 text-center text-gray-500 font-light">Loading profile details...</div>;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                    <User className="w-6 h-6 text-gold-500" />
                    Manage Your Profile
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Update your personal information and secure your account.
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white dark:bg-appcard rounded-2xl p-8 border border-gray-100 dark:border-appborder/50 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gold-500 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Full Name
                            </label>
                            <input 
                                type="text" required
                                value={profile.name}
                                onChange={e => setProfile({...profile, name: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-appbg border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                Email Address <span className="text-[10px] text-gray-400 font-normal normal-case tracking-normal">(Cannot be changed)</span>
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="email" disabled
                                    value={profile.email}
                                    className="w-full bg-gray-100 dark:bg-appbg/50 border-none rounded-xl py-3 pl-10 pr-4 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Shipping Details */}
                <div className="bg-white dark:bg-appcard rounded-2xl p-8 border border-gray-100 dark:border-appborder/50 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gold-500 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Contact Details
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5" /> Phone Number
                            </label>
                            <input 
                                type="tel" 
                                placeholder="e.g. +1 234 567 8900"
                                value={profile.phone}
                                onChange={e => setProfile({...profile, phone: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-appbg border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5" /> Shipping Address
                            </label>
                            <textarea 
                                placeholder="Enter your full physical address..."
                                value={profile.address}
                                onChange={e => setProfile({...profile, address: e.target.value})}
                                className="w-full bg-gray-50 dark:bg-appbg border-none rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all h-24 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white dark:bg-appcard rounded-2xl p-8 border border-gray-100 dark:border-appborder/50 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gold-500 mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" /> Current Password
                            </label>
                            <div className="relative">
                                <input 
                                    type={showOldPassword ? "text" : "password"} 
                                    value={oldPassword}
                                    onChange={e => setOldPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full bg-gray-50 dark:bg-appbg border-none rounded-xl py-3 pl-4 pr-12 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-500 transition-colors"
                                >
                                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" /> New Password
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full bg-gray-50 dark:bg-appbg border-none rounded-xl py-3 pl-4 pr-12 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 transition-all font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions & Alerts */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    <div className="flex-1 w-full">
                        {errorMsg && (
                            <p className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-lg border border-red-100 dark:border-red-500/20">
                                {errorMsg}
                            </p>
                        )}
                        {successMsg && (
                            <p className="text-sm font-medium text-green-500 bg-green-50 dark:bg-green-500/10 px-4 py-2 rounded-lg border border-green-100 dark:border-green-500/20 flex items-center gap-2">
                                <Check className="w-4 h-4" /> {successMsg}
                            </p>
                        )}
                    </div>
                    
                    <button
                        type="submit" disabled={saving}
                        className="w-full sm:w-auto px-8 py-3 bg-gold-600 dark:bg-gold-500 text-white dark:text-black rounded-xl font-bold hover:bg-gold-700 dark:hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20 active:scale-95 disabled:opacity-70 flex justify-center"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
