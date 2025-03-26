import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useForm from "../hooks/useForm";
import eventsApi from "../api/events-api";
import { eventSchema } from "../api/validationSchemas";
import { parseTime } from "@internationalized/date";
import { useError } from "../contexts/errorContext";
import { useRef } from "react";

export default function useEdit(eventId, initialValues) {
    const { showError } = useError();
    const navigate = useNavigate();
    const [loadingEvent, setLoadingEvent] = useState(true);
    const isMounted = useRef(true);


    const route = `/events/${eventId}`;

    const form = useForm(
        initialValues,
        (updatedEvent) => eventsApi.updateEvent(eventId, updatedEvent),
        route,
        eventSchema
    );

    useEffect(() => {
        isMounted.current = true;

        const fetchEvent = async () => {
            try {
                const docRef = doc(db, "events", eventId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    let eventData = docSnap.data();

                    eventData.startTime = eventData.startTime
                        ? parseTime(eventData.startTime)
                        : "";
                    eventData.endTime = eventData.endTime
                        ? parseTime(eventData.endTime)
                        : "";

                    if (isMounted.current) {
                        form.setFormValues(eventData);
                    }
                } else {
                    showError("Event not found.");
                    navigate("/events");
                }
            } catch (err) {
                if (isMounted.current) {
                    showError(err.message || "Error fetching event.");
                }
            } finally {
                if (isMounted.current) {
                    setLoadingEvent(false);
                }
            }
        };

        fetchEvent();

        return () => {
            isMounted.current = false;
        };
    }, [eventId, form.setFormValues, navigate, showError]);

    return { ...form, loadingEvent };
}
