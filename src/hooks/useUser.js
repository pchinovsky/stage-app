import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../contexts/authContext";

export function useUser() {
    const { userId, user } = useContext(AuthContext);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [otherUsersData, setOtherUsersData] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // console.log('useUser', userId, currentUserData);


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

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllUsers(usersList);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // const fetchUsersByIds = async (userIds) => {
    //     if (!userIds || userIds.length === 0) return;
    //     // console.log('--- fetchUsersByIds userIds', userIds);


    //     try {
    //         const usersCollection = collection(db, "users");
    //         const userDocs = await getDocs(usersCollection);

    //         const users = {};
    //         userDocs.forEach((doc) => {
    //             if (userIds.includes(doc.id)) {
    //                 users[doc.id] = doc.data();
    //             }
    //         });

    //         setOtherUsersData((prev) => ({ ...prev, ...users }));
    //     } catch (err) {
    //         console.error("Error fetching users -", err);
    //     }
    // };

    const fetchUsersByIds = (userIds) => {
        if (!userIds || userIds.length === 0) return;
        const uniqueUserIds = [...new Set(userIds)];
        const usersCollection = collection(db, "users");
        const unsubscribe = onSnapshot(
            usersCollection,
            (snapshot) => {
                const users = {};
                snapshot.docs.forEach((doc) => {
                    if (uniqueUserIds.includes(doc.id)) {
                        users[doc.id] = doc.data();
                    }
                });
                setOtherUsersData((prev) => ({ ...prev, ...users }));
            },
            (error) => {
                console.error("Error fetching users -", error);
            }
        );
        return unsubscribe;
    };


    return {
        currentUser: currentUserData,
        fetchUsersByIds,
        otherUsers: otherUsersData,
        allUsers,
        loading,
        error,
    };
}
