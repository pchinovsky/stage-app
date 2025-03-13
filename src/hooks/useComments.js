import { useState, useEffect } from "react";
import useForm from "./useForm";
import commentsApi from "../api/comments-api";

const initialValues = {
    author: "",
    authorImage: "",
    authorName: "",
    content: "",
    event: "",
};

export default function useComments(eventId, authorData) {

    console.log('author data', authorData);

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const commentsList = await commentsApi.getCommentsByEventId(eventId);
            setComments(commentsList);
        } catch (err) {
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [eventId]);

    const handleCreateComment = async (formValues) => {
        console.log("--- useComments - handleCreateComment", formValues);

        try {
            const commentData = {
                ...formValues,
                author: authorData.id,
                authorImage: authorData.image,
                authorName: authorData.name,
                event: eventId,
            };
            await commentsApi.createComment(commentData);
            fetchComments();
        } catch (err) {
            setError(err.message || "An error occurred.");
        }
    };

    const handleUpdateComment = async (commentId, updatedData) => {
        try {
            await commentsApi.updateComment(commentId, updatedData);
            fetchComments();
        } catch (err) {
            setError(err.message || "An error occurred.");
        }
    };

    const handleRemoveComment = async (commentId) => {
        try {
            await commentsApi.removeComment(commentId);
            fetchComments();
        } catch (err) {
            setError(err.message || "An error occurred.");
        }
    };

    const form = useForm(initialValues, (formValues) => handleCreateComment(formValues));

    return {
        comments,
        loading,
        error,
        form,
        handleUpdateComment,
        handleRemoveComment,
    };
}