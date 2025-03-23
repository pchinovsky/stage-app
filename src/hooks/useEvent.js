import { useEventsStore } from "../contexts/eventsContext";

export const useEvent = (id) => {
    const { events, loading, error } = useEventsStore();
    const event = events.find((e) => e.id === id);
    return { event, loading, error };
};
