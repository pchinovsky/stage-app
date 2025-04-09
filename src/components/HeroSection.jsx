import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Image, Skeleton } from "@heroui/react";
import { useVenue } from "../hooks/useVenue";
import { useEventsStore } from "../contexts/eventsContext";
import { calcTrending } from "../../utils/calcTrending";
import StatsBox from "./Stats";
import TabbedCard from "./TabCard";
import styles from "../pages/events.module.css";

const HeroSection = React.memo(() => {
    const navigate = useNavigate();

    const { events, loading } = useEventsStore();

    const [isFixed, setIsFixed] = useState(false);
    const [randomEvent, setRandomEvent] = useState(null);
    const [venueId, setVenueId] = useState(null);
    const { venue, loading: venueLoading } = useVenue(venueId);
    const [involved, setInvolved] = useState(0);
    const [formattedDate, setFormattedDate] = useState(new Date());

    useEffect(() => {
        if (!randomEvent && !loading && events && events.length > 0) {
            const randomIndex = Math.floor(Math.random() * events.length);
            setRandomEvent(events[randomIndex]);
            setVenueId(events[randomIndex].venue);
            setFormattedDate(new Date(events[randomIndex].openingDate));
        }
    }, [loading, events, randomEvent]);

    useEffect(() => {
        if (!loading && events.length > 0) {
            (async () => {
                const allInvolved = events.flatMap(
                    (event) => event.involvedUsers || []
                );
                setInvolved(allInvolved.length);
            })();
        }
    }, [loading, events]);

    const statsData = [
        {
            label: "Visitors",
            value: involved,
            description: "Total visitors involved",
            icon: "tabler:user-check",
        },
        {
            label: "Events",
            value: events.length,
            description: "Total events staged",
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

            <div
                className={styles.tooltipCircle}
                style={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                }}
                onClick={() => navigate("/venues")}
            >
                <div className={styles.circleContent}>
                    <Icon
                        icon="material-symbols:location-on-outline-rounded"
                        width="20"
                        height="20"
                        className={`${styles.locationIcon}`}
                    />

                    <p className={`${styles.venueName}`}>
                        {venueLoading ? "Loading..." : venue.name}
                    </p>

                    <Icon
                        icon="ic:round-arrow-outward"
                        width="24"
                        height="24"
                        className={`${styles.arrowIcon}`}
                    />
                </div>
            </div>

            <div
                className={`${styles.tooltipCircle} hover:w-[320px]`}
                style={{
                    position: "absolute",
                    top: "35%",
                    left: "20%",
                }}
                onClick={() => navigate(`/events/${randomEvent?.id}`)}
            >
                <div className={styles.circleContent}>
                    <Icon
                        icon="tabler:timeline-event"
                        width="20"
                        height="20"
                        className={`${styles.locationIcon}`}
                    />

                    <p className={`${styles.venueName}`}>
                        {randomEvent?.title?.length > 30
                            ? `${randomEvent.title.substring(0, 30)}...`
                            : randomEvent?.title}
                    </p>

                    <Icon
                        icon="ic:round-arrow-outward"
                        width="24"
                        height="24"
                        className={`${styles.arrowIcon}`}
                    />
                </div>
            </div>

            <div
                className={`${styles.tooltipCircle} hover:w-[150px]`}
                style={{
                    position: "absolute",
                    top: "105%",
                    left: "30%",
                }}
                onClick={() => navigate(`/events/${randomEvent?.id}`)}
            >
                <div className={styles.circleContent}>
                    <Icon
                        icon="majesticons:calendar-line"
                        width="20"
                        height="20"
                        className={`${styles.locationIcon}`}
                    />

                    <p className={`${styles.venueName}`}>
                        <span className="text-md font-bold text-blue-600">
                            {formattedDate.getDate()}
                        </span>
                        <span className="text-sm font-semibold">
                            {formattedDate.toLocaleString("en-US", {
                                month: "short",
                            })}
                        </span>
                    </p>

                    <Icon
                        icon="ic:round-arrow-outward"
                        width="24"
                        height="24"
                        className={`${styles.arrowIcon}`}
                    />
                </div>
            </div>
        </motion.div>
    );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
