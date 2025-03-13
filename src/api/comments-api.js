import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

const commentsCollection = collection(db, "comments");

const createComment = async (commentData) => {
    try {
        const docRef = await addDoc(commentsCollection, commentData);
        return { id: docRef.id, ...commentData };
    } catch (error) {
        console.error("Err creating comment: ", error);
        throw error;
    }
};

const removeComment = async (commentId) => {
    try {
        await deleteDoc(doc(db, "comments", commentId));
    } catch (error) {
        console.error("Err removing comment: ", error);
        throw error;
    }
};

const updateComment = async (commentId, updatedData) => {
    try {
        await updateDoc(doc(db, "comments", commentId), updatedData);
    } catch (error) {
        console.error("Err updating comment: ", error);
        throw error;
    }
};

const getCommentById = async (commentId) => {
    try {
        const commentRef = doc(db, "comments", commentId);
        const commentSnap = await getDoc(commentRef);
        if (commentSnap.exists()) {
            return { id: commentSnap.id, ...commentSnap.data() };
        } else {
            throw new Error("Comment not found");
        }
    } catch (error) {
        console.error("Err getting comment by ID: ", error);
        throw error;
    }
};

const getAllComments = async () => {
    try {
        const commentsSnapshot = await getDocs(commentsCollection);
        const commentsList = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return commentsList;
    } catch (error) {
        console.error("Err getting all comments: ", error);
        throw error;
    }
};

const getCommentsByEventId = async (eventId) => {
    try {
        const q = query(commentsCollection, where("event", "==", eventId));
        const commentsSnapshot = await getDocs(q);
        const commentsList = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return commentsList;
    } catch (error) {
        console.error("Err getting comments by event ID: ", error);
        throw error;
    }
};

export default {
    createComment,
    removeComment,
    updateComment,
    getCommentById,
    getAllComments,
    getCommentsByEventId,
};