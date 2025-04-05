import { Icon } from "@iconify/react";
import styles from "../pages/events.module.css";

import { useRef, useState, useEffect } from "react";

const TooltipCircle = ({ title = "Event Title" }) => {
    const contentRef = useRef(null);

    const [width, setWidth] = useState(40);
    const [expandedWidth, setExpandedWidth] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            const rect = contentRef.current.getBoundingClientRect();
            setExpandedWidth(rect.width + 24);
        }
    }, [title]);

    const handleMouseEnter = () => {
        setWidth(expandedWidth);
    };

    const handleMouseLeave = () => {
        setWidth(40);
    };

    return (
        <>
            <div className={styles.invisibleMeasure} ref={contentRef}>
                <Icon
                    icon="mdi:map-marker-outline"
                    className={styles.locationIcon}
                />
                <span className={styles.venueName}>{title}</span>
                <Icon
                    icon="material-symbols:arrow-outward-rounded"
                    className={styles.arrowIcon}
                />
            </div>

            <div
                className={styles.tooltipCircle}
                style={{ width: `${width}px` }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Icon
                    icon="mdi:map-marker-outline"
                    className={styles.locationIcon}
                />
                {width > 40 && (
                    <>
                        <span className={styles.venueName}>{title}</span>
                        <Icon
                            icon="material-symbols:arrow-outward-rounded"
                            className={styles.arrowIcon}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default TooltipCircle;
