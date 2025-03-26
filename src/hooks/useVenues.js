import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useError } from "../contexts/errorContext";

export function useVenues() {
    const { showError } = useError();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                if (venues.length === 0) setLoading(true);
                const venuesRef = collection(db, "venues");
                const snapshot = await getDocs(venuesRef);

                if (isMounted) {
                    const fetchedVenues = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setVenues(fetchedVenues);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    const errMsg = err.message || "Error fetching venues. Please try again.";
                    showError(errMsg);
                    setLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [showError]);

    return { venues, loading };
}