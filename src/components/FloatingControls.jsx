import { useState, useRef, useEffect } from "react";
import { Button, Switch, Tooltip } from "@heroui/react";
import styles from "./FloatingControls.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";
import { useFloatingContext } from "../contexts/floatingContext";
import ButtonDynamicGroup from "./ButtonDynamicGroup";

export default function FloatingControls({ pos }) {
    const [isDetached, setIsDetached] = useState(false);
    const panelRef = useRef(null);
    const initialPosition = useRef(pos);
    const [position, setPosition] = useState(initialPosition.current);
    const [isDragging, setIsDragging] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const {
        selectedEvents,
        selectionMode,
        toggleSelectionMode,
        bulkUpdate,
        clearSelection,
    } = useFloatingContext();

    useEffect(() => {
        console.log("- - panel - ", selectedEvents);
    }, [selectedEvents]);

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
                <div className={styles.controlBtns}>
                    <Tooltip
                        content={isDetached ? "Attach" : "Detach"}
                        offset={12}
                        delay={100}
                        closeDelay={700}
                        className="rounded-md"
                    >
                        <Button
                            className={styles.detachButton}
                            onPress={toggleDetach}
                            isIconOnly
                            variant="bordered"
                        >
                            {isDetached ? (
                                <Icon
                                    icon="iconoir:open-in-window"
                                    width="20"
                                    height="20"
                                />
                            ) : (
                                <Icon
                                    icon="iconoir:open-new-window"
                                    width="20"
                                    height="20"
                                />
                            )}
                        </Button>
                    </Tooltip>
                    <Tooltip
                        content={isMinimized ? "Expand" : "Collapse"}
                        offset={12}
                        delay={100}
                        closeDelay={700}
                        className="rounded-md"
                    >
                        <Button
                            className={styles.sizeBtn}
                            isIconOnly
                            variant="bordered"
                            onPress={
                                isMinimized
                                    ? () => setIsMinimized(false)
                                    : () => setIsMinimized(true)
                            }
                        >
                            {isMinimized ? (
                                <Icon
                                    icon="gravity-ui:chevrons-expand-up-right"
                                    width="16"
                                    height="16"
                                />
                            ) : (
                                <Icon
                                    icon="gravity-ui:chevrons-collapse-up-right"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Button>
                    </Tooltip>
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
                            <span>Selection Mode</span>
                            <Switch
                                isSelected={selectionMode}
                                onValueChange={toggleSelectionMode}
                                color="primary"
                                size="sm"
                            />
                        </div>

                        {/* {selectionMode && (
                            <div className={styles.actions}>
                                <div className={styles.selectedCount}>
                                    {selectedEvents.length} event(s) selected
                                </div>

                                <Button
                                    onPress={() =>
                                        bulkUpdate("interested")
                                    }
                                    disabled={!selectedEvents.length}
                                >
                                    Interested
                                </Button>
                                <Button
                                    onPress={() => bulkUpdate("attending")}
                                    disabled={!selectedEvents.length}
                                >
                                    Attend
                                </Button>
                                <Button onPress={clearSelection}>
                                    Clear Selection
                                </Button>
                            </div>
                        )} */}

                        <div className="relative">
                            <ButtonDynamicGroup
                                pos={{
                                    top: "top-[0px]",
                                    left: "left-[15px]",
                                }}
                                event={null}
                                onModalOpen={() => {}}
                                disableExpand
                                disabled={!selectionMode}
                                mode="bulk"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
