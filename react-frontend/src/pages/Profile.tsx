import Navbar from "../components/Navbar";
import ProfilePage from "../components/ProfilePage";
import { motion } from "framer-motion";

export default function Profile() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200 text-gray-900 dark:text-gray-200 font-sans">
            <Navbar />
            
            <motion.main 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
            >
                <ProfilePage />
            </motion.main>
        </div>
    );
}
