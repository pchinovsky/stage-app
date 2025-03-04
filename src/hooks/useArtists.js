import { useState, useEffect } from "react";
import { collection, query, where, getDocs, documentId } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export function useArtists(artistIds) {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!artistIds || artistIds.length === 0) {
            setArtists([]);
            setLoading(false);
            return;
        }

        (async () => {
            try {
                setLoading(true);

                const artistRef = collection(db, "artists");
                const artistQuery = query(artistRef, where(documentId(), "in", artistIds));
                const snapshot = await getDocs(artistQuery);

                if (snapshot.empty) {
                    console.warn("No matching documents");
                    setArtists([]);
                } else {
                    const fetchedArtists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setArtists(fetchedArtists);
                }
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        })();
    }, [artistIds]);

    return { artists, loading, error };
}
