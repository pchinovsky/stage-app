import { useState } from "react";
import Calendar from "react-calendar";
import { Modal, Button } from "@heroui/react";
import { Link } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import styles from "./Calendar.module.css";
import { useEvents } from "../hooks/useEvents";
import { useUser } from "../hooks/useUser";

export default function CalendarModal({ isOpen, onClose }) {
    const [viewMode, setViewMode] = useState("mine");
    const { currentUser, loading: userLoading, error: userError } = useUser();

    const {
        events,
        loading: eventsLoading,
        error: eventsError,
    } = useEvents({});

    if (userLoading || eventsLoading) {
        return <div>Loading...</div>;
    }
    if (userError || eventsError) {
        return <div>Error loading data</div>;
    }

    // control modes - mine/followed
    let displayedEvents = [];
    if (viewMode === "mine" && currentUser) {
        displayedEvents = events.filter((event) => {
            const isAttending =
                event.attending &&
                Array.isArray(event.attending) &&
                event.attending.includes(currentUser.id);
            const isInterested =
                event.interested &&
                Array.isArray(event.interested) &&
                event.interested.includes(currentUser.id);
            const isCreator = event.createdBy === currentUser.id;
            return isAttending || isInterested || isCreator;
        });
    } else if (viewMode === "followed" && currentUser) {
        const followedUserIds = currentUser.followingUsers || [];
        displayedEvents = events.filter((event) =>
            followedUserIds.includes(event.createdBy)
        );
    }

    // map for display
    const eventMap = displayedEvents.reduce((acc, event) => {
        const eventDate =
            event.openingDate && event.openingDate.toDate
                ? event.openingDate.toDate()
                : new Date(event.openingDate);
        const dateKey = eventDate.toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
    }, {});

    const handleDateClick = (date) => {
        console.log("Date clicked:", date.tileContent);
    };

    console.log("---- CalendarModal ----");

    console.log("currentUser", currentUser);
    console.log("events", events);
    console.log("displayedEvents", displayedEvents);
    console.log("eventMap", eventMap);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="p-6 rounded-lg max-w-2xl bg-white"
        >
            <div className="absolute left-10 top-10 z-[1000]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                        {viewMode === "mine"
                            ? "Your Calendar"
                            : "Followed Users' Events"}
                    </h2>
                    <Button
                        onPress={() =>
                            setViewMode(
                                viewMode === "mine" ? "followed" : "mine"
                            )
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        {viewMode === "mine"
                            ? "See Followed Users' Events"
                            : "See Your Events"}
                    </Button>
                </div>
                <Calendar
                    onClickDay={handleDateClick}
                    tileContent={({ date }) => {
                        const dateKey = date.toDateString();
                        console.log("Tile dateKey:", dateKey);
                        return eventMap[dateKey] ? (
                            <div className="mt-1">
                                {eventMap[dateKey].map((event, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            // marginTop: 2,
                                            // backgroundColor: "red", // red background to indicate data exists
                                            // padding: "2px",
                                            // borderRadius: "4px",
                                            opacity: 0.8,
                                        }}
                                    >
                                        <Link
                                            to={`/events/${event.id}`}
                                            className="text-white hover:underline text-xs bg-blue-400 rounded-md px-3 py-2"
                                        >
                                            {event.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : null;
                    }}
                    className={`font-sans ${styles.calendarCustom}`}
                />
                <div className="mt-4">
                    <Button onPress={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
}
