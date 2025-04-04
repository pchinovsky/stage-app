import { useState, useEffect, useRef } from "react";
import useForm from "./useForm";
import commentsApi from "../api/comments-api";
import { useError } from "../contexts/errorContext";

const initialValues = {
    author: "",
    authorImage: "",
    authorName: "",
    content: "",
    event: "",
};

export default function useComments(eventId, authorData) {
    const { showError } = useError();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const commentsList = await commentsApi.getCommentsByEventId(eventId);
            if (isMounted.current) {
                setComments(commentsList);
            }
        } catch (err) {
            if (isMounted.current) {
                showError(err.message || "An error occurred while fetching comments.");
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchComments();
    }, [eventId]);

    const handleCreateComment = async (formValues) => {
        try {
            const commentData = {
                ...formValues,
                author: authorData.id,
                authorImage: authorData.image,
                authorName: authorData.name,
                event: eventId,
            };

            const newComment = await commentsApi.createComment(commentData);

            if (isMounted.current) {
                setComments((prev) => [...prev, newComment]);
            }
        } catch (err) {
            showError(err.message || "An error occurred while creating comment.");
        }
    };

    const handleUpdateComment = async (commentId, updatedData) => {
        try {
            await commentsApi.updateComment(commentId, updatedData);
            if (isMounted.current) {
                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === commentId
                            ? { ...comment, ...updatedData }
                            : comment
                    )
                );
            }
        } catch (err) {
            showError(err.message || "An error occurred while updating comment.");
        }
    };

    const handleRemoveComment = async (commentId) => {
        try {
            await commentsApi.removeComment(commentId);
            if (isMounted.current) {
                setComments((prev) => prev.filter((c) => c.id !== commentId));
            }
        } catch (err) {
            showError(err.message || "An error occurred while removing comment.");
        }
    };

    const form = useForm(initialValues, (formValues) => handleCreateComment(formValues));

    return {
        comments,
        loading,
        form,
        handleUpdateComment,
        handleRemoveComment,
    };
}
