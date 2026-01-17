import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FormationsPage from "./pages/FormationsPage";
import EventsPage from "./pages/EventsPage";
import MentoratPage from "./pages/MentoratPage";
import BlogPage from "./pages/BlogPage";
import ExpertDashboard from "./dashboard/ExpertDashboard";
import GirlDashboard from "./dashboard/GirlDashboard"; // ✅ ajoute l'import

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/formations" element={<FormationsPage />} />
            <Route path="/evenements" element={<EventsPage />} />
            <Route path="/mentorat" element={<MentoratPage />} />
            <Route path="/blog" element={<BlogPage />} />

            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/girl-dashboard" element={<GirlDashboard />} /> {/* ✅ */}
        </Routes>
    );
}

export default App;
