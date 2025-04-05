import { useState, useEffect, useContext } from "react";
import { Avatar, AvatarIcon, Tooltip, Button } from "@heroui/react";
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useError } from "../contexts/errorContext";
import { AuthContext } from "../contexts/authContext";

export default function User({ user, currentUserId }) {
    const { showError } = useError();
    const { isAuth } = useContext(AuthContext);

    const [isFollowing, setIsFollowing] = useState(false);
    const [imageSrc, setImageSrc] = useState(user?.image);

    useEffect(() => {
        if (user) setImageSrc(user.image);
    }, [user]);

    // check follow status
    useEffect(() => {
        (async () => {
            if (!user || !currentUserId) return;
            try {
                const currentUserRef = doc(db, "users", currentUserId);
                const currentUserSnap = await getDoc(currentUserRef);
                if (currentUserSnap.exists()) {
                    const followingUsers =
                        currentUserSnap.data().followingUsers || [];
                    setIsFollowing(followingUsers.includes(user.id));
                }
            } catch (err) {
                console.error("Error fetching follow status:", err);
                showError(err.message || "Error fetching follow status.");
            }
        })();
    }, [user, currentUserId]);

    const handleFollow = async () => {
        if (!user || !currentUserId) return;
        console.log("handle follow", user.id, " - ", currentUserId);

        try {
            const followedUserRef = doc(db, "users", user.id);
            const currentUserRef = doc(db, "users", currentUserId);

            if (isFollowing) {
                // unfollow
                await updateDoc(followedUserRef, {
                    followedBy: arrayRemove(currentUserId),
                });
                await updateDoc(currentUserRef, {
                    followingUsers: arrayRemove(user.id),
                });
                setIsFollowing(false);
            } else {
                // follow
                await updateDoc(followedUserRef, {
                    followedBy: arrayUnion(currentUserId),
                });
                await updateDoc(currentUserRef, {
                    followingUsers: arrayUnion(user.id),
                });
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Error updating follow status:", error);
            showError(error.message || "Error updating follow status.");
        }
    };

    return (
        <Tooltip
            content={
                <Button
                    onPress={handleFollow}
                    isDisabled={user?.id === currentUserId}
                    size="sm"
                    color={isFollowing ? "danger" : "primary"}
                    className="w-full"
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Button>
            }
            placement="left"
            className="py-0 px-0"
            isDisabled={!isAuth}
        >
            <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                    src={imageSrc}
                    fallback={<AvatarIcon />}
                    showFallback={!user?.image}
                    alt={user?.name || "User"}
                    size="md"
                    isBordered
                    color="primary"
                />
                <span className="text-sm">{user.name}</span>
            </div>
        </Tooltip>
    );
}
