// hooks/useCreateEvent.js
import { useUser } from "./useUser-new";
import { setDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import eventsApi from "../api/events-api";
import { useError } from "../contexts/errorContext";

export function useEventCreate() {
    const { currentUser } = useUser();
    const { showError } = useError();

    const createEvent = async (values) => {
        try {
            if (!currentUser?.id) throw new Error("User not authenticated.");
            const eventId = await eventsApi.createEvent(values);
            await setDoc(
                doc(db, "users", currentUser.id),
                { created: arrayUnion(eventId) },
                { merge: true }
            );
            return eventId;
        } catch (err) {
            const errMsg = err.message || "Failed to create event.";
            showError(errMsg);
            throw err;
        }
    };

    return createEvent;
}
