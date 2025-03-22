import React, { createContext, useContext, useState, useEffect } from "react";
import eventsApi from "../api/events-api";
import { db } from "../firebase/firebaseConfig";
import {
    doc,
    arrayUnion,
    arrayRemove,
    getDoc,
    updateDoc,
    increment,
} from "firebase/firestore";
import { AuthContext } from "./authContext";
import { calcTrending } from "../../utils/calcTrending";

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
                          interestedCount: isAlreadyInList
                              ? increment(-1)
                              : increment(1),
                      }
                    : {
                          attending: isAlreadyInList
                              ? arrayRemove(userId)
                              : arrayUnion(userId),
                          attendingCount: isAlreadyInList
                              ? increment(-1)
                              : increment(1),
                      };

            let involvedUpdate = {};
            if (actionType === "attending") {
                if (isAlreadyInList) {
                    if (!eventData.interested?.includes(userId)) {
                        involvedUpdate = { involvedUsers: arrayRemove(userId) };
                    }
                } else {
                    involvedUpdate = { involvedUsers: arrayUnion(userId) };
                }
            } else if (actionType === "interested") {
                if (isAlreadyInList) {
                    if (!eventData.attending?.includes(userId)) {
                        involvedUpdate = { involvedUsers: arrayRemove(userId) };
                    }
                } else {
                    involvedUpdate = { involvedUsers: arrayUnion(userId) };
                }
            }
            const finalEventUpdate = { ...eventUpdate, ...involvedUpdate };

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

            await eventsApi.updateEvent(eventId, finalEventUpdate);

            await calcTrending(eventId);

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
