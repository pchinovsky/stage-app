import { useState, useEffect, useRef, useContext } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import DefaultLayout from "@/layouts/default";
import { Image, Tooltip, Spinner, Skeleton } from "@heroui/react";
import FloatingControls from "../components/FloatingControls";
import EventCard from "../components/EventCard";
import { NavContext } from "../contexts/navContext";
import FilterBar from "../components/FilterBar";
import styles from "./events.module.css";
import TabbedCard from "../components/TabCard";
import { useEvents } from "@/hooks/useEvents";
import eventsData2 from "../mockEventData2";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import useRestoreScroll from "../hooks/useRestoreScroll";

export default function EventLayout() {
    const { setNavWhite } = useContext(NavContext);
    const [searchFixed, setSearchFixed] = useState(false);
    const searchBarRef = useRef(null);
    const placeholderRef = useRef(null);

    const [filters, setFilters] = useState({});

    const navigate = useNavigate();
    const { events, loading, error } = useEvents(filters);
    // const events = eventsData2;
    const [cachedEvents, setCachedEvents] = useState(events);

    useEffect(() => {
        if (!loading && events) {
            setCachedEvents(events);
        }
    }, [loading, events]);

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

    // for the scroll reset issue -
    useEffect(() => {
        const savedScrollY = localStorage.getItem("scrollPosition");
        if (savedScrollY) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedScrollY, 10));
                console.log("📜 Restored scroll to:", savedScrollY);
                localStorage.removeItem("scrollPosition");
            }, 50);
        }
    }, [filters]);

    const handleEventPress = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    useRestoreScroll([filters, loading]);

    return (
        <DefaultLayout>
            <div className={styles.layout}>
                <HeroSection events={events} loading={loading} />
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
                    <FilterBar
                        ref={searchBarRef}
                        searchFixed={searchFixed}
                        // activeFilters={filters}
                        setFilters={setFilters}
                    />

                    {/* Event Cards */}
                    {loading ? (
                        <Skeleton className={styles.card}></Skeleton>
                    ) : error ? (
                        <p>Error loading events.</p>
                    ) : (
                        cachedEvents.map((event) => (
                            <Skeleton
                                isLoaded={!loading}
                                className={styles.card}
                                key={event.id}
                            >
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onPress={handleEventPress}
                                />
                            </Skeleton>
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
