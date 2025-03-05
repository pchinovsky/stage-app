import { useState, useEffect } from "react";
import { Avatar, Tooltip, Button } from "@heroui/react";
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function User({ user, currentUserId }) {
    const [isFollowing, setIsFollowing] = useState(false);

    // check follow status
    useEffect(() => {
        (async () => {
            if (!user || !currentUserId) return;
            const currentUserRef = doc(db, "users", currentUserId);
            const currentUserSnap = await getDoc(currentUserRef);
            if (currentUserSnap.exists()) {
                const followingUsers =
                    currentUserSnap.data().followingUsers || [];
                setIsFollowing(followingUsers.includes(user.id));
            }
        })();
    }, [user, currentUserId]);

    const handleFollow = async () => {
        if (!user || !currentUserId) return;
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
        }
    };

    return (
        <Tooltip
            content={
                <Button
                    onPress={handleFollow}
                    disabled={!user || !currentUserId}
                    size="sm"
                    color={isFollowing ? "danger" : "primary"}
                    className="w-full"
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Button>
            }
            placement="left"
            className="py-0 px-0"
        >
            <div className="flex items-center gap-2 cursor-pointer">
                <Avatar src={user.image} alt={user.name} size="sm" />
                <span className="text-sm">{user.name}</span>
            </div>
        </Tooltip>
    );
}
