import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eventsApi from "../api/events-api";
import { useError } from "../contexts/errorContext";

const useEventDelete = () => {
    const { showError } = useError();
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const deleteEvent = async (eventId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event?");
        if (!confirmDelete) return;

        if (isMounted.current) setIsDeleting(true);

        try {
            await eventsApi.deleteEvent(eventId);
            navigate("/events");
        } catch (err) {
            console.error("Error deleting event:", err);
            if (isMounted.current) {
                showError(err.message || "Failed to delete event. Please try again.");
            }
        } finally {
            if (isMounted.current) setIsDeleting(false);
        }
    };

    return { deleteEvent, isDeleting };
};

export default useEventDelete;
