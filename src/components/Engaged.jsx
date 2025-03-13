import { useContext, useState, useEffect } from "react";
import { Card, Avatar, AvatarGroup, Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import User from "./User";
import { AuthContext } from "../contexts/authContext";
import { useUser } from "../hooks/useUser";

export default function Engaged({
    author,
    attendingIds = [],
    interestedIds = [],
    trigger,
}) {
    const [expanded, setExpanded] = useState(false);
    const { userId } = useContext(AuthContext);
    const { fetchUsersByIds, otherUsers, loading, error } = useUser();

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
        <Card className="absolute left-[490px] top-[410px] p-4 rounded-lg shadow-md w-[300px] z-[100]">
            <div className="flex items-start justify-between">
                <span className="font-semibold text-lg">Engaged</span>
                <Button
                    isIconOnly
                    variant="bordered"
                    onPress={() => setExpanded(!expanded)}
                    style={{ width: "5px !important", padding: "0px" }}
                    className="px-0 py-0 w-2"
                >
                    <Icon
                        icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                        className="text-xl"
                    />
                </Button>
            </div>

            <div className="flex flex-col items-start gap-3 mt-2">
                <p className="text-sm font-semibold text-gray-600">Author</p>
                {loading ? (
                    <Spinner size="sm" />
                ) : (
                    <User user={author} currentUserId={userId} />
                )}

                {expanded ? (
                    <>
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
                ) : (
                    <AvatarGroup>
                        {loading ? (
                            <Spinner size="sm" />
                        ) : (
                            [...attendingUsers, ...interestedUsers].map(
                                (user) =>
                                    user && (
                                        <Avatar
                                            key={user.id}
                                            src={user.image}
                                            size="sm"
                                        />
                                    )
                            )
                        )}
                    </AvatarGroup>
                )}
            </div>
        </Card>
    );
}
