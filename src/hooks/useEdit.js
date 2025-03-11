import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useForm from "../hooks/useForm";
import eventsApi from "../api/events-api";
import { eventSchema } from "../api/validationSchemas";
import { parseTime } from "@internationalized/date";

export default function useEdit(eventId, initialValues) {
    const navigate = useNavigate();
    const [loadingEvent, setLoadingEvent] = useState(true);

    const form = useForm(
        initialValues,
        (updatedEvent) => eventsApi.updateEvent(eventId, updatedEvent),
        `/events/${eventId}`,
        eventSchema
    );

    useEffect(() => {
        (async () => {
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

                    form.setFormValues(eventData);
                } else {
                    console.error("Event not found");
                    navigate("/events");
                }
            } catch (err) {
                console.error("Err fetching event:", err);
            } finally {
                setLoadingEvent(false);
            }
        })();
    }, [eventId, form.setFormValues, navigate]);

    return { ...form, loadingEvent };
}
