import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import {
    doc,
    arrayUnion,
    arrayRemove,
    getDoc,
    increment,
} from "firebase/firestore";
import authApi from "../api/auth-api";
import eventsApi from "../api/events-api";
import { useError } from "./errorContext";
import { AuthContext } from "./authContext";
import { useEventsStore } from "./eventsContext";
import { useUser } from "../hooks/useUser-new";
import { calcTrending } from "../../utils/calcTrending";
import { useToast } from "./toastContext";

const FloatingContext = createContext();

export const useFloatingContext = () => useContext(FloatingContext);

export const FloatingProvider = ({ children }) => {
    const { showToast } = useToast();
    const { showError } = useError();

    const [selectedEvents, setSelectedEvents] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);
    const [uniformInterested, setUniformInterested] = useState(null);
    const [uniformAttending, setUniformAttending] = useState(null);
    const [applied, setApplied] = useState(false);
    const [floatingPanelSettings, setFloatingPanelSettings] = useState({
        isLocked: false,
        isTransparent: true,
        dockPosition: "top-left",
        persistPosition: false,
    });

    const { userId } = useContext(AuthContext);
    const { currentUser } = useUser();
    const { events } = useEventsStore();

    useEffect(() => {
        if (selectedEvents.length === 0) {
            setUniformInterested(null);
            setUniformAttending(null);
            return;
        }

        const selectedEventObjs = selectedEvents
            .map((id) => events.find((event) => event.id === id))
            .filter(Boolean);

        const uniformInterested = selectedEventObjs.every(
            (event) =>
                (event.interested?.includes(userId) || false) ===
                (selectedEventObjs[0].interested?.includes(userId) || false)
        );

        const uniformAttending = selectedEventObjs.every(
            (event) =>
                event.attending?.includes(userId || false) ===
                (selectedEventObjs[0].attending?.includes(userId) || false)
        );

        setUniformInterested(uniformInterested);
        setUniformAttending(uniformAttending);
    }, [selectedEvents, events, userId]);

    const toggleSelectionMode = () => {
        setSelectionMode((prev) => {
            if (prev) {
                clearSelection();
            }
            return !prev;
        });
    };

    const toggleEventSelection = (eventId) => {
        setApplied(false);

        setSelectedEvents((prev) =>
            prev.includes(eventId)
                ? prev.filter((id) => id !== eventId)
                : [...prev, eventId]
        );
    };

    const clearSelection = () => setSelectedEvents([]);

    const bulkUpdate = async (actionType) => {
        try {
            const addedEventNames = [];
            const removedEventNames = [];

            const promises = selectedEvents.map(async (eventId) => {
                const eventRef = doc(db, "events", eventId);
                const eventSnap = await getDoc(eventRef);
                const eventData = eventSnap.data();

                const isAlreadyInList =
                    actionType === "interested"
                        ? eventData.interested?.includes(userId)
                        : eventData.attending?.includes(userId);

                const toAdd = !isAlreadyInList;

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
                            involvedUpdate = {
                                involvedUsers: arrayRemove(userId),
                            };
                        }
                    } else {
                        involvedUpdate = { involvedUsers: arrayUnion(userId) };
                    }
                } else if (actionType === "interested") {
                    if (isAlreadyInList) {
                        if (!eventData.attending?.includes(userId)) {
                            involvedUpdate = {
                                involvedUsers: arrayRemove(userId),
                            };
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
                await calcTrending(eventData);
                await authApi.updateUser(userId, userUpdate);

                const event = events.find((e) => e.id === eventId);
                if (toAdd && event?.title) {
                    addedEventNames.push(event.title);
                } else if (!toAdd && event?.title) {
                    removedEventNames.push(event.title);
                }
            });

            await Promise.all(promises);
            clearSelection();

            let toastMsg = "";

            if (addedEventNames.length > 0) {
                toastMsg += `You are now ${actionType} in the following events:\n${addedEventNames.join("\n")}`;
            }

            if (removedEventNames.length > 0) {
                if (toastMsg) toastMsg += `\n\n`;
                toastMsg += `You are no longer ${actionType} in the following events:\n${removedEventNames.join("\n")}`;
            }

            if (toastMsg) showToast(toastMsg);
        } catch (err) {
            console.error("Error during bulk update:", err);
            showError(err.message || "An error occurred during bulk update.");
        }
    };

    const isEqual = (obj1, obj2) =>
        JSON.stringify(obj1) === JSON.stringify(obj2);

    const updateFloatingPanelSettings = async (newSettings) => {
        if (!userId || !currentUser?.floatingPanelSettings) return;

        const updatedSettings = {
            ...currentUser.floatingPanelSettings,
            ...newSettings,
        };

        if (isEqual(currentUser.floatingPanelSettings, updatedSettings)) {
            return;
        }

        try {
            setFloatingPanelSettings(updatedSettings);
            await authApi.updateUser(userId, {
                floatingPanelSettings: updatedSettings,
            });
        } catch (error) {
            console.error("Error updating floating panel settings:", error);
            throw error;
        }
    };

    return (
        <FloatingContext.Provider
            value={{
                selectedEvents,
                selectionMode,
                uniformAttending,
                uniformInterested,
                applied,
                setApplied,
                toggleEventSelection,
                toggleSelectionMode,
                clearSelection,
                bulkUpdate,
                floatingPanelSettings,
                setFloatingPanelSettings,
                updateFloatingPanelSettings,
            }}
        >
            {children}
        </FloatingContext.Provider>
    );
};
