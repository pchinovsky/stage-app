import { useState } from "react";
import { Button, Tooltip, Avatar, Form, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import useComments from "../hooks/useComments";

export default function Discussion({ eventId, authorData }) {
    const {
        comments,
        loading,
        error,
        form,
        handleUpdateComment,
        handleRemoveComment,
    } = useComments(eventId, authorData);
    const [newComment, setNewComment] = useState("");

    const handleAddComment = async (e) => {
        e.preventDefault();
        console.log(
            "handleAddComment called with formValues:",
            form.formValues
        );

        if (form.formValues.content.trim() !== "") {
            await form.handleSubmit(e);
            form.setFormValues((prev) => ({
                ...prev,
                content: "",
            }));
        }
    };

    if (loading) return <p>Loading comments...</p>;
    if (error) return <p>Error loading comments: {error}</p>;

    return (
        <div className="absolute left-[0px] top-[0px] w-[640px] h-[380px] bg-white p-4 rounded-lg z-[100]">
            {/* Comments List */}
            <div className="h-[295px] overflow-y-auto space-y-3 p-2">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="flex items-center gap-3 p-2 bg-gray-200 rounded-lg"
                    >
                        {/* Avatar */}
                        <Tooltip content={comment.authorName} placement="top">
                            <Avatar src={comment.authorImage} size="sm" />
                        </Tooltip>
                        <p className="text-black text-sm">{comment.content}</p>
                        <Button
                            onPress={() => handleRemoveComment(comment.id)}
                            className="ml-auto hover:text-red-500"
                            isIconOnly
                        >
                            <Icon icon="mdi:close" className="text-xl" />
                        </Button>
                    </div>
                ))}
            </div>

            <Form
                onSubmit={handleAddComment}
                className="flex mt-3 gap-2 w-full"
            >
                <div className="flex gap-2 w-full">
                    <Input
                        type="text"
                        name="content"
                        className="flex-1"
                        placeholder="Write a comment..."
                        value={form.formValues.content}
                        onChange={form.handleInputChange}
                    />
                    <Button type="submit" color="primary" className="self-end">
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
}
