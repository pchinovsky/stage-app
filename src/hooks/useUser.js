import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../contexts/authContext";

export function useUser() {
    const { userId, user } = useContext(AuthContext);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [otherUsersData, setOtherUsersData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('useUser', userId, currentUserData);


    useEffect(() => {
        if (!user) return;

        (async () => {
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setCurrentUserData(userSnap.data());
                } else {
                    console.warn("No user data found.");
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    const fetchUsersByIds = async (userIds) => {
        if (!userIds || userIds.length === 0) return;

        try {
            const usersCollection = collection(db, "users");
            const userDocs = await getDocs(usersCollection);

            const users = {};
            userDocs.forEach((doc) => {
                if (userIds.includes(doc.id)) {
                    users[doc.id] = doc.data();
                }
            });

            setOtherUsersData((prev) => ({ ...prev, ...users }));
        } catch (err) {
            console.error("Error fetching users -", err);
        }
    };

    return {
        currentUser: currentUserData,
        fetchUsersByIds,
        otherUsers: otherUsersData,
        loading,
        error,
    };
}
