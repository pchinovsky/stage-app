import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventsApi from '../api/events-api';

const useDeleteEvent = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const deleteEvent = async (eventId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event?");
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            await eventsApi.deleteEvent(eventId);
            navigate("/events");
        } catch (err) {
            console.error("Error deleting event:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteEvent, isDeleting };
};

export default useDeleteEvent;