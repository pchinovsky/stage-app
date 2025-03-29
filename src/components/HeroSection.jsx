import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Image, Tooltip, Spinner, Skeleton } from "@heroui/react";
import TabbedCard from "./TabCard";
import styles from "../pages/events.module.css";
import { useEvents } from "../hooks/useEvents";
import StatsBox from "./Stats";
import { useEventsStore } from "../contexts/eventsContext";
import { calcTrending } from "../../utils/calcTrending";

const HeroSection = React.memo(() => {
    const [isFixed, setIsFixed] = useState(false);

    const { events, loading, error } = useEventsStore();
    const [randomEvent, setRandomEvent] = useState(null);
    const [involved, setInvolved] = useState(0);

    useEffect(() => {
        if (!randomEvent && !loading && events && events.length > 0) {
            const randomIndex = Math.floor(Math.random() * events.length);
            setRandomEvent(events[randomIndex]);
        }
    }, [loading, events, randomEvent]);

    useEffect(() => {
        if (!loading && events.length > 0) {
            (async () => {
                const trendingValues = await Promise.all(
                    events.map((e) => calcTrending(e))
                );
                const involvedTotal = trendingValues.reduce(
                    (acc, val) => acc + val,
                    0
                );
                setInvolved(involvedTotal);
            })();
        }
    }, [loading, events]);

    const circlePos = [
        { top: "30%", left: "30%" },
        { top: "60%", left: "60%" },
        { top: "100%", left: "40%" },
    ];

    const statsData = [
        {
            label: "Visitors involved",
            value: involved,
            description: "Total visitors involved",
            icon: "tabler:user-check",
        },
        {
            label: "Events",
            value: events.length,
            description: "Total number of events staged",
            icon: "ci:calendar-check",
        },
    ];

    return (
        <motion.div className={styles.heroSection}>
            <div className={styles.infoBoxes}>
                <StatsBox stats={statsData} disableAbsolute />
                <TabbedCard />
            </div>
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 1 }}
                onAnimationComplete={() => setIsFixed(true)}
                className={styles.heroSection}
            >
                <div
                    style={{
                        position: isFixed ? "fixed" : "absolute",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: -1,
                    }}
                >
                    {loading || !randomEvent ? (
                        <Skeleton
                            className={`${styles.heroImage} h-[1080px] w-[1920px]`}
                        />
                    ) : (
                        <Image
                            src={randomEvent.image}
                            alt="Hero Image"
                            className={styles.heroImage}
                            width={1920}
                            height={1080}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    )}
                </div>
            </motion.div>
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
                    placement="bottom"
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
