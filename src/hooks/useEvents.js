import { useState, useEffect, useMemo } from "react";
import {
    collection,
    query,
    where,
    getDoc,
    doc,
    onSnapshot,
    orderBy,
    limit,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getFiltersKey } from "../../utils/getFiltersKey";


export function useEvents(filters = {}) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("use events filters", filters);

    const filtersKey = useMemo(() => getFiltersKey(filters), [filters]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        let unsubscribe;

        let eventsRef = collection(db, "events");
        let conditions = [];

        console.log("Full filters object:", filters);

        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            if (key === "popular") {
                if ("greaterThan" in value) {
                    conditions.push(where(value.field, ">=", value.greaterThan));
                }
                if ("lessThan" in value) {
                    conditions.push(where(value.field, "<", value.lessThan));
                }
                if ("equalTo" in value) {
                    conditions.push(where(value.field, "==", value.equalTo));
                }
                return;
            }

            // allowing some-in-all array filtering -
            if (Array.isArray(value)) {
                console.log("--- Value is an array:", value, "Length:", value.length);
                if (value.length > 0) {
                    if (key === "venue") {
                        console.log(`Adding "in" filter: ${key} → ${value}`);
                        conditions.push(where(key, "in", value));
                    } else if (value.length > 1) {
                        console.log(`Adding "array-contains-any" filter: ${key} → ${value}`);
                        conditions.push(where(key, "array-contains-any", value));
                    } else {
                        console.log(`Adding "array-contains" filter: ${key} → ${value[0]}`);
                        conditions.push(where(key, "array-contains", value[0]));
                    }
                }
                return;
            }

            if (typeof value === "object") {
                if ("greaterThan" in value || "lessThan" in value || "equalTo" in value) {
                    if ("greaterThan" in value) {
                        conditions.push(where(key, ">=", value.greaterThan));
                    }
                    if ("lessThan" in value) {
                        conditions.push(where(key, "<", value.lessThan));
                    }
                    if ("equalTo" in value) {
                        conditions.push(where(key, "==", value.equalTo));
                    }
                    return;
                }
            }

            if (typeof value === "string") {
                if (key === "title" || key === "description") {
                    console.log(`Adding range query for ${key}: ${value}`);
                    conditions.push(where(key, ">=", value));
                    conditions.push(where(key, "<=", value + "\uf8ff"));
                } else {
                    conditions.push(where(key, "==", value));
                }
            } else if (typeof value === "number") {
                conditions.push(where(key, "==", value));
            }
        });

        console.log("Final conditions:", conditions);
        console.log("Applying query with conditions:", conditions);

        let eventsQuery = conditions.length > 0 ? query(eventsRef, ...conditions) : eventsRef;

        if (filters.popular && filters.popular.sort) {
            eventsQuery = query(
                eventsQuery,
                orderBy(filters.popular.field, filters.popular.sort)
            );
            if (filters.popular.limit) {
                eventsQuery = query(eventsQuery, limit(filters.popular.limit));
            }
        }

        unsubscribe = onSnapshot(
            eventsQuery,
            (snapshot) => {
                const fetchedEvents = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("Fetched Events:", fetchedEvents);
                setEvents(fetchedEvents);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching events:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [filtersKey]);

    return { events, loading, error };
}
