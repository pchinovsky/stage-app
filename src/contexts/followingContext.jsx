import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "../hooks/useUser-new";

const FollowingContext = createContext();

export const FollowingProvider = ({ children }) => {
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

export const useFollowing = () => useContext(FollowingContext);
