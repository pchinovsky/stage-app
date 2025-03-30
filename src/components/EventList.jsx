import React from "react";
import { Skeleton } from "@heroui/react";
import EventCard from "../components/EventCard";
import styles from "./EventList.module.css";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useContext, useMemo } from "react";
import { NavContext } from "../contexts/navContext";
import { getSplitFilters } from "../../utils/getSplitFilters";

const EventsList = ({ filters }) => {
    const { setNavWhite } = useContext(NavContext);

    const navigate = useNavigate();
    // const { events, loading, error } = useEvents(filters);

    // const [safeFilters, postFilters] = getSplitFilters(filters);
    const [safeFilters, postFilters] = useMemo(() => {
        return getSplitFilters(filters);
    }, [filters]);

    const { events, loading, error } = useEvents(safeFilters);
    // const { events, loading, error } = useEvents({ artists: ["abc123"] });

    const filteredEvents = useMemo(() => {
        if (loading || !events || !postFilters) return [];

        return events.filter((event) => {
            if (!postFilters || typeof postFilters !== "object") return true;
            return Object.entries(postFilters).every(([key, values]) => {
                if (!Array.isArray(values)) return true;

                return values.every((val) => event[key]?.includes(val));
            });
        });
    }, [events, loading, postFilters]);

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

    if (filteredEvents.length === 0) {
        return (
            <div className={styles.noResults}>
                No events match your filter conditions.
            </div>
        );
    }

    return filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} onPress={handleEventPress} />
    ));
};

export default React.memo(EventsList);
