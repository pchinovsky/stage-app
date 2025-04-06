import { useContext, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "./contexts/authContext";

import Edit from "./pages/edit";
import Event from "./pages/event";
import Profile from "./pages/profile";
import CreatePage from "./pages/create";
import VenuesPage from "./pages/venues";
import LogoutPage from "./pages/logout";
import EventLayout from "./pages/events";
import ArtistsPage from "./pages/artists";
import OwnerGuard from "./guards/OwnerGuard";
import AuthGuard from "./guards/authGuard";
import ManagerGuard from "./guards/ManagerGuard";
import LoginWrapper from "./pages/loginWrapper";
import RegisterWrapper from "./pages/registerWrapper";

function AnimatedRoutes() {
    const location = useLocation();
    const { accessRegRef, accessLogRef } = useContext(AuthContext);

    useEffect(() => {
<<<<<<< HEAD
        if (pathname === "/register") {
            if (isGuest) {
                accessRegRef.current = true;
                accessLogRef.current = false;
            }
        } else if (pathname === "/login") {
            if (isGuest) {
                accessLogRef.current = true;
                accessRegRef.current = false;
            }
=======
        if (location.pathname === "/register") {
            accessRegRef.current = true;
            accessLogRef.current = false;
        } else if (location.pathname === "/login") {
            accessLogRef.current = true;
            accessRegRef.current = false;
>>>>>>> parent of a7bf5a5 (Fixing NonAuthGuard to ref flags.)
        } else {
            accessLogRef.current = false;
            accessRegRef.current = false;
        }
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route
                    path="/"
                    element={
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -50,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{
                                duration: 0.4,
                            }}
                        >
                            <EventLayout />
                        </motion.div>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: 50,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: -50,
                            }}
                            transition={{
                                duration: 0.4,
                            }}
                        >
                            <AuthGuard>
                                <Profile />
                            </AuthGuard>
                        </motion.div>
                    }
                />
                <Route
                    path="/events"
                    element={
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -50,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{
                                duration: 0.4,
                            }}
                        >
                            <EventLayout />
                        </motion.div>
                    }
                />
                <Route
                    path="/events/:eventId"
                    element={
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -50,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{
                                duration: 0.4,
                            }}
                        >
                            <Event />
                        </motion.div>
                    }
                />
                <Route
                    path="/events/:eventId/edit"
                    element={
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -50,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{
                                duration: 0.4,
                            }}
                        >
                            <AuthGuard>
                                <OwnerGuard>
                                    <Edit />
                                </OwnerGuard>
                            </AuthGuard>
                        </motion.div>
                    }
                />
                <Route
                    path="/create"
                    element={
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -50,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{
                                duration: 0.4,
                            }}
                        >
                            <AuthGuard>
                                <ManagerGuard mode="route">
                                    <CreatePage />
                                </ManagerGuard>
                            </AuthGuard>
                        </motion.div>
                    }
                />
                <Route
                    path="/venues"
                    element={
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -50,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{
                                duration: 0.4,
                            }}
                        >
                            <VenuesPage />
                        </motion.div>
                    }
                />
                <Route
                    path="/artists"
                    element={
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -50,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{
                                duration: 0.4,
                            }}
                        >
                            <ArtistsPage />
                        </motion.div>
                    }
                />
                <Route path="/login" element={<LoginWrapper />} />
                <Route path="/register" element={<RegisterWrapper />} />
                <Route path="/logout" element={<LogoutPage />} />
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    return <AnimatedRoutes />;
}
