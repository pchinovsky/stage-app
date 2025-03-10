import { useState } from "react";
import Calendar from "react-calendar";
import { Modal, Button } from "@heroui/react";
import "react-calendar/dist/Calendar.css";

export default function CalendarModal({
    isOpen,
    onClose,
    events,
    followedEvents,
}) {
    const [viewMode, setViewMode] = useState("mine");

    const eventDates = viewMode === "mine" ? events : followedEvents;
    const eventMap = eventDates.reduce((acc, event) => {
        const dateKey = new Date(event.date).toDateString();
        acc[dateKey] = acc[dateKey] ? [...acc[dateKey], event] : [event];
        return acc;
    }, {});

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="p-6 rounded-lg max-w-2xl bg-white"
        >
            <div className="absolute left-10 top-10 w-full h-auto flex justify-center">
                <div className=" z-[100] bg-white p-4 shadow-lg rounded-lg">
                    <div className="absolute left-10 top-10 flex  items-center mb-4 z-[100] w-full">
                        <h2 className="text-xl font-bold">Your Calendar</h2>
                        <button
                            onClick={() =>
                                setViewMode(
                                    viewMode === "mine" ? "followed" : "mine"
                                )
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            {viewMode === "mine"
                                ? "See Followed Users' Events"
                                : "See Your Events"}
                        </button>
                    </div>
                    <Calendar
                        tileContent={({ date }) => {
                            const dateKey = date.toDateString();
                            return eventMap[dateKey] ? (
                                <div className="text-xs text-center mt-1 bg-gray-100 rounded p-1">
                                    {eventMap[dateKey].map((event, i) => (
                                        <p
                                            key={i}
                                            className="text-blue-600 font-medium"
                                        >
                                            {event.title}
                                        </p>
                                    ))}
                                </div>
                            ) : null;
                        }}
                    />
                    <Button onPress={onClose} className="mt-4">
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
