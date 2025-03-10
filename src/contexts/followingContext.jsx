import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const FollowingContext = createContext();

export const FollowingProvider = ({ children, userId }) => {
    const [followingUsers, setFollowingUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchFollowingData = async () => {
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setFollowingUsers(userData.followingUsers || []);
                    setFollowing(userData.following || []);
                } else {
                    console.warn("User document not found.");
                }
            } catch (error) {
                console.error("Error fetching following data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowingData();
    }, [userId]);

    return (
        <FollowingContext.Provider
            value={{ followingUsers, following, loading }}
        >
            {children}
        </FollowingContext.Provider>
    );
};

// directly exporting executed context -
export const useFollowing = () => useContext(FollowingContext);
