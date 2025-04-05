import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, documentId } from "firebase/firestore";
import { useError } from "../contexts/errorContext";

export function useArtists(artistIds) {
    const showError = useError();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                if (artists.length === 0) setLoading(true);

                const artistRef = collection(db, "artists");
                let artistQuery;

                if (!artistIds || artistIds.length === 0) {
                    artistQuery = query(artistRef);
                } else {
                    artistQuery = query(artistRef, where(documentId(), "in", artistIds));
                }

                const snapshot = await getDocs(artistQuery);

                // apply state updates only if mounted - 
                if (isMounted) {
                    if (snapshot.empty) {
                        console.warn("No matching documents");
                        setArtists([]);
                    } else {
                        const fetchedArtists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setArtists(fetchedArtists);
                    }
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    const errMsg = err.message || "Error detected. Please try again.";
                    showError(errMsg);
                    setLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [artistIds, showError]);

    return { artists, loading };
}