import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import styles from "./Sidebar.module.css";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEvents } from "../hooks/useEvents";
import useFetch from "../hooks/useFetch";
import eventsData2 from "../mockEventData2";
import { useNavigate } from "react-router-dom";

// export default function SlidingSidebar({ data }) {
export default function SlidingSidebar({ event, venue }) {
    // export default function SlidingSidebar({
    //     artists,
    //     venueId,
    //     categories,
    //     createdBy,
    //     venue,
    // }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // console.log("sidebar data", data);

    // const filters = {
    //     artists: data.artists.length > 0 ? data.artists : undefined,
    //     categories: data.categories.length > 0 ? data.categories : undefined,
    //     createdBy: data.createdBy || undefined,
    //     venue: data.venue || undefined,
    // };

    // const filters = {
    //     artists: artists.length > 0 ? artists : undefined,
    //     categories: categories.length > 0 ? categories : undefined,
    //     createdBy: createdBy || undefined,
    //     venue: venueId || undefined,
    // };

    const filters = {
        artists: event.artists.length > 0 ? event.artists : undefined,
        categories: event.categories.length > 0 ? event.categories : undefined,
        createdBy: event.createdBy || undefined,
        venue: event.venue || undefined,
    };

    // console.log("sidebar filters", filters);

    // const { events, loading, error } = useEvents(filters);
    // const eventss = eventsData2;

    // filter adapted to firebase query restrictions - to optimize
    const fetchRelatedEvents = async () => {
        try {
            const eventsRef = collection(db, "events");
            let queries = [];

            if (event.artists.length > 0) {
                queries.push(
                    query(
                        eventsRef,
                        where("artists", "array-contains-any", event.artists)
                    )
                );
            }
            if (event.categories.length > 0) {
                queries.push(
                    query(
                        eventsRef,
                        where(
                            "categories",
                            "array-contains-any",
                            event.categories
                        )
                    )
                );
            }

            let generalConditions = [];
            if (event.createdBy) {
                generalConditions.push(
                    where("createdBy", "==", event.createdBy)
                );
            }
            if (event.venue) {
                generalConditions.push(where("venue", "==", event.venue));
            }

            if (queries.length === 0) {
                queries.push(query(eventsRef, ...generalConditions));
            }

            let eventResults = new Set();

            for (let q of queries) {
                const snapshot = await getDocs(q);
                snapshot.docs.forEach((doc) =>
                    eventResults.add(
                        JSON.stringify({ id: doc.id, ...doc.data() })
                    )
                );
            }

            return Array.from(eventResults).map((doc) => JSON.parse(doc));
        } catch (err) {
            console.error("Error fetching related events:", err);
            return [];
        }
    };

    const { data: events, loading } = useFetch(fetchRelatedEvents, []);

    useEffect(() => {
        if (!loading) console.log("sidebar events", events);
    }, [events]);

    const handleEventPress = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ x: 250 }}
                animate={{ x: isOpen ? 80 : 370 }}
                transition={{
                    type: "tween",
                    duration: 0.5,
                }}
                className={styles.sidebar}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                style={{ right: 0, left: "auto" }}
            >
                <div className={styles.arrow}>
                    {isOpen ? (
                        <Icon
                            icon="mdi:chevron-right"
                            className="text-3xl z-[100]"
                        />
                    ) : (
                        <Icon
                            icon="mdi:chevron-left"
                            className="text-3xl z-[100]"
                        />
                    )}
                </div>
                <h2 className={styles.title}>Related Events</h2>
                <div className={styles.eventList}>
                    {loading ? (
                        <p>Loading events...</p>
                    ) : (
                        events.map((event) => (
                            <Card
                                key={event.id}
                                className={styles.eventCard}
                                isPressable
                                isHoverable
                                radius="sm"
                                onPress={() => {
                                    handleEventPress(event.id);
                                }}
                            >
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    className={styles.eventImage}
                                    radius="sm"
                                />
                                <p className={styles.eventName}>
                                    {event.title}
                                </p>
                                <p className={styles.eventVenue}>
                                    {venue.name}
                                </p>
                            </Card>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}
