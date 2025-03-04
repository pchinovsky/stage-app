import { useState, useEffect, useMemo } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
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

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                let fetchedEvents = [];

                if (filters.id) {
                    // Fetch single event 
                    const docRef = doc(db, "events", filters.id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        fetchedEvents = [{ id: docSnap.id, ...docSnap.data() }];
                    } else {
                        console.warn("No such event!");
                    }
                } else {
                    // Fetch all events or filtered events
                    let eventsRef = collection(db, "events");
                    let conditions = [];

                    // Dynamic query
                    Object.entries(filters).forEach(([key, value]) => {
                        if (value !== undefined && value !== null) {
                            if (Array.isArray(value) && value.length > 0) {
                                conditions.push(where(key, "in", value));
                            } else if (typeof value === "boolean" || typeof value === "string") {
                                conditions.push(where(key, "==", value));
                            }
                        }
                    });

                    const eventsQuery = conditions.length > 0 ? query(eventsRef, ...conditions) : eventsRef;
                    const snapshot = await getDocs(eventsQuery);
                    fetchedEvents = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                }

                console.log("Fetched Events:", fetchedEvents);

                setEvents(fetchedEvents);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError(err);
                setLoading(false);
            }
        })();
    }, [filtersKey]);

    return { events, loading, error };
}