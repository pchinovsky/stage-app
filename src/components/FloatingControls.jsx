import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import styles from "./FloatingControls.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";

export default function FloatingControls({ pos }) {
    const [isDetached, setIsDetached] = useState(false);
    const panelRef = useRef(null);
    const initialPosition = useRef(pos);
    const [position, setPosition] = useState(initialPosition.current);
    const [isDragging, setIsDragging] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const offset = useRef({ x: 0, y: 0 });

    const toggleDetach = () => {
        if (isDetached) {
            setPosition(initialPosition.current);
        }
        setIsDetached(!isDetached);
    };

    const handleMouseDown = (e) => {
        if (!isDetached) return;
        setIsDragging(true);
        offset.current = {
            x: e.clientX - panelRef.current.offsetLeft,
            y: e.clientY - panelRef.current.offsetTop,
        };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            top: `${e.clientY - offset.current.y}px`,
            left: `${e.clientX - offset.current.x}px`,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            ref={panelRef}
            className={`${styles.panel} ${
                isMinimized ? styles.panelMin : styles.panelMax
            }`}
            style={{
                top: position.top,
                left: position.left,
                cursor: isDetached ? "grab" : "default",
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className={styles.header} onMouseDown={handleMouseDown}>
                <span className={styles.title}>Controls</span>
                <div className={styles.sizeBtns}>
                    {isMinimized ? (
                        <Button
                            isIconOnly
                            variant="bordered"
                            onPress={() => setIsMinimized(false)}
                        >
                            <Icon
                                icon="gravity-ui:chevrons-expand-up-right"
                                width="16"
                                height="16"
                            />
                        </Button>
                    ) : (
                        <Button
                            isIconOnly
                            variant="bordered"
                            onPress={() => setIsMinimized(true)}
                        >
                            <Icon
                                icon="gravity-ui:chevrons-collapse-up-right"
                                width="16"
                                height="16"
                            />
                        </Button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {!isMinimized && (
                    <motion.div
                        key="panelContent"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.content}>
                            <Button
                                className={styles.detachButton}
                                onPress={toggleDetach}
                            >
                                {isDetached ? "Attach" : "Detach"}
                            </Button>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.actionButton}>
                                Action
                            </button>
                            <button className={styles.createButton}>
                                Create
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
