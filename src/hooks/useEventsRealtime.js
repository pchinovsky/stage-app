import { useState, useEffect, useMemo } from "react";
import { collection, query, where, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const getFiltersKey = (filters) => {
    try {
        return JSON.stringify(filters);
    } catch {
        return "default";
    }
};

export function useEventsRealtime(filters = {}) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const filtersKey = useMemo(() => getFiltersKey(filters), [filters]);

    useEffect(() => {
        setLoading(true);
        let unsubscribe;

        if (filters.id) {
            const docRef = doc(db, "events", filters.id);
            unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    setEvents([{ id: docSnap.id, ...docSnap.data() }]);
                } else {
                    setEvents([]);
                }
                setLoading(false);
            }, (err) => {
                setError(err);
                setLoading(false);
            });
        } else {
            const eventsRef = collection(db, "events");
            const conditions = Object.entries(filters).reduce((acc, [key, value]) => {
                if (value && Array.isArray(value) && value.length > 0) {
                    acc.push(where(key, "array-contains", value[0]));
                }
                return acc;
            }, []);

            const eventsQuery = conditions.length > 0 ? query(eventsRef, ...conditions) : eventsRef;

            unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
                setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            }, (err) => {
                setError(err);
                setLoading(false);
            });
        }

        return () => unsubscribe && unsubscribe();
    }, [filtersKey]);

    return { events, loading, error };
}
