import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import styles from "./Sidebar.module.css";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEvents } from "../hooks/useEvents";
import eventsData2 from "../mockEventData2";
import { useNavigate } from "react-router-dom";
import { useEventsRelated } from "../hooks/useEventsRelated";
import ProfileCard from "./ProfileCard";

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

    const { relatedEvents, loading } = useEventsRelated(event);

    useEffect(() => {
        if (!loading) console.log("sidebar events", relatedEvents);
    }, [relatedEvents]);

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
                        relatedEvents.map((event) => (
                            <ProfileCard
                                key={event.id}
                                data={{
                                    name: event.title,
                                    profileImage: event.image,
                                    description: event.description,
                                }}
                                size={{ width: "260px", height: "200px" }}
                                onClick={() => handleEventPress(event.id)}
                                footer={true}
                            />
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}
