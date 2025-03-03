import { motion } from "framer-motion";
import styles from "./FloatingCard.module.css";

export function FloatingCard({ children, className = "", delay = 0 }) {
    return (
        <motion.div
            className={`${styles.floatingCard} ${className}`}
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }} // Moves up and down
            transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: delay / 1000, // Convert ms to seconds
            }}
        >
            {children}
        </motion.div>
    );
}
