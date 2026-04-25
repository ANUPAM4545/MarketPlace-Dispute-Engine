import { useState, useEffect, useRef } from "react";
import api from "../lib/api";
import { Send, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface Message {
    id: number;
    sender_id: number;
    sender_name: string;
    sender_role: string;
    content: string;
    created_at: string;
}

interface DisputeChatProps {
    disputeId: number;
    currentUserId?: number;
}

export default function DisputeChat({ disputeId, currentUserId }: DisputeChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/disputes/${disputeId}/messages`);
            setMessages(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [disputeId]);

    useEffect(() => {
        // Auto-scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await api.post(`/disputes/${disputeId}/messages`, { content: newMessage });
            setNewMessage("");
            fetchMessages(); // Immediately fetch to update UI
        } catch (err: any) {
            toast.error(err.response?.data?.msg || "Failed to send message");
        }
    };

    if (loading) return <div className="text-center p-4 text-gray-500">Loading chat...</div>;

    return (
        <div className="flex flex-col h-[450px] sm:h-[600px] border border-gray-200 dark:border-appborder rounded-2xl overflow-hidden bg-white dark:bg-appcard shadow-sm mt-8">
            <div className="p-4 border-b border-gray-200 dark:border-appborder bg-gray-50 dark:bg-appbg/50">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gold-600" />
                    Secure Resolution Chat
                </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-appbg/20">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 font-light mt-10">No messages yet. Start the conversation.</div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUserId;
                        const isAdmin = msg.sender_role === 'Admin';
                        
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id} 
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                                <div className="flex items-center gap-2 mb-1 px-1">
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {msg.sender_name} 
                                        {isAdmin && <span className="ml-1 text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded">ADMIN</span>}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-light">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                                    isMe 
                                        ? 'bg-gold-500 text-black rounded-tr-none' 
                                        : isAdmin 
                                            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
                                            : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-appborder bg-white dark:bg-appcard flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message securely..."
                    className="flex-1 bg-gray-50 dark:bg-appbg border border-gray-200 dark:border-appborder rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:text-white transition-all"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-gray-900 dark:bg-gold-500 text-white dark:text-black p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black dark:hover:bg-gold-400 transition-colors flex items-center justify-center shadow-sm"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
