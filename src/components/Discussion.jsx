import { useState } from "react";
import { Button, Tooltip, Avatar } from "@heroui/react";

export default function Discussion({ comments, onAddComment }) {
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            onAddComment(newComment);
            setNewComment("");
        }
    };

    return (
        <div className="absolute left-[0px] top-[0px] w-[750px] bg-white p-4 rounded-lg z-[100]">
            {/* Comments List */}
            <div className="h-60 overflow-y-auto space-y-3 p-2">
                {comments.map((comment, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-gray-200 rounded-lg"
                    >
                        {/* Avatar */}
                        <Tooltip content={comment.user.name} placement="top">
                            <Avatar src={comment.user.avatar} size="sm" />
                        </Tooltip>
                        <p className="text-black text-sm">{comment.text}</p>
                    </div>
                ))}
            </div>

            {/* input */}
            <div className="flex items-center mt-3 gap-2">
                <input
                    type="text"
                    className="flex-1 bg-gray-200 text-white p-2 rounded-lg outline-none"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                    onPress={handleAddComment}
                    className="bg-gray-100 text-black p-2 rounded-lg"
                >
                    Send
                </Button>
            </div>
        </div>
    );
}
