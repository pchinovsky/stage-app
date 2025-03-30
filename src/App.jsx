import { Route, Routes, Router, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
import NonAuthGuard from "./guards/NonAuthGuard";
import OwnerGuard from "./guards/OwnerGuard";
import LogoutPage from "./pages/logout";
import { AuthContext } from "./contexts/authContext";
import RegisterWrapper from "./pages/registerWrapper";
import LoginWrapper from "./pages/loginWrapper";

function AnimatedRoutes() {
    const location = useLocation();
    const { pathname } = location;
    const { isAuth, authLoading, accessRegRef, accessLogRef } =
        useContext(AuthContext);

    const isGuest = !isAuth && !authLoading;

    useEffect(() => {
        if (pathname === "/register") {
            if (isGuest) {
                accessRegRef.current = true;
                accessLogRef.current = false;
            }
            // accessRegRef.current = true;
            // accessLogRef.current = false;
        } else if (pathname === "/login") {
            if (isGuest) {
                accessLogRef.current = true;
                accessRegRef.current = false;
            }
            // accessLogRef.current = true;
            // accessRegRef.current = false;
            console.log("log flag app - ", accessLogRef.current);
        } else {
            accessLogRef.current = false;
            accessRegRef.current = false;
            console.log(
                "log flag app reset - ",
                accessLogRef.current,
                accessRegRef.current
            );
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
                {/* <Route
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
                            <NonAuthGuard>
                                <Login />
                            </NonAuthGuard>
                        </motion.div>
                    }
                /> */}
                {/* <Route
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
                            <NonAuthGuard>
                                <Register />
                            </NonAuthGuard>
                        </motion.div>
                    }
                /> */}
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
