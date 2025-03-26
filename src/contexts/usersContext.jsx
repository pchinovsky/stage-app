import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "./authContext";
import { useError } from "./errorContext";

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
    const { showError } = useError();
    const { userId } = useContext(AuthContext);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // if (!userId) return;
        if (!userId) {
            setCurrentUserData(null);
            setLoading(false);
            return;
        }
        const userRef = doc(db, "users", userId);
        const unsubscribe = onSnapshot(
            userRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setCurrentUserData({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setCurrentUserData(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error("Err fetching current user - ", err);
                showError(`User loading failed: ${err.message}`);

                setError(err);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [userId]);

    useEffect(() => {
        const usersRef = collection(db, "users");
        const unsubscribe = onSnapshot(
            usersRef,
            (snapshot) => {
                const usersList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAllUsers(usersList);
            },
            (err) => {
                console.error("Error fetching all users:", err);
                showError(`Failed to load users list: ${err.message}`); // ✅

                setError(err);
            }
        );
        return () => unsubscribe();
    }, []);

    return (
        <UsersContext.Provider
            value={{ currentUser: currentUserData, allUsers, loading, error }}
        >
            {children}
        </UsersContext.Provider>
    );
};

export const useUsersStore = () => useContext(UsersContext);
