import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Message sent! Our team will contact you shortly.");
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
        setIsSubmitting(false);
    };

    return (
        <div className="bg-white dark:bg-appbg min-h-screen font-sans selection:bg-gold-500 selection:text-black transition-colors duration-500">
            <div className="relative isolate pt-12 pb-24 lg:pt-28 lg:pb-32 overflow-hidden">
                {/* Ambient Background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <motion.div 
                        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px]"
                    />
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Left Content */}
                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-widest mb-6">
                                    <MessageSquare className="w-3 h-3" /> Get in touch
                                </div>
                                <h1 className="text-4xl md:text-6xl tracking-tight font-light text-gray-900 dark:text-white mb-8">
                                    Let's build something <br />
                                    <span className="font-serif italic text-gold-600 dark:text-gold-500 font-medium">secure</span> together.
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-lg">
                                    Have questions about our AI engine or enterprise solutions? Our team of experts is ready to help you scale your marketplace with absolute confidence.
                                </p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="space-y-8"
                            >
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-appcard flex items-center justify-center border border-gray-100 dark:border-white/5 group-hover:border-gold-500/30 transition-colors">
                                        <Mail className="w-5 h-5 text-gold-600 dark:text-gold-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                                        <p className="text-lg text-gray-900 dark:text-white font-medium">hello@disputeengine.ai</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-appcard flex items-center justify-center border border-gray-100 dark:border-white/5 group-hover:border-gold-500/30 transition-colors">
                                        <Phone className="w-5 h-5 text-gold-600 dark:text-gold-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Call Support</p>
                                        <p className="text-lg text-gray-900 dark:text-white font-medium">+1 (888) DISPUTE-AI</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-appcard flex items-center justify-center border border-gray-100 dark:border-white/5 group-hover:border-gold-500/30 transition-colors">
                                        <MapPin className="w-5 h-5 text-gold-600 dark:text-gold-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Headquarters</p>
                                        <p className="text-lg text-gray-900 dark:text-white font-medium leading-relaxed">
                                            One Infinite Loop, <br />
                                            Cupertino, CA 95014
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gold-500/5 blur-3xl rounded-full opacity-50 pointer-events-none"></div>
                            <form 
                                onSubmit={handleSubmit}
                                className="relative bg-white/40 dark:bg-appcard/40 backdrop-blur-3xl border border-white/50 dark:border-white/5 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl space-y-6"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-white/50 dark:bg-appbg/50 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gold-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700" 
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Work Email</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-white/50 dark:bg-appbg/50 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gold-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700" 
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                                    <select 
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full bg-white/50 dark:bg-appbg/50 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gold-500 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option>General Inquiry</option>
                                        <option>Partnership Request</option>
                                        <option>Technical Support</option>
                                        <option>Enterprise Sales</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Message</label>
                                    <textarea 
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full bg-white/50 dark:bg-appbg/50 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gold-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 resize-none" 
                                        placeholder="Tell us about your project..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-900 dark:bg-gold-500 text-white dark:text-black font-bold py-5 rounded-2xl shadow-xl hover:bg-black dark:hover:bg-gold-400 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>

            <footer className="py-12 text-center border-t border-gray-100 dark:border-appborder/30">
                <p className="text-xs text-gray-400 font-light uppercase tracking-widest">© 2026 DisputeEngine. Global Infrastructure.</p>
            </footer>
        </div>
    );
}
