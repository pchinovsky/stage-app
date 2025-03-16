import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const FollowingContext = createContext();

export const FollowingProvider = ({ children, userId }) => {
    const [followingUsers, setFollowingUsers] = useState([]);
    const [followingArtists, setFollowingArtists] = useState([]);
    const [followingVenues, setFollowingVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        (async () => {
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setFollowingUsers(userData.followingUsers || []);
                    setFollowingArtists(userData.followingArtists || []);
                    setFollowingVenues(userData.followingVenues || []);
                } else {
                    console.warn("User document not found.");
                }
            } catch (error) {
                console.error("Error fetching following data:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    return (
        <FollowingContext.Provider
            value={{
                followingUsers,
                followingArtists,
                followingVenues,
                loading,
            }}
        >
            {children}
        </FollowingContext.Provider>
    );
};

// directly exporting executed context -
export const useFollowing = () => useContext(FollowingContext);
