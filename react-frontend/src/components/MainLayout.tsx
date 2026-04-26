import { ReactNode } from "react";
import Navbar from "./Navbar";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-appbg transition-colors duration-200">
            <Navbar />
            <div className="pt-20">
                {children}
            </div>
        </div>
    );
}
