import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useError } from "../contexts/errorContext";

export function useVenue(venueId) {
    const { showError } = useError();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!venueId) return;

        let isMounted = true;

        (async () => {
            try {
                setLoading(true);
                const venueRef = doc(db, "venues", venueId);
                const venueSnap = await getDoc(venueRef);

                if (isMounted) {
                    if (!venueSnap.exists()) {
                        console.warn("No such venue!");
                        setVenue(null);
                    } else {
                        setVenue({ id: venueSnap.id, ...venueSnap.data() });
                    }
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    const errMsg = err.message || "Error fetching venue. Please try again.";
                    showError(errMsg);
                    setLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [venueId]);

    return { venue, loading };
}