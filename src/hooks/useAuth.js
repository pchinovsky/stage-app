import { useContext } from "react";
import { db } from "../firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import authApi from "../api/auth-api";
import { useError } from "../contexts/errorContext";
import { AuthContext } from "../contexts/authContext";

export function useLogin() {
    const { showError } = useError();
    const { setUser, setIsAuth } = useContext(AuthContext);

    const log = async (data) => {
        try {
            const authData = await authApi.login(data);
            setUser(authData.user);
            setIsAuth(true);
        } catch (err) {
            const errMsg = err.message || "Error detected. Please try again.";
            showError(errMsg);
        }
    };

    return log;
}

export function useRegister() {
    const { showError } = useError();
    const { setUser, setIsAuth } = useContext(AuthContext);

    const reg = async (data) => {
        try {
            const authData = await authApi.register(data);

            await new Promise((res) => setTimeout(res, 100));

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


