import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function NonAuthGuard({ children }) {
    const { isAuth, authLoading, accessLogRef, accessRegRef } =
        useContext(AuthContext);
    const location = useLocation();
    const { pathname } = location;

    console.log("Guard:", {
        isAuth,
        authLoading,
        pathname,
        accessedRegister: accessRegRef.current,
        accessedLogin: accessLogRef.current,
    });
    if (authLoading) return null;

    // if (justLogRef?.current) {
    //     justLogRef.current = false;
    //     return null;
    // }

    // if (user && pathname === "/register" && accessRegRef.current) {
    //     accessRegRef.current = false;
    //     return null;
    // }

    // if (justLogRef?.current || justRegRef?.current) {
    //     justLogRef.current = false;
    //     justRegRef.current = false;
    //     return null;
    // }

    if (isAuth) {
        // if (pathname === "/login" && accessLogRef.current) {
        //     accessLogRef.current = false;
        //     return null;
        // }

        // if (pathname === "/register" && accessRegRef.current) {
        //     accessRegRef.current = false;
        //     return null;
        // }

        const errorMessage =
            location.pathname === "/login"
                ? "You are already logged in. Please log out to access the login page."
                : "You are already registered. Please log out to create a new account.";

        return (
            <Navigate
                to="/"
                replace
                state={{
                    from: location,
                    error: errorMessage,
                }}
            />
        );
    }

    return children;
}
