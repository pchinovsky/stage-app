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
import { useEventsStore } from "./eventsContext";
import authApi from "../api/auth-api";
import { useError } from "./errorContext";
import { useUser } from "../hooks/useUser-new";

const FloatingContext = createContext();

export const useFloatingContext = () => useContext(FloatingContext);

export const FloatingProvider = ({ children }) => {
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
            const promises = selectedEvents.map(async (eventId) => {
                const eventRef = doc(db, "events", eventId);
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
            });

            await Promise.all(promises);
            clearSelection();
        } catch (err) {
            console.error("Error during bulk update:", err);
            showError(err.message || "An error occurred during bulk update.");
        }
    };

    // - 1
    // const updateFloatingPanelSettings = async (newSettings) => {
    //     if (!userId) return;

    //     try {
    //         await authApi.updateUser(userId, {
    //             floatingPanelSettings: newSettings,
    //         });
    //     } catch (error) {
    //         console.error("Error updating floating panel settings:", error);
    //         throw error;
    //     }
    // };

    // - 2
    // const updateFloatingPanelSettings = async (newSettings) => {
    //     if (!userId || !currentUser?.floatingPanelSettings) return;

    //     const updatedSettings = {
    //         ...currentUser.floatingPanelSettings,
    //         ...newSettings,
    //     };

    //     try {
    //         await authApi.updateUser(userId, {
    //             floatingPanelSettings: updatedSettings,
    //         });
    //     } catch (error) {
    //         console.error("Error updating floating panel settings:", error);
    //         throw error;
    //     }
    // };

    // - 3
    // const updateFloatingPanelSettings = async (newSettings) => {
    //     if (!userId || !currentUser?.floatingPanelSettings) return;

    //     const updatedSettings = {
    //         ...currentUser.floatingPanelSettings,
    //         ...newSettings, // Overwrite with new settings
    //     };

    //     try {
    //         setFloatingPanelSettings(updatedSettings);

    //         await authApi.updateUser(userId, {
    //             floatingPanelSettings: updatedSettings,
    //         });
    //     } catch (error) {
    //         console.error("Error updating floating panel settings:", error);
    //         throw error;
    //     }
    // };

    // - 4
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
