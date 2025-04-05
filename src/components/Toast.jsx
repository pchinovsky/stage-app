import { motion, AnimatePresence } from "framer-motion";
import styles from "./Toast.module.css";

const Toast = ({ message }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    className={styles.toast}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.7 }}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
