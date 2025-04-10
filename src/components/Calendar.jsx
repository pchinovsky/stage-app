import { useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Calendar.module.css";
import { Modal, Button, Tooltip } from "@heroui/react";
import { useUser } from "../hooks/useUser";
import { useEventsStore } from "../contexts/eventsContext";

export default function CalendarModal({ isOpen, onClose }) {
    const [viewMode, setViewMode] = useState("mine");
    const { currentUser, loading: userLoading, error: userError } = useUser();

    const {
        events,
        loading: eventsLoading,
        error: eventsError,
    } = useEventsStore();

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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="opaque"
            className="absolute left-[505px] top-10 p-6 rounded-lg max-w-2xl bg-white z-[1000] shadow-md"
        >
            <div className="absolute right-11 top-3 bottom-3 z-[1000] bg-white font-primary p-5 rounded-lg shadow-md">
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
                        className="bg-primary text-white px-4 py-2 rounded-lg"
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
                        const eventsForThisDay = eventMap[dateKey];
                        if (!eventsForThisDay) return null;

                        const maxVisible = 2;
                        const visibleEvents = eventsForThisDay.slice(
                            0,
                            maxVisible
                        );
                        const extraEvents = eventsForThisDay.slice(maxVisible);
                        const extraCount = eventsForThisDay.length - maxVisible;

                        return (
                            <div className="overflow-hidden mt-5">
                                {visibleEvents.map((event) => (
                                    <Link
                                        key={event.id}
                                        to={`/events/${event.id}`}
                                        className="block bg-primary text-white text-[10px] leading-tight rounded-md px-1 py-[4px] mb-[2px] truncate"
                                        title={event.title}
                                    >
                                        {event.title}
                                    </Link>
                                ))}
                                {extraCount > 0 && (
                                    <Tooltip
                                        content={
                                            <div className="flex flex-col items-start px-2 py-2">
                                                {eventsForThisDay.map(
                                                    (event) => (
                                                        <Link
                                                            key={event.id}
                                                            to={`/events/${event.id}`}
                                                            className="text-sm text-white hover:underline"
                                                        >
                                                            {event.title}
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        }
                                        placement="top"
                                        showArrow
                                        className="rounded-md bg-slate-900 text-white pb-[7px] px-3"
                                        classNames={{
                                            base: [
                                                "border-0",
                                                "mr-16",
                                                "before:bg-slate-900 before:border-0",
                                            ],
                                        }}
                                    >
                                        <span className="text-xs text-gray-700 underline cursor-pointer absolute top-2 right-2">
                                            +{extraCount} more...
                                        </span>
                                    </Tooltip>
                                )}
                            </div>
                        );
                    }}
                    className={`font-sans ${styles.calendarCustom}`}
                />
                <Button
                    onPress={onClose}
                    className="absolute bottom-4 right-4"
                    variant="ghost"
                    color="danger"
                >
                    Close
                </Button>
            </div>
        </Modal>
    );
}
