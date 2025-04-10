import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useEventsRelated } from "../hooks/useEventsRelated";
import ProfileCard from "./ProfileCard";
import styles from "./Sidebar.module.css";

export default function SlidingSidebar({ event }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

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
                animate={{ x: isOpen ? 60 : 370 }}
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
                                key={event?.id}
                                data={{
                                    name: event?.title,
                                    profileImage: event?.image,
                                    description: event?.description,
                                }}
                                size={{ width: "260px", height: "200px" }}
                                onClick={() => handleEventPress(event.id)}
                                styles={{
                                    text: "text-sm",
                                    desc: 70,
                                    footer: "h-[80px]",
                                    pos: "self-start",
                                }}
                                footer={true}
                                className={styles.eventCard}
                            />
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}
