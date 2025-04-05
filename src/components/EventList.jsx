import React from "react";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@heroui/react";
import { useEvents } from "../hooks/useEvents";
import { NavContext } from "../contexts/navContext";
import EventCard from "../components/EventCard";
import { getSplitFilters } from "../../utils/getSplitFilters";
import styles from "./EventList.module.css";

const EventsList = ({ filters }) => {
    const { setNavWhite } = useContext(NavContext);

    const navigate = useNavigate();

    const [safeFilters, postFilters] = useMemo(() => {
        return getSplitFilters(filters);
    }, [filters]);

    const { events, loading } = useEvents(safeFilters);

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

    return (
        <>
            {loading ? (
                <div className={styles.skeletonContainer}>
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <Skeleton key={idx} className={styles.card} />
                    ))}
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className={styles.noResults}>
                    No events match your filter conditions.
                </div>
            ) : (
                filteredEvents.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onPress={handleEventPress}
                    />
                ))
            )}
        </>
    );
};

export default React.memo(EventsList);
