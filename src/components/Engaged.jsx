import { useContext, useState, useEffect } from "react";
import { Card, Avatar, AvatarGroup, Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import User from "./User";
import { AuthContext } from "../contexts/authContext";
import { useUser } from "../hooks/useUser";
// import "./Engaged.module.css";
import styles from "./Engaged.module.css";

export default function Engaged({
    author,
    attendingIds = [],
    interestedIds = [],
    trigger,
}) {
    const [expanded, setExpanded] = useState(false);
    const { userId } = useContext(AuthContext);
    const { fetchUsersByIds, otherUsers, loading } = useUser();

    useEffect(() => {
        const userIds = [...attendingIds, ...interestedIds];
        if (userIds.length > 0) {
            const unsubscribe = fetchUsersByIds(userIds);
            return () => unsubscribe && unsubscribe();
        }
    }, [attendingIds, interestedIds, trigger]);

    const attendingUsers = attendingIds.map((id) => otherUsers[id]);
    const interestedUsers = interestedIds.map((id) => otherUsers[id]);

    return (
        <div
            className={`absolute left-[1100px] top-[330px] w-[350px] z-[1000] overflow-hidden flex
    ${expanded ? styles.cardMax : styles.cardMin} 
    bg-white text-black shadow-md rounded-lg border border-gray-200`}
            style={{ borderRadius: expanded ? "30px" : "40px" }}
        >
            <div
                className={`transition-all duration-1000 flex w-full ${
                    expanded
                        ? "flex-col items-start justify-start gap-1"
                        : "flex-row items-center justify-between"
                }`}
            >
                {!expanded && (
                    <AvatarGroup max={9}>
                        {loading ? (
                            <Spinner size="sm" />
                        ) : (
                            [author, ...attendingUsers, ...interestedUsers].map(
                                (user) =>
                                    user && (
                                        <Avatar
                                            key={user.id}
                                            src={user.image}
                                            size="md"
                                        />
                                    )
                            )
                        )}
                    </AvatarGroup>
                )}

                <Button
                    isIconOnly
                    variant="light"
                    onPress={() => setExpanded(!expanded)}
                    className="w-10 h-10 min-w-6 self-end"
                    style={{ padding: 0 }}
                    isDisabled={
                        attendingUsers.length === 0 &&
                        interestedUsers.length === 0
                    }
                >
                    <Icon
                        icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                        className="text-xl"
                    />
                </Button>

                {expanded && attendingUsers.length > 0 && (
                    <>
                        <p
                            className={`text-sm font-semibold text-gray-600 mt-2 transition-opacity duration-500 ${
                                expanded ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            Author
                        </p>
                        {loading ? (
                            <Spinner size="sm" />
                        ) : (
                            <User user={author} currentUserId={userId} />
                        )}

                        <p className="text-sm font-semibold text-gray-600 mt-4">
                            Attending
                        </p>
                        {loading ? (
                            <Spinner size="sm" />
                        ) : (
                            attendingUsers.map(
                                (user) =>
                                    user && (
                                        <User
                                            key={user.id}
                                            user={user}
                                            currentUserId={userId}
                                        />
                                    )
                            )
                        )}
                    </>
                )}

                {expanded && interestedUsers.length > 0 && (
                    <>
                        <p className="text-sm font-semibold text-gray-600 mt-4">
                            Interested
                        </p>
                        {loading ? (
                            <Spinner size="sm" />
                        ) : (
                            interestedUsers.map(
                                (user) =>
                                    user && (
                                        <User
                                            key={user.id}
                                            user={user}
                                            currentUserId={userId}
                                        />
                                    )
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
