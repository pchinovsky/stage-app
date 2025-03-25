import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "./authContext";
import { useUser } from "../hooks/useUser-new";

const FollowingContext = createContext();

export const FollowingProvider = ({ children }) => {
    // const { userId } = useContext(AuthContext);

    const { currentUser, loading: userLoading } = useUser();
    const userId = currentUser ? currentUser.id : null;

    const [followingUsers, setFollowingUsers] = useState([]);
    const [followingArtists, setFollowingArtists] = useState([]);
    const [followingVenues, setFollowingVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        setFollowingUsers(currentUser.followingUsers || []);
        setFollowingArtists(currentUser.followingArtists || []);
        setFollowingVenues(currentUser.followingVenues || []);
        setLoading(userLoading);
    }, [userId, currentUser, userLoading]);

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
