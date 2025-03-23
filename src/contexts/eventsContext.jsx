import React, { createContext, useContext } from "react";
import { useEvents } from "../hooks/useEvents";

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
    const { events, loading, error } = useEvents();
    // const { events, loading, error } = useEventsRealtime();

    return (
        <EventsContext.Provider value={{ events, loading, error }}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEventsStore = () => useContext(EventsContext);
