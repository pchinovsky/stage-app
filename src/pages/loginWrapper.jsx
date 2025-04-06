import { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import Login from "./login";
import NonAuthGuard from "../guards/NonAuthGuard";

export default function LoginWrapper() {
<<<<<<< HEAD
    const { accessLogRef, authLoading } = useContext(AuthContext);

    if (authLoading) return null;
=======
    const { accessLogRef } = useContext(AuthContext);
>>>>>>> parent of a7bf5a5 (Fixing NonAuthGuard to ref flags.)

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
