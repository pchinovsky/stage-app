import { useContext, useState, useEffect } from "react";
import { Avatar, AvatarGroup, Button, Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { AuthContext } from "../contexts/authContext";
import { useUser } from "../hooks/useUser";
import User from "./User";

export default function Engaged({
    author,
    attendingIds = [],
    interestedIds = [],
}) {
    const [expanded, setExpanded] = useState(false);
    const [hideButton, setHideButton] = useState(false);
    const [showAvatars, setShowAvatars] = useState(true);

    const { userId } = useContext(AuthContext);
    const { fetchUsersByIds, otherUsers, loading } = useUser();

    useEffect(() => {
        const userIds = [...attendingIds, ...interestedIds];
        if (userIds.length > 0) {
            const unsubscribe = fetchUsersByIds(userIds);
            return () => unsubscribe && unsubscribe();
        }
    }, [attendingIds, interestedIds]);

    useEffect(() => {
        if (expanded) {
            setShowAvatars(false);
            setHideButton(false);
        } else {
            setHideButton(true);
            const timeout = setTimeout(() => {
                setShowAvatars(true);
                setHideButton(false);
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [expanded]);

    const usersPerPage = 6;

    const attendingUsers = attendingIds.map((id) => otherUsers[id]);
    const interestedUsers = interestedIds.map((id) => otherUsers[id]);
    const uniqueUsers = Array.from(
        new Map(
            [author, ...attendingUsers, ...interestedUsers]
                .filter(Boolean)
                .map((user) => [user.id, user])
        ).values()
    );

    const [currentPageAtt, setCurrentPageAtt] = useState(0);
    const [currentPageInt, setCurrentPageInt] = useState(0);
    const pageCountAtt = Math.ceil(attendingUsers.length / usersPerPage);
    const pageCountInt = Math.ceil(interestedUsers.length / usersPerPage);

    return (
        <motion.div
            layout
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
                duration: expanded ? 0.2 : 0.4,
                ease: "easeOut",
            }}
            className={`absolute left-[1100px] top-[330px] w-[350px] z-[1000] overflow-hidden flex
        bg-white text-black shadow-md rounded-lg border border-gray-200 p-2`}
            style={{
                borderRadius: expanded ? "30px" : "40px",
            }}
        >
            {!hideButton && (
                <Button
                    isIconOnly
                    variant="light"
                    radius="full"
                    onPress={() => setExpanded(!expanded)}
                    className="w-10 h-10 min-w-6 absolute top-2 right-2 z-[1011]"
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
            )}

            <div
                className={`transition-all duration-1000 flex w-full ${
                    expanded
                        ? "flex-col items-start justify-start gap-1 p-1"
                        : "flex-row items-center justify-between"
                }`}
            >
                <div className="relative w-full h-[40px]">
                    <AnimatePresence mode="wait">
                        {showAvatars && !expanded && (
                            <motion.div
                                key="showAvatars"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute left-0 top-0 w-full h-full flex items-center justify-start pointer-events-none z-[1010]"
                            >
                                <AvatarGroup max={9}>
                                    {loading ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        uniqueUsers.map((user) =>
                                            user ? (
                                                <Avatar
                                                    key={`av-${user.id}`}
                                                    src={user.image}
                                                    size="md"
                                                />
                                            ) : null
                                        )
                                    )}
                                </AvatarGroup>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {expanded && attendingUsers.length > 0 && (
                    <>
                        <div className="flex justify-between items-center w-full">
                            <p className="text-sm font-semibold text-gray-600 my-2">
                                Attending ({attendingUsers.length})
                            </p>
                            <div className="flex gap-1">
                                {attendingUsers.length > 6 && (
                                    <p className="text-[12px] text-center text-gray-500 mr-3 flex items-center">
                                        {currentPageAtt + 1}
                                    </p>
                                )}
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    isDisabled={currentPageAtt === 0}
                                    onPress={() =>
                                        setCurrentPageAtt((p) =>
                                            Math.max(0, p - 1)
                                        )
                                    }
                                >
                                    <Icon icon="mdi:chevron-left" />
                                </Button>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    isDisabled={
                                        currentPageAtt >= pageCountAtt - 1
                                    }
                                    onPress={() =>
                                        setCurrentPageAtt((p) =>
                                            Math.min(pageCountAtt - 1, p + 1)
                                        )
                                    }
                                >
                                    <Icon icon="mdi:chevron-right" />
                                </Button>
                            </div>
                        </div>
                        {loading ? (
                            <Spinner size="sm" />
                        ) : (
                            <div className="grid grid-cols-6 gap-2 w-full">
                                {attendingUsers
                                    .slice(
                                        currentPageAtt * usersPerPage,
                                        (currentPageAtt + 1) * usersPerPage
                                    )
                                    .map(
                                        (user) =>
                                            user && (
                                                <User
                                                    key={`att-${user.id}`}
                                                    user={user}
                                                    currentUserId={userId}
                                                    size="md"
                                                />
                                            )
                                    )}
                            </div>
                        )}
                    </>
                )}

                {expanded && interestedUsers.length > 0 && (
                    <>
                        <div className="flex justify-between items-center w-full">
                            <p className="text-sm font-semibold text-gray-600 my-2">
                                Interested ({interestedUsers.length})
                            </p>
                            <div className="flex gap-1">
                                {interestedUsers.length > 6 && (
                                    <p className="text-[12px] text-center text-gray-500 mr-3 flex items-center">
                                        {currentPageInt + 1}
                                    </p>
                                )}
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    isDisabled={currentPageInt === 0}
                                    onPress={() =>
                                        setCurrentPageInt((p) =>
                                            Math.max(0, p - 1)
                                        )
                                    }
                                >
                                    <Icon icon="mdi:chevron-left" />
                                </Button>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    isDisabled={
                                        currentPageInt >= pageCountInt - 1
                                    }
                                    onPress={() =>
                                        setCurrentPageInt((p) =>
                                            Math.min(pageCountInt - 1, p + 1)
                                        )
                                    }
                                >
                                    <Icon icon="mdi:chevron-right" />
                                </Button>
                            </div>
                        </div>
                        {loading ? (
                            <Spinner size="sm" />
                        ) : (
                            <div className="grid grid-cols-6 gap-2 w-full">
                                {interestedUsers
                                    .slice(
                                        currentPageInt * usersPerPage,
                                        (currentPageInt + 1) * usersPerPage
                                    )
                                    .map(
                                        (user) =>
                                            user && (
                                                <User
                                                    key={`int-${user.id}`}
                                                    user={user}
                                                    currentUserId={userId}
                                                />
                                            )
                                    )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}
