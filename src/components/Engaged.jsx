import { useContext, useState } from "react";
import { Card, Avatar, AvatarGroup, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import User from "./User";
import { AuthContext } from "../contexts/authContext";

export default function Engaged({ author, attending = [], interested = [] }) {
    const [expanded, setExpanded] = useState(false);
    const { userId } = useContext(AuthContext);

    // non-author engaged users -
    const involvedUsers = [...attending, ...interested];

    return (
        <Card className="absolute left-[490px] top-[410px] p-4 rounded-lg shadow-md w-[300px] z-[100]">
            <div className="flex items-start justify-between">
                <span className="font-semibold text-lg">Engaged</span>
                <Button
                    // size="icon"
                    isIconOnly
                    variant="bordered"
                    onClick={() => setExpanded(!expanded)}
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
                <User user={author} currentUserId={userId} />
            </div>

            {expanded && (
                <div className="mt-3 space-y-2 max-h-52 overflow-scroll">
                    {attending.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-600">
                                Attending
                            </p>
                            <div className="space-y-1">
                                {attending.map((user) => (
                                    <User
                                        key={user.id}
                                        user={user}
                                        currentUserId={userId}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {interested.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-600">
                                Interested
                            </p>
                            <div className="space-y-1">
                                {interested.map((user) => (
                                    <User
                                        key={user.id}
                                        user={user}
                                        currentUserId={userId}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!expanded && involvedUsers.length > 0 && (
                <div className="mt-3">
                    <AvatarGroup max={4}>
                        {involvedUsers.map((user) => (
                            <Avatar
                                key={user.id}
                                src={user.image}
                                alt={user.name}
                            />
                        ))}
                    </AvatarGroup>
                </div>
            )}
        </Card>
    );
}
