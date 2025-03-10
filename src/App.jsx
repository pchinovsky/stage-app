import { Route, Routes, Router, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import IndexPage from "@/pages/index";
import Profile from "./pages/profile";
import EventLayout from "./pages/events";
import CreatePage from "./pages/create";
import Login from "./pages/login";
import Register from "./pages/register";
import Event from "./pages/event";

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
                            <Profile />
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
                            <CreatePage />
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
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    return <AnimatedRoutes />;
}
