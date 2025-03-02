import { useState, useEffect, useMemo } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Key for filters (avoids useEffect infinite loops with obj deps)
const getFiltersKey = (filters) => {
    if (!filters || typeof filters !== "object") return "default";
    try {
        return JSON.stringify(filters);
    } catch (err) {
        console.error("Error stringifying filters:", err);
        return "error";
    }
};

export function useEvents(filters = {}) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filtersKey = useMemo(() => getFiltersKey(filters), [filters]);

    // console.log("Filters Key:", filtersKey); 
    console.log("Filters Key:", typeof filtersKey, filtersKey);


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                let eventsRef = collection(db, "events");
                let conditions = [];

                // Dynamic query - 
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (Array.isArray(value) && value.length > 0) {
                            conditions.push(where(key, "in", value));
                        }
                        else if (typeof value === "boolean" || typeof value === "string") {
                            conditions.push(where(key, "==", value));
                        }
                    }
                });

                const eventsQuery = conditions.length > 0 ? query(eventsRef, ...conditions) : eventsRef;

                const snapshot = await getDocs(eventsQuery);
                const fetchedEvents = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("Fetched Events:", fetchedEvents);

                setEvents(fetchedEvents);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchEvents();
    }, [filtersKey]);

    return { events, loading, error };
}
