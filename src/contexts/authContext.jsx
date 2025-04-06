import { createContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);

    const [isAuth, setIsAuth] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

<<<<<<< HEAD
=======
    const justLogRef = useRef(false);
    const justRegRef = useRef(false);
>>>>>>> parent of a7bf5a5 (Fixing NonAuthGuard to ref flags.)
    const accessRegRef = useRef(false);
    const accessLogRef = useRef(false);

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             setUser(user);
    //             setUserId(user.uid);
    //             setIsAuth(true);
    //         } else {
    //             setUser(null);
    //             setUserId(null);
    //             setIsAuth(false);
    //         }
    //         setAuthLoading(false);
    //     });

    //     return unsubscribe;
    // }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("onAuthStateChanged - user detected");
                console.log(
                    "onAuthStateChanged - justRegRef is",
                    justRegRef.current
                );

                if (!justLogRef.current && !justRegRef.current) {
                    setTimeout(() => {
                        setUser(user);
                        setUserId(user.uid);
                        setIsAuth(true);
                        setAuthLoading(false);
                    }, 50);
                    return;
                }

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
<<<<<<< HEAD
=======
        justLogRef,
        justRegRef,
>>>>>>> parent of a7bf5a5 (Fixing NonAuthGuard to ref flags.)
        accessRegRef,
        accessLogRef,
    };

    return (
        <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
    );
}
