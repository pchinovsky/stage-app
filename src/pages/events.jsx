import { useState, useEffect, useRef, useContext } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import DefaultLayout from "@/layouts/default";
import { Image, Tooltip, Spinner } from "@heroui/react";
import FloatingControls from "../components/FloatingControls";
import EventCard from "../components/EventCard";
import { NavContext } from "../contexts/navContext";
import FilterBar from "../components/FilterBar";
import styles from "./events.module.css";
import TabbedCard from "../components/TabCard";
import { useEvents } from "@/hooks/useEvents";
import eventsData2 from "../mockEventData2";
import { useNavigate } from "react-router-dom";

export default function EventLayout() {
    const { setNavWhite } = useContext(NavContext);
    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const eventSectionTranslate = useTransform(scrollY, [0, 300], [0, -100]);
    const [searchFixed, setSearchFixed] = useState(false);
    const searchBarRef = useRef(null);
    const placeholderRef = useRef(null);

    const filters = { staged: true };

    const navigate = useNavigate();
    const { events, loading, error } = useEvents({ filters });
    // const events = eventsData2;

    useEffect(() => {
        const handleScroll = () => {
            if (searchBarRef.current && placeholderRef.current) {
                const searchRect = searchBarRef.current.getBoundingClientRect();
                const placeholderRect =
                    placeholderRef.current.getBoundingClientRect();

                if (searchRect.top <= 90 && !searchFixed) {
                    setSearchFixed(true);
                    setNavWhite(true);
                } else if (placeholderRect.top >= 0 && searchFixed) {
                    setSearchFixed(false);
                    setNavWhite(false);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [searchFixed]);

    const handleEventPress = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    const circlePos = [
        { top: "20%", left: "30%" },
        { top: "50%", left: "60%" },
        { top: "70%", left: "40%" },
    ];

    return (
        <DefaultLayout>
            <div className={styles.layout}>
                {/* Sticky Hero Section */}
                <motion.div className={styles.heroSection}>
                    {/* Side Info Boxes */}
                    <div className={styles.infoBoxes}>
                        <div className={styles.infoBox}>
                            <h3 className={styles.infoTitle}>Real Time Data</h3>
                            <p className={styles.infoText}>
                                Staged events currently
                            </p>
                            <p className={styles.infoNumber}>
                                {loading ? "..." : events.length}
                                {/* {events.length} */}
                            </p>
                            <p className={styles.infoUpdate}>
                                Last Update: 13:06:33
                            </p>
                        </div>
                        <TabbedCard className={styles.cityBox}></TabbedCard>
                    </div>

                    {loading ? (
                        <Spinner
                            classNames={{ label: "text-foreground mt-4" }}
                            label="simple"
                            variant="simple"
                        />
                    ) : (
                        <Image
                            src={events[1]?.image}
                            alt="Hero Image"
                            className={styles.heroImage}
                            width={1920}
                            height={1080}
                        />
                    )}

                    {/* Floating Circles */}
                    {circlePos.map((pos, index) => (
                        <Tooltip
                            key={index}
                            content={
                                index === 0 ? (
                                    `${events[0]?.title || "Loading"}: ${events[0]?.description || ""}`
                                ) : index === 1 ? (
                                    `Location: ${events[0]?.venue || "Unknown"}`
                                ) : (
                                    <a
                                        href={`/events/${events[0]?.id}`}
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
                                }}
                            ></div>
                        </Tooltip>
                    ))}
                </motion.div>

                {/* Floating Controls */}
                <div className={styles.floatingControls}>
                    <FloatingControls pos={{ top: "250px", left: "40px" }} />
                </div>

                {/* Placeholder for Filter Bar */}
                <div
                    ref={placeholderRef}
                    className={styles.filterPlaceholder}
                ></div>

                {/* Events Section */}
                <div className={styles.eventsSection}>
                    {/* Filter Bar */}
                    <FilterBar ref={searchBarRef} searchFixed={searchFixed} />

                    {/* Event Cards */}
                    {loading ? (
                        <p>Loading events...</p>
                    ) : error ? (
                        <p>Error loading events.</p>
                    ) : (
                        events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onPress={handleEventPress}
                            />
                        ))
                    )}

                    {/* Mock data */}
                    {/* {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))} */}
                </div>
            </div>
        </DefaultLayout>
    );
}
