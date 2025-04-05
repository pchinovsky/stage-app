import { useState, useRef, useEffect } from "react";
import { Button, Switch, Tooltip } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useUser } from "../hooks/useUser-new";
import { useFloatingContext } from "../contexts/floatingContext";
import ButtonDynamicGroup from "./ButtonDynamicGroup";
import styles from "./FloatingControls.module.css";

export function TablerLock(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            {...props}
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            >
                <path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"></path>
                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-3-5V7a4 4 0 1 1 8 0v4"></path>
            </g>
        </svg>
    );
}

export function TablerLockOpen(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            {...props}
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            >
                <path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"></path>
                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 1 0-2 0m-3-5V6a4 4 0 0 1 8 0"></path>
            </g>
        </svg>
    );
}

export default function FloatingControls({ pos, active, dock }) {
    const { currentUser } = useUser();

    const panelRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });
    const initialPosition = useRef(pos);
    const dockedPosition = useRef({ top: "13px", left: "16px" });

    const [isDocked, setIsDocked] = useState(dock);
    const [isLocked, setIsLocked] = useState(false);
    const [position, setPosition] = useState(initialPosition.current);
    const [isDragging, setIsDragging] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true);

    const {
        selectedEvents,
        selectionMode,
        toggleSelectionMode,
        uniformAttending,
        uniformInterested,
        clearSelection,
        updateFloatingPanelSettings,
    } = useFloatingContext();

    const disabled = {
        interested: !selectionMode || !uniformInterested,
        attending: !selectionMode || !uniformAttending,
        selection: selectedEvents.length !== 0,
    };

    const toggleDock = () => {
        if (!isDocked) {
            setPosition(dockedPosition.current);
        }
        setIsDocked(!isDocked);
    };

    const handleMouseDown = (e) => {
        if (isDocked || isLocked) return;
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

    const handleLock = () => {
        setIsLocked((prev) => !prev);
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (currentUser?.floatingPanelSettings?.persistPosition) {
                updateFloatingPanelSettings({ lastPosition: position });
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);

            if (currentUser?.floatingPanelSettings?.persistPosition) {
                updateFloatingPanelSettings({ lastPosition: position });
            }
        };
    }, [position, currentUser]);

    const panelStyle = {
        "--panel-bg-color": currentUser?.floatingPanelSettings?.isTransparent
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 1)",
        "--panel-top": position.top,
        "--panel-left": position.left,
        "--panel-border-radius": "9px",
    };

    return (
        <div
            ref={panelRef}
            className={`${styles.panel} ${
                isMinimized ? styles.panelMin : styles.panelMax
            }`}
            style={panelStyle}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className={styles.header} onMouseDown={handleMouseDown}>
                <span className={styles.title} style={{ userSelect: "none" }}>
                    Controls
                </span>
                <div className={styles.controlBtns}>
                    <Tooltip
                        content={isDocked ? "Undock" : "Dock"}
                        offset={12}
                        delay={100}
                        closeDelay={700}
                        className="rounded-md"
                    >
                        <Button
                            className={styles.detachButton}
                            onPress={toggleDock}
                            isIconOnly
                            variant="bordered"
                            isDisabled={!active}
                        >
                            {isDocked ? (
                                <Icon
                                    icon="iconoir:open-new-window"
                                    width="20"
                                    height="20"
                                />
                            ) : (
                                <Icon
                                    icon="iconoir:open-in-window"
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
                            isDisabled={!active}
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
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 1 },
                        }}
                        exit={{
                            opacity: 0,
                            y: -10,
                            transition: { duration: 0.2 },
                        }}
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

                        <div className="relative flex gap-1">
                            <ButtonDynamicGroup
                                pos={{
                                    top: "top-[0px]",
                                    left: "left-[15px]",
                                }}
                                event={null}
                                onModalOpen={() => {}}
                                disableExpand
                                disabled={disabled}
                                mode="bulk"
                            />
                            {currentUser.floatingPanelSettings?.isLocked && (
                                <Tooltip
                                    placement="bottom"
                                    className="rounded-md"
                                    content={
                                        isLocked
                                            ? "Unlock position"
                                            : "Lock position"
                                    }
                                >
                                    <Button
                                        onPress={handleLock}
                                        className={styles.lockButton}
                                        variant="bordered"
                                        isIconOnly
                                    >
                                        {isLocked ? (
                                            <TablerLockOpen />
                                        ) : (
                                            <TablerLock />
                                        )}
                                    </Button>
                                </Tooltip>
                            )}
                            <Tooltip
                                placement="bottom"
                                className="rounded-md"
                                content="Clear selection"
                                isDisabled={!selectionMode}
                            >
                                <Button
                                    onPress={clearSelection}
                                    isDisabled={!selectionMode}
                                    disableRipple={!selectionMode}
                                    className={styles.clearButton}
                                    style={{
                                        left: currentUser.floatingPanelSettings
                                            .isLocked
                                            ? "128px"
                                            : "173px",
                                    }}
                                    variant="bordered"
                                    isIconOnly
                                >
                                    <Icon
                                        icon="iconoir:undo-action"
                                        width="24"
                                        height="24"
                                        className={`${!selectionMode && "text-gray-600"}`}
                                    />
                                </Button>
                            </Tooltip>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
