import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import styles from "./Accordeon.module.css";

export default function Accordeon({ title, children, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`${styles.accordeon} ${className}`}>
            <button
                className={styles.header}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{title}</span>
                <Icon
                    icon="mdi:chevron-down"
                    className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
                />
            </button>
            <motion.div
                className={styles.content}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {children}
            </motion.div>
        </div>
    );
}
