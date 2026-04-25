import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`relative flex items-center justify-center p-2.5 rounded-xl border border-gray-200 dark:border-appborder/50 bg-white/50 dark:bg-appcard/50 backdrop-blur-md transition-all hover:scale-110 active:scale-95 group shadow-sm hover:shadow-md ${className}`}
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    {theme === "light" ? (
                        <motion.div
                            key="sun"
                            initial={{ y: 20, rotate: 45, opacity: 0 }}
                            animate={{ y: 0, rotate: 0, opacity: 1 }}
                            exit={{ y: -20, rotate: -45, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "backOut" }}
                            className="absolute"
                        >
                            <Sun className="w-5 h-5 text-gold-600" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="moon"
                            initial={{ y: 20, rotate: 45, opacity: 0 }}
                            animate={{ y: 0, rotate: 0, opacity: 1 }}
                            exit={{ y: -20, rotate: -45, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "backOut" }}
                            className="absolute"
                        >
                            <Moon className="w-5 h-5 text-gold-500" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Subtle Glow Effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-md -z-10 bg-gold-500/10"></div>
        </button>
    );
}
