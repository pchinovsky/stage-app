import { createContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);

    const [isAuth, setIsAuth] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // const justLogRef = useRef(false);
    // const justRegRef = useRef(false);
    const accessRegRef = useRef(false);
    const accessLogRef = useRef(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setUserId(user.uid);
                setIsAuth(true);
            } else {
                setUser(null);
                setUserId(null);
                setIsAuth(false);
            }
            setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    const getToken = async () => {
        return auth.currentUser ? await auth.currentUser.getIdToken() : null;
    };

    const authData = {
        user,
        userId,
        isAuth,
        setUser,
        setIsAuth,
        getToken,
        authLoading,
        // justLogRef,
        // justRegRef,
        accessRegRef,
        accessLogRef,
    };

    return (
        <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
    );
}
