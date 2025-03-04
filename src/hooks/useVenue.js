import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export function useVenue(venueId) {
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!venueId) return;

        (async () => {
            try {
                setLoading(true);
                const venueRef = doc(db, "venues", venueId);
                const venueSnap = await getDoc(venueRef);

                if (!venueSnap.exists()) {
                    console.warn("No such venue!");
                    setVenue(null);
                } else {
                    setVenue({ id: venueSnap.id, ...venueSnap.data() });
                }
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        })();
    }, [venueId]);

    return { venue, loading, error };
}