import { useState, useEffect, useMemo, useRef } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getFiltersKey } from "../../utils/getFiltersKey";
import { useError } from "../contexts/errorContext";

export function useEventsRelated(event) {
    const { showError } = useError();
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);

    const filters = useMemo(() => {
        const queries = {};
        if (event.artists && event.artists.length > 0) {
            queries.artists = event.artists;
        }
        if (event.categories && event.categories.length > 0) {
            queries.categories = event.categories;
        }
        return queries;
    }, [event]);

    const filtersKey = useMemo(() => getFiltersKey(filters), [filters]);

    useEffect(() => {
        isMounted.current = true;

        const fetchRelatedEvents = async () => {
            try {
                setLoading(true);
                const eventsRef = collection(db, "events");

                let eventResults = new Set();

                if (Object.keys(filters).length === 0) {
                    setRelatedEvents([]);
                    setLoading(false);
                    return;
                }

                for (let [key, value] of Object.entries(filters)) {
                    if (Array.isArray(value)) {
                        let q;
                        if (value.length > 1) {
                            q = query(eventsRef, where(key, "array-contains-any", value));
                        } else {
                            q = query(eventsRef, where(key, "array-contains", value[0]));
                        }
                        const snapshot = await getDocs(q);
                        snapshot.docs.forEach((doc) => {
                            eventResults.add(JSON.stringify({ id: doc.id, ...doc.data() }));
                        });
                    }
                }

                const mergedDocs = Array.from(eventResults).map((docStr) => JSON.parse(docStr));
                const finalEvents = mergedDocs.filter((e) => e.id !== event.id);
                setRelatedEvents(finalEvents);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching related events:", err);
                if (isMounted.current) {
                    showError(err.message || "Error fetching related events.");
                    setLoading(false);
                }
            }
        };

        fetchRelatedEvents();
        return () => {
            isMounted.current = false;
        };

    }, [filtersKey, event.id]);

    return { relatedEvents, loading };
}
