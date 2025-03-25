import React from "react";
import { Skeleton } from "@heroui/react";
import EventCard from "../components/EventCard";
import styles from "./EventList.module.css";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useContext } from "react";
import { NavContext } from "../contexts/navContext";

const EventsList = ({ filters }) => {
    const { setNavWhite } = useContext(NavContext);

    const navigate = useNavigate();
    const { events, loading, error } = useEvents(filters);

    const handleEventPress = (eventId) => {
        setNavWhite(false);

        navigate(`/events/${eventId}`);
    };

    if (loading) {
        return (
            <div className={styles.skeletonContainer}>
                {Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton key={idx} className={styles.card} />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className={styles.noResults}>Error loading events.</div>;
    }

    if (events.length === 0) {
        return (
            <div className={styles.noResults}>
                No events match your filter conditions.
            </div>
        );
    }

    return events.map((event) => (
        <EventCard key={event.id} event={event} onPress={handleEventPress} />
    ));
};

export default React.memo(EventsList);
