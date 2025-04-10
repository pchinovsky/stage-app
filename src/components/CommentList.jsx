import React from "react";
import { useContext, useEffect, useMemo } from "react";
import { Button, Tooltip, Avatar, Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { AuthContext } from "../contexts/authContext";
import OwnerGuard from "../guards/OwnerGuard";
import User from "./User";
import { useUser } from "../hooks/useUser-new";

const CommentList = React.memo(({ comments, handleRemoveComment }) => {
    const { isAuth, userId: currentUserId } = useContext(AuthContext);
    const { allUsers } = useUser();

    const userMap = useMemo(() => {
        const map = {};
        allUsers.forEach((user) => {
            map[user.id] = user;
        });
        return map;
    }, [allUsers]);

    return (
        <div className="h-[250px] overflow-y-auto space-y-3 p-2">
            <AnimatePresence initial={false}>
                {comments.length === 0 ? (
                    <motion.p
                        key="no-comments"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-500 text-center mt-5"
                    >
                        {isAuth
                            ? "Be the first to add a comment."
                            : "Please log in to add comments."}
                    </motion.p>
                ) : (
                    comments.map((comment) => {
                        const user = userMap[comment.author];

                        if (!user) {
                            return (
                                <motion.div
                                    key={comment.id}
                                    className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Spinner size="sm" />
                                    <p className="text-gray-500 text-sm">
                                        Loading user...
                                    </p>
                                </motion.div>
                            );
                        }

                        return (
                            <motion.div
                                key={comment.id}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg"
                            >
                                <Tooltip content={user.name} placement="top">
                                    <User
                                        user={user}
                                        currentUserId={currentUserId}
                                        size="sm"
                                    />
                                </Tooltip>
                                <p className="text-black text-sm">
                                    {comment.content}
                                </p>
                                <OwnerGuard
                                    ownerId={comment.author}
                                    mode="display"
                                >
                                    <Button
                                        onPress={() =>
                                            handleRemoveComment(comment.id)
                                        }
                                        className="ml-auto hover:text-red-500 h-[30px]"
                                        isIconOnly
                                    >
                                        <Icon
                                            icon="mdi:close"
                                            className="text-xl"
                                        />
                                    </Button>
                                </OwnerGuard>
                            </motion.div>
                        );
                    })
                )}
            </AnimatePresence>
        </div>
    );
});

CommentList.displayName = "CommentList";

export default CommentList;
