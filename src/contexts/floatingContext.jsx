import React, { createContext, useContext, useState } from "react";
import eventsApi from "../api/events-api";
import { db } from "../firebase/firebaseConfig";
import {
    doc,
    arrayUnion,
    arrayRemove,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { AuthContext } from "./authContext";

const FloatingContext = createContext();

export const useFloatingContext = () => useContext(FloatingContext);

export const FloatingProvider = ({ children }) => {
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);
    const { userId } = useContext(AuthContext);

    const toggleSelectionMode = () => {
        setSelectionMode((prev) => {
            if (prev) {
                clearSelection();
            }
            return !prev;
        });
    };

    const toggleEventSelection = (eventId) => {
        setSelectedEvents((prev) =>
            prev.includes(eventId)
                ? prev.filter((id) => id !== eventId)
                : [...prev, eventId]
        );
    };

    const clearSelection = () => setSelectedEvents([]);

    const bulkUpdate = async (actionType) => {
        const promises = selectedEvents.map(async (eventId) => {
            const eventRef = doc(db, "events", eventId);
            const userRef = doc(db, "users", userId);

            const eventSnap = await getDoc(eventRef);
            const eventData = eventSnap.data();

            const isAlreadyInList =
                actionType === "interested"
                    ? eventData.interested?.includes(userId)
                    : eventData.attending?.includes(userId);

            const eventUpdate =
                actionType === "interested"
                    ? {
                          interested: isAlreadyInList
                              ? arrayRemove(userId)
                              : arrayUnion(userId),
                      }
                    : {
                          attending: isAlreadyInList
                              ? arrayRemove(userId)
                              : arrayUnion(userId),
                      };

            const userUpdate =
                actionType === "interested"
                    ? {
                          interested: isAlreadyInList
                              ? arrayRemove(eventId)
                              : arrayUnion(eventId),
                      }
                    : {
                          attending: isAlreadyInList
                              ? arrayRemove(eventId)
                              : arrayUnion(eventId),
                      };

            await eventsApi.updateEvent(eventId, eventUpdate);
            await updateDoc(userRef, userUpdate);
        });

        await Promise.all(promises);
        clearSelection();
    };

    return (
        <FloatingContext.Provider
            value={{
                selectedEvents,
                selectionMode,
                toggleEventSelection,
                toggleSelectionMode,
                clearSelection,
                bulkUpdate,
            }}
        >
            {children}
        </FloatingContext.Provider>
    );
};
