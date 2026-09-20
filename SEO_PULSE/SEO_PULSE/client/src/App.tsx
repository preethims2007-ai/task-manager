import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Report from "./pages/Report";
import History from "./pages/History";
// Phase 2 (not in this build): import RankTracker from "./pages/RankTracker";
// Phase 2 (not in this build): import RankDetail from "./pages/RankDetail";
import { Toaster } from "react-hot-toast";
import { useApp } from "./context/AppContext";
import Loading from "./components/Loading";

export default function App() {
    const { user, loading } = useApp();

    const location = useLocation();

    const hideNavbar = ["/login", "/register"].includes(location.pathname);

    if (loading) return <Loading />;

    return (
        <>
            <Toaster />
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login state="login" />} />

                <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Login state="register" />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analyze" element={<Analyze />} />
                    <Route path="/report/:id" element={<Report />} />
                    <Route path="/history" element={<History />} />
                    {/* Phase 2 (not in this build): /rank-tracker and /rank/:id routes */}
                </Route>
            </Routes>
        </>
    );
}
