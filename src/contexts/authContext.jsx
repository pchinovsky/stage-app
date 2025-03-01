import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                if (user) {
                    setUser(user);
                    setIsAuth(true);
                } else {
                    setUser(null);
                    setIsAuth(false);
                }
            }
        );

        return unsubscribe;
    }, []);

    const getToken = async () => {
        return auth.currentUser
            ? await auth.currentUser.getIdToken()
            : null;
    };

    const authData = {
        user,
        isAuth,
        setUser,
        setIsAuth,
        getToken,
    };

    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    );
}
