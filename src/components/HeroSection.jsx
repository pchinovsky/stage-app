import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Image, Tooltip, Spinner, Skeleton } from "@heroui/react";
import TabbedCard from "./TabCard";
import styles from "../pages/events.module.css";
import { useEvents } from "../hooks/useEvents";

const HeroSection = React.memo(() => {
    const { events, loading, error } = useEvents({});
    const [randomEvent, setRandomEvent] = useState(null);

    useEffect(() => {
        if (!loading && events && events.length > 0) {
            const randomIndex = Math.floor(Math.random() * events.length);
            setRandomEvent(events[randomIndex]);
        }
    }, [loading, events]);

    const circlePos = [
        { top: "20%", left: "30%" },
        { top: "50%", left: "60%" },
        { top: "70%", left: "40%" },
    ];

    return (
        <motion.div className={styles.heroSection}>
            <div className={styles.infoBoxes}>
                <div className={styles.infoBox}>
                    <h3 className={styles.infoTitle}>Real Time Data</h3>
                    <p className={styles.infoText}>Staged events currently</p>
                    <p className={styles.infoNumber}>
                        {loading ? "..." : events.length}
                    </p>
                    <p className={styles.infoUpdate}>Last Update: 13:06:33</p>
                </div>
                <TabbedCard className={styles.cityBox} />
            </div>
            {loading || !randomEvent ? (
                // <Spinner
                //     classNames={{ label: "text-foreground mt-4" }}
                //     label="simple"
                //     variant="simple"
                // />
                <Skeleton
                    className={`${styles.heroImage} h-[1080px] w-[1920px]`}
                />
            ) : (
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                    // style={{ width: "100%", height: "100%" }}
                >
                    <Image
                        src={randomEvent.image}
                        alt="Hero Image"
                        className={styles.heroImage}
                        width={1920}
                        height={1080}
                    />
                </motion.div>
            )}
            {circlePos.map((pos, index) => (
                <Tooltip
                    key={index}
                    content={
                        index === 0 ? (
                            `${randomEvent?.title || "Loading"}: ${randomEvent?.description || ""}`
                        ) : index === 1 ? (
                            `Location: ${randomEvent?.venue || "Unknown"}`
                        ) : (
                            <a
                                href={`/events/${randomEvent?.id}`}
                                className="text-blue-500 underline"
                            >
                                Explore Event
                            </a>
                        )
                    }
                    placement="top"
                >
                    <div
                        className={styles.tooltipCircle}
                        style={{
                            position: "absolute",
                            top: pos.top,
                            left: pos.left,
                            opacity: loading ? 0.7 : 1,
                        }}
                    />
                </Tooltip>
            ))}
        </motion.div>
    );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
