import { useContext, useState, useMemo } from "react";
import React from "react";
import { Button, Tooltip, Avatar, Form, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import useComments from "../hooks/useComments";
import { AuthContext } from "../contexts/authContext";
import OwnerGuard from "../guards/OwnerGuard";
import { motion, AnimatePresence } from "framer-motion";

const CommentList = React.memo(({ comments, handleRemoveComment }) => {
    return (
        <div className="h-[250px] overflow-y-auto space-y-3 p-2">
            <AnimatePresence initial={false}>
                {comments.map((comment) => (
                    <motion.div
                        key={comment.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 p-2 bg-gray-200 rounded-lg"
                    >
                        <Tooltip content={comment.authorName} placement="top">
                            <Avatar src={comment.authorImage} size="sm" />
                        </Tooltip>
                        <p className="text-black text-sm">{comment.content}</p>
                        <OwnerGuard ownerId={comment.author} mode="display">
                            <Button
                                onPress={() => handleRemoveComment(comment.id)}
                                className="ml-auto hover:text-red-500"
                                isIconOnly
                            >
                                <Icon icon="mdi:close" className="text-xl" />
                            </Button>
                        </OwnerGuard>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
});

CommentList.displayName = "CommentList";

export default CommentList;
