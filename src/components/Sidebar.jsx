import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@heroui/react";
import styles from "./Sidebar.module.css";

export default function SlidingSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.container}>
            {/* sidebar */}
            <motion.div
                initial={{ x: -250 }}
                animate={{ x: isOpen ? 0 : -80 }} // original -250 for 16rem width
                transition={{
                    type: "tween",
                    duration: 0.3,
                    ease: "easeOut",
                }}
                className={styles.sidebar}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <h2 className={styles.title}>Navigation</h2>
                <ul>
                    <li className={styles.navItem}>
                        <Link href="/">Home</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/blog">Explore</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/events">My Events</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/about">Profile</Link>
                    </li>
                </ul>
            </motion.div>

            {/* Hover Trigger */}
            {/* <div
                className={styles.hoverTrigger}
                onMouseEnter={() => setIsOpen(true)}
            /> */}
        </div>
    );
}
