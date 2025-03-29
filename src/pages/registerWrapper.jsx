import { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import Register from "./register";
import NonAuthGuard from "../guards/NonAuthGuard";

export default function RegisterWrapper() {
    const { accessRegRef } = useContext(AuthContext);

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
        >
            {accessRegRef.current ? (
                <Register />
            ) : (
                <NonAuthGuard>
                    <Register />
                </NonAuthGuard>
            )}
        </motion.div>
    );
}
