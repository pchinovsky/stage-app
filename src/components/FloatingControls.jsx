import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import styles from "./FloatingControls.module.css";

export default function FloatingControls({ pos }) {
    const [isDetached, setIsDetached] = useState(false);
    const panelRef = useRef(null);
    const initialPosition = useRef(pos);
    const [position, setPosition] = useState(initialPosition.current);
    const [isDragging, setIsDragging] = useState(false);
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
            className={styles.panel}
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
            </div>
            <div className={styles.content}>
                <Button className={styles.detachButton} onPress={toggleDetach}>
                    {isDetached ? "Attach" : "Detach"}
                </Button>
            </div>
            <div className={styles.actions}>
                <button className={styles.actionButton}>Action</button>
                <button className={styles.createButton}>Create</button>
            </div>
        </div>
    );
}
