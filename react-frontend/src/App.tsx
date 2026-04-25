
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateDispute from "./pages/CreateDispute";
import DisputeDetails from "./pages/DisputeDetails";
import Features from "./pages/Features";
import Profile from "./pages/Profile";

import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create-dispute" element={<CreateDispute />} />
      <Route path="/disputes/:id" element={<DisputeDetails />} />
      {/* Catch-all: redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#121212',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '14px',
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
