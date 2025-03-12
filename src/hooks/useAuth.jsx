import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth-api";
import { AuthContext } from "../contexts/authContext";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export function useLogin() {
    const [error, setError] = useState(null);
    const { setUser, setIsAuth } = useContext(AuthContext);

    const log = async (data) => {
        try {
            const authData = await authApi.login(data);
            setUser(authData.user);
            setIsAuth(true);
        } catch (err) {
            setError(err.message);
        }
    };

    return log;
}

export function useRegister() {
    const [error, setError] = useState(null);
    const { setUser, setIsAuth } = useContext(AuthContext);

    const reg = async (data) => {
        try {
            const authData = await authApi.register(data);
            setUser(authData.user);
            setIsAuth(true);

            const newUser = {
                id: authData.user.uid,
                email: authData.user.email,
                name: data.username,
                image: "",
                invitedTo: [],
                attendingEvents: [],
                interestedEvents: [],
                followedBy: [],
                followingUsers: [],
                followingVenues: [],
                managedVenues: [],
                eventsFeaturedIn: [],
            };

            await setDoc(doc(db, "users", authData.user.uid), newUser);
        } catch (err) {
            setError(err.message);
        }
    };

    return reg;
}

export function useLogout() {
    const { setUser, setIsAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await authApi.logout();
            setUser(null);
            setIsAuth(false);
            navigate("/events");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return logout;
}
