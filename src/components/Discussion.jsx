import { useContext, useState, useMemo } from "react";
import React from "react";
import { Button, Tooltip, Avatar, Form, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import useComments from "../hooks/useComments";
import { AuthContext } from "../contexts/authContext";
import OwnerGuard from "../guards/OwnerGuard";
import CommentList from "./CommentList";

// export default function Discussion({ eventId, authorData }) {
const Discussion = React.memo(function Discussion({ eventId, authorData }) {
    const { isAuth } = useContext(AuthContext);
    const { comments, loading, error, form, handleRemoveComment } = useComments(
        eventId,
        authorData
    );

    const [newComment, setNewComment] = useState("");

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (form.formValues.content.trim() !== "") {
            await form.handleSubmit(e);
            form.setFormValues((prev) => ({
                ...prev,
                content: "",
            }));
        }
    };

    // const memoizedCommentsList = useMemo(() => {
    //     return renderComments(comments, handleRemoveComment);
    // }, [comments, handleRemoveComment]);

    if (loading) return <p>Loading comments...</p>;
    if (error) return <p>Error loading comments: {error}</p>;

    return (
        <div className="absolute left-[0px] top-[0px] w-[955px] h-[335px] bg-white p-4 rounded-lg z-[100]">
            {/* Comments List */}
            {/* {memoizedCommentsList} */}

            <CommentList
                comments={comments}
                handleRemoveComment={handleRemoveComment}
            />

            {isAuth && (
                <Form
                    onSubmit={handleAddComment}
                    className="flex mt-3 gap-2 w-full"
                >
                    <div className="flex gap-2 w-full">
                        <Input
                            type="text"
                            name="content"
                            radius="sm"
                            className="flex-1"
                            placeholder="Write a comment..."
                            value={form.formValues.content}
                            onChange={form.handleInputChange}
                        />
                        <Button
                            type="submit"
                            color="primary"
                            className="self-end"
                            radius="sm"
                        >
                            Submit
                        </Button>
                    </div>
                </Form>
            )}
        </div>
    );
});

export default Discussion;
