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

    console.log("use events filters", filters);

    const filtersKey = useMemo(() => getFiltersKey(filters), [filters]);

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                setLoading(true);
                let fetchedEvents = [];

                if (filters.id) {
                    // single event 
                    const docRef = doc(db, "events", filters.id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        fetchedEvents = [{ id: docSnap.id, ...docSnap.data() }];
                    } else {
                        console.warn("No such event!");
                    }
                } else {
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

                        if (Array.isArray(value)) {
                            console.log("--- Value is an array:", value, "Length:", value.length);
                            if (value.length > 0) {
                                console.log(`Adding "array-contains" filter: ${key} → ${value[0]}`);
                                conditions.push(where(key, "array-contains", value[0]));
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

                    const eventsQuery = conditions.length > 0 ? query(eventsRef, ...conditions) : eventsRef;
                    const snapshot = await getDocs(eventsQuery);
                    fetchedEvents = snapshot.docs.map((doc) => ({
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
