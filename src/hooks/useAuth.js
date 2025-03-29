import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth-api";
import { AuthContext } from "../contexts/authContext";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useError } from "../contexts/errorContext";


export function useLogin() {
    const { showError } = useError();
    const { setUser, setIsAuth, justLogRef } = useContext(AuthContext);

    const log = async (data) => {
        try {
            const authData = await authApi.login(data);
            setUser(authData.user);
            setIsAuth(true);
            justLogRef.current = true;
        } catch (err) {
            const errMsg = err.message || "Error detected. Please try again.";
            showError(errMsg);
        }
    };

    return log;
}

export function useRegister() {
    const { showError } = useError();
    const { setUser, setIsAuth, justRegRef } = useContext(AuthContext);

    const reg = async (data) => {
        try {
            const authData = await authApi.register(data);

            await new Promise((res) => setTimeout(res, 100));

            console.log("useRegister - about to set justRegRef to true");

            justRegRef.current = true;
            setUser(authData.user);
            setIsAuth(true);

            const newUser = {
                id: authData.user.uid,
                email: authData.user.email,
                name: data.username,
                image: "",
                created: [],
                invitedTo: [],
                attending: [],
                interested: [],
                followedBy: [],
                followingArtists: [],
                followingVenues: [],
                followingUsers: [],
                managedVenue: "",
                eventsFeaturedIn: [],
                activeFilters: [],
                floatingPanelSettings: {
                    isLocked: false,
                    isTransparent: true,
                    dockPosition: "top-left",
                    persistPosition: false,
                }
            };

            await setDoc(doc(db, "users", authData.user.uid), newUser);
        } catch (err) {
            const errMsg = err.message || "Error detected. Please try again.";
            showError(errMsg);
        }
    };

    return reg;
}

export function useLogout() {
    const { showError } = useError();
    const { setUser, setIsAuth } = useContext(AuthContext);

    const logout = async () => {
        try {
            setUser(null);
            setIsAuth(false);
            await authApi.logout();
        } catch (err) {
            const errMsg = err.message || "Error detected. Please try again.";
            showError(errMsg);
        }
    };

    return logout;
}


