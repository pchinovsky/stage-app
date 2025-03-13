import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Toast.module.css";

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    className={styles.toast}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5 }}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
