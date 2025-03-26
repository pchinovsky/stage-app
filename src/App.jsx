import { Route, Routes, Router, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import IndexPage from "@/pages/index";
import Profile from "./pages/profile";
import EventLayout from "./pages/events";
import CreatePage from "./pages/create";
import Login from "./pages/login";
import Register from "./pages/register";
import Event from "./pages/event";
import Edit from "./pages/edit";
import ArtistsPage from "./pages/artists";
import VenuesPage from "./pages/venues";
import ManagerGuard from "./guards/ManagerGuard";
import AuthGuard from "./guards/authGuard";
import OwnerGuard from "./guards/OwnerGuard";
import LogoutPage from "./pages/logout";

function AnimatedRoutes() {
    const location = useLocation();

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
                            <IndexPage />
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
                <Route
                    path="/login"
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
                            <Login />
                        </motion.div>
                    }
                />
                <Route
                    path="/register"
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
                            <Register />
                        </motion.div>
                    }
                />
                <Route path="/logout" element={<LogoutPage />} />
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    return <AnimatedRoutes />;
}
