import { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import Login from "./login";
import NonAuthGuard from "../guards/NonAuthGuard";

export default function LoginWrapper() {
    const { accessLogRef, authLoading } = useContext(AuthContext);
    console.log("login wrapper - ", accessLogRef.current);

    if (authLoading) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
        >
            {accessLogRef.current ? (
                <Login />
            ) : (
                <NonAuthGuard>
                    <Login />
                </NonAuthGuard>
            )}
        </motion.div>
    );
}
